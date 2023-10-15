import { Injectable } from '@studio/dependency-injection';
import { QueryHandler } from '../../../../shared/application/QueryHandler';
import { UserFinder } from '../../../domain/services/UserFinder';
import { User } from '../../../domain/User';
import { UserId } from '../../../domain/UserId';
import { UserRepository } from '../../../domain/UserRepository';

export class GetUserByIdQuery {
  public readonly id: string;
  constructor(params: { id: string }) {
    this.id = params.id;
  }
}

@Injectable({
  dependencies: [UserRepository],
})
export class GetUserByIdHandler
  implements QueryHandler<GetUserByIdQuery, User>
{
  private readonly userFinder: UserFinder;
  constructor(userRepository: UserRepository) {
    this.userFinder = new UserFinder(userRepository);
  }

  async execute(query: GetUserByIdQuery): Promise<User> {
    const id = UserId.of(query.id);

    return this.userFinder.findByIdOrThrow(id);
  }
}
