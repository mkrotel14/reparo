import { getJobsDatabase } from '@/features/jobs/data/jobs-database';

const seedMetadataKey = 'jobs.dummyjson.seed.v1';
const todosUrl = 'https://dummyjson.com/todos?limit=0';

type DummyJsonTodo = {
  completed: boolean;
  id: number;
  todo: string;
  userId: number;
};

type DummyJsonTodosResponse = {
  todos: DummyJsonTodo[];
};

type SeedOptions = {
  clientId: string;
  fetchImpl?: typeof fetch;
};

export async function seedJobsFromDummyJson({ clientId, fetchImpl = fetch }: SeedOptions) {
  const database = await getJobsDatabase();
  const existingSeed = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_metadata WHERE key = ?',
    seedMetadataKey,
  );
  if (existingSeed) return { didSeed: false, importedCount: 0 };

  const response = await fetchImpl(todosUrl);
  if (!response.ok) throw new Error(`DummyJSON seed request failed (${response.status})`);

  const payload = (await response.json()) as DummyJsonTodosResponse;
  const todos = payload.todos.filter((todo) => todo.userId === 1);
  const now = new Date().toISOString();

  let result = { didSeed: false, importedCount: 0 };
  await database.withExclusiveTransactionAsync(async (transaction) => {
    const completedSeed = await transaction.getFirstAsync<{ value: string }>(
      'SELECT value FROM app_metadata WHERE key = ?',
      seedMetadataKey,
    );
    if (completedSeed) return;

    for (const todo of todos) {
      await transaction.runAsync(
        `INSERT OR IGNORE INTO jobs
          (id, source_todo_id, client_id, pro_id, title, description, status, created_at, updated_at)
         VALUES (?, ?, ?, NULL, ?, '', ?, ?, ?)`,
        `dummyjson-todo-${todo.id}`,
        todo.id,
        clientId,
        todo.todo,
        todo.completed ? 'completed' : 'open',
        now,
        now,
      );
    }

    await transaction.runAsync(
      'INSERT INTO app_metadata (key, value) VALUES (?, ?)',
      seedMetadataKey,
      now,
    );

    result = { didSeed: true, importedCount: todos.length };
  });

  return result;
}
