import * as Crypto from 'expo-crypto';

import { getJobsDatabase } from '@/features/jobs/data/jobs-database';
import type { RepairJob } from '@/features/jobs/types';

type JobRow = {
  budget: number;
  client_id: string;
  created_at: string;
  description: string;
  id: string;
  location: string;
  pro_id: string | null;
  status: RepairJob['status'];
  title: string;
  updated_at: string;
};

function toJob(row: JobRow): RepairJob {
  return {
    budget: row.budget,
    clientId: row.client_id,
    createdAt: row.created_at,
    description: row.description,
    id: row.id,
    location: row.location,
    ...(row.pro_id ? { proId: row.pro_id } : {}),
    status: row.status,
    title: row.title,
    updatedAt: row.updated_at,
  };
}

export const jobsRepository = {
  async list(): Promise<RepairJob[]> {
    const database = await getJobsDatabase();
    const rows = await database.getAllAsync<JobRow>('SELECT * FROM jobs ORDER BY created_at DESC');
    return rows.map(toJob);
  },

  async create({ clientId, description = '', location = 'Your location', budget = 150, title }: Pick<RepairJob, 'clientId' | 'title'> & Partial<Pick<RepairJob, 'description' | 'location' | 'budget'>>) {
    const database = await getJobsDatabase();
    const createdAt = new Date().toISOString();
    const job: RepairJob = { id: Crypto.randomUUID(), clientId, title, description, location, budget, status: 'open', createdAt, updatedAt: createdAt };
    await database.runAsync(
      `INSERT INTO jobs (id, client_id, title, description, location, budget, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      job.id, job.clientId, job.title, job.description ?? '', job.location, job.budget, job.status, createdAt, createdAt,
    );
    return job;
  },

  async claim(jobId: string, proId: string) {
    const database = await getJobsDatabase();
    const result = await database.runAsync(
      "UPDATE jobs SET status = 'claimed', pro_id = ?, updated_at = ? WHERE id = ? AND status = 'open'",
      proId, new Date().toISOString(), jobId,
    );
    if (result.changes !== 1) throw new Error('Only open jobs can be claimed');
  },

  async complete(jobId: string, proId: string) {
    const database = await getJobsDatabase();
    const result = await database.runAsync(
      "UPDATE jobs SET status = 'completed', updated_at = ? WHERE id = ? AND status = 'claimed' AND pro_id = ?",
      new Date().toISOString(), jobId, proId,
    );
    if (result.changes !== 1) throw new Error('Only the assigned Pro can complete this job');
  },
};
