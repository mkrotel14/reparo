export type JobStatus = 'open' | 'claimed' | 'completed';

export type RepairJob = {
  id: string;
  title: string;
  location: string;
  budget: number;
  status: JobStatus;
  clientId: string;
  proId?: string;
};
