export type JobStatus = 'open' | 'claimed' | 'completed';

export type RepairJob = {
  id: string;
  title: string;
  description?: string;
  location: string;
  budget: number;
  status: JobStatus;
  clientId: string;
  proId?: string;
  createdAt?: string;
  updatedAt?: string;
};
