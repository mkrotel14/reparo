import { getProfileIdentity, getProfileSummary } from './profile-summary';

describe('profile summary', () => {
  it('creates a friendly, display-safe Client identity', () => {
    expect(getProfileIdentity({ createdAt: '2026-08-01T00:00:00.000Z', identityId: '12345678-1234-5678-9012-123456789012', role: 'client' })).toEqual({
      displayName: 'Reparo Client',
      email: 'client@reparo.local',
      localId: '12345678…9012',
      roleLabel: 'Client',
    });
  });

  it('counts only the active Pro’s assigned work', () => {
    const summary = getProfileSummary(
      { createdAt: '2026-08-01T00:00:00.000Z', identityId: 'pro-1', role: 'pro' },
      [
        { id: 'done', budget: 120, clientId: 'client-1', location: 'Brooklyn', proId: 'pro-1', status: 'completed', title: 'Done job' },
        { id: 'claimed', budget: 120, clientId: 'client-1', location: 'Brooklyn', proId: 'pro-1', status: 'claimed', title: 'Claimed job' },
        { id: 'other', budget: 120, clientId: 'client-1', location: 'Brooklyn', proId: 'pro-2', status: 'completed', title: 'Other job' },
      ],
    );

    expect(summary).toEqual({
      primaryMetric: { label: 'Jobs completed', value: 1 },
      supportingMetrics: [
        { label: 'Jobs claimed', value: 1 },
        { label: 'Total assigned', value: 2 },
      ],
    });
  });

  it('counts only the active Client’s requests', () => {
    const summary = getProfileSummary(
      { createdAt: '2026-08-01T00:00:00.000Z', identityId: 'client-1', role: 'client' },
      [
        { id: 'done', budget: 120, clientId: 'client-1', location: 'Brooklyn', status: 'completed', title: 'Done request' },
        { id: 'open', budget: 120, clientId: 'client-1', location: 'Brooklyn', status: 'open', title: 'Open request' },
        { id: 'other', budget: 120, clientId: 'client-2', location: 'Brooklyn', status: 'claimed', title: 'Other request' },
      ],
    );

    expect(summary).toEqual({
      primaryMetric: { label: 'Requests completed', value: 1 },
      supportingMetrics: [
        { label: 'Open requests', value: 1 },
        { label: 'In progress', value: 0 },
      ],
    });
  });
});
