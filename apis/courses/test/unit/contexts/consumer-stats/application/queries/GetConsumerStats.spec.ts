import { mock, mockReset } from 'jest-mock-extended';
import {
  GetConsumerStats,
  GetConsumerStatsQuery,
} from '../../../../../../src/contexts/consumer-stats/application/queries/GetConsumerStats';
import { ConsumerStatsRepository } from '../../../../../../src/contexts/consumer-stats/domain/ConsumerStatsRepository';
import { ConsumerStatsBuilder } from '../../../../../helpers/builders/ConsumerStatsBuilder';
import { ConsumerStatsNotFoundError } from '../../../../../../src/contexts/consumer-stats/domain/errors/ConsumerStatsNotFoundError';

describe('Get existant consumer stats by user id', () => {
  const consumerStatsRepository = mock<ConsumerStatsRepository>();

  beforeEach(() => {
    mockReset(consumerStatsRepository);
  });

  it('Should find an existant consumer stats', async () => {
    const consumerStats = new ConsumerStatsBuilder().build();
    const query = new GetConsumerStatsQuery({
      userId: consumerStats.userId.value,
    });

    consumerStatsRepository.find.mockResolvedValue(consumerStats);

    const useCase = new GetConsumerStats(consumerStatsRepository);

    expect(useCase.execute(query)).resolves.toEqual(consumerStats);
  });

  it('Should throw NotFoundError on consumerStats not found', async () => {
    const consumerStats = new ConsumerStatsBuilder().build();
    const query = new GetConsumerStatsQuery({
      userId: consumerStats.userId.value,
    });

    consumerStatsRepository.find.mockResolvedValue(null);

    const useCase = new GetConsumerStats(consumerStatsRepository);

    expect(useCase.execute(query)).rejects.toThrow(ConsumerStatsNotFoundError);
  });
});
