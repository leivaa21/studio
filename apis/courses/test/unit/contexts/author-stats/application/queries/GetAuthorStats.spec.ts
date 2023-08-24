import { mock, mockReset } from 'jest-mock-extended';
import {
  GetAuthorStats,
  GetAuthorStatsQuery,
} from '../../../../../../src/contexts/author-stats/application/queries/GetAuthorStats';
import { AuthorStatsRepository } from '../../../../../../src/contexts/author-stats/domain/AuthorStatsRepository';
import { AuthorStatsBuilder } from '../../../../../helpers/builders/AuthorStatsBuilder';
import { AuthorStatsNotFoundError } from '../../../../../../src/contexts/author-stats/domain/errors/AuthorStatsNotFound';

describe('Get existant author stats by author id', () => {
  const authorStatsRepository = mock<AuthorStatsRepository>();

  beforeEach(() => {
    mockReset(authorStatsRepository);
  });

  it('Should find an existant author stats', async () => {
    const authorStats = new AuthorStatsBuilder().build();
    const query = new GetAuthorStatsQuery({
      authorId: authorStats.authorId.value,
    });

    authorStatsRepository.find.mockResolvedValue(authorStats);

    const useCase = new GetAuthorStats(authorStatsRepository);

    expect(useCase.execute(query)).resolves.toEqual(authorStats);
  });

  it('Should throw NotFoundError on authorStats not found', async () => {
    const authorStats = new AuthorStatsBuilder().build();
    const query = new GetAuthorStatsQuery({
      authorId: authorStats.authorId.value,
    });

    authorStatsRepository.find.mockResolvedValue(null);

    const useCase = new GetAuthorStats(authorStatsRepository);

    expect(useCase.execute(query)).rejects.toThrow(AuthorStatsNotFoundError);
  });
});
