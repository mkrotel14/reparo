import type { RepairJob } from '@/features/jobs/types';
import type { Session } from '@/features/session/types';

export type ProfileIdentity = {
  displayName: string;
  email: string;
  localId: string;
  roleLabel: string;
};

export type ProfileMetric = {
  label: string;
  value: number;
};

export type ProfileSummary = {
  primaryMetric: ProfileMetric;
  supportingMetrics: ProfileMetric[];
};

export function getProfileIdentity(session: Session): ProfileIdentity {
  const isPro = session.role === 'pro';

  return {
    displayName: isPro ? 'Reparo Pro' : 'Reparo Client',
    email: isPro ? 'pro@reparo.local' : 'client@reparo.local',
    localId: shortenLocalId(session.identityId),
    roleLabel: isPro ? 'Pro' : 'Client',
  };
}

export function getProfileSummary(session: Session, jobs: RepairJob[]): ProfileSummary {
  if (session.role === 'client') {
    const ownedJobs = jobs.filter((job) => job.clientId === session.identityId);

    return {
      primaryMetric: { label: 'Requests completed', value: countJobs(ownedJobs, 'completed') },
      supportingMetrics: [
        { label: 'Open requests', value: countJobs(ownedJobs, 'open') },
        { label: 'In progress', value: countJobs(ownedJobs, 'claimed') },
      ],
    };
  }

  const assignedJobs = jobs.filter((job) => job.proId === session.identityId);
  return {
    primaryMetric: { label: 'Jobs completed', value: countJobs(assignedJobs, 'completed') },
    supportingMetrics: [
      { label: 'Jobs claimed', value: countJobs(assignedJobs, 'claimed') },
      { label: 'Total assigned', value: assignedJobs.length },
    ],
  };
}

function countJobs(jobs: RepairJob[], status: RepairJob['status']) {
  return jobs.filter((job) => job.status === status).length;
}

function shortenLocalId(identityId: string) {
  if (identityId.length <= 12) return identityId;
  return `${identityId.slice(0, 8)}…${identityId.slice(-4)}`;
}
