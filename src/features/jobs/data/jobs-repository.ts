import type { RepairJob } from '@/features/jobs/types';

let jobs: RepairJob[] = [
  { id: 'job-1', title: 'Leaking kitchen tap', location: 'Vila Madalena', budget: 180, status: 'open', clientId: 'client-1' },
  { id: 'job-2', title: 'Replace hallway light', location: 'Pinheiros', budget: 120, status: 'open', clientId: 'client-2' },
  { id: 'job-3', title: 'Fix cabinet hinge', location: 'Moema', budget: 90, status: 'claimed', clientId: 'client-3', proId: 'pro-1' },
];

const delay = () => new Promise((resolve) => setTimeout(resolve, 150));

export const jobsRepository = {
  async list() {
    await delay();
    return [...jobs];
  },
  async create(title: string) {
    await delay();
    const job: RepairJob = { id: `job-${Date.now()}`, title, location: 'Your location', budget: 150, status: 'open', clientId: 'client-1' };
    jobs = [job, ...jobs];
    return job;
  },
  async claim(jobId: string, proId: string) {
    await delay();
    jobs = jobs.map((job) => (job.id === jobId ? { ...job, status: 'claimed', proId } : job));
  },
  async complete(jobId: string) {
    await delay();
    jobs = jobs.map((job) => (job.id === jobId ? { ...job, status: 'completed' } : job));
  },
};
