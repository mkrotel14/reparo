import { render } from '@testing-library/react-native';

import { JobCard } from './job-card';

const mockAppTag = jest.fn((_props: unknown) => null);
jest.mock('@/design-system/components', () => ({ AppButton: () => null, AppTag: (props: unknown) => mockAppTag(props) }));

describe('<JobCard />', () => {
  it.each([['open', 'neutral'], ['claimed', 'warning'], ['completed', 'success']] as const)('maps %s to the %s AppTag tone', async (status, tone) => {
    await render(<JobCard job={{ id: 'job-1', title: 'Fix tap', location: 'Centro', budget: 80, clientId: 'client-1', status }} />);
    expect(mockAppTag).toHaveBeenLastCalledWith(expect.objectContaining({ tone }));
  });
});
