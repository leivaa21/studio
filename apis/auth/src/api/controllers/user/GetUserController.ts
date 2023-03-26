import { StatusCode } from '@studio/api-utils/http';
import { GetUserResponse } from '@studio/commons/dist/contracts/user/GetUserContracts';
import { DependencyContainer } from '@studio/dependency-injection';
import { JsonController, HttpCode, Get, QueryParam } from 'routing-controllers';
import { QueryBus } from '../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import { GetUserByEmailQuery } from '../../../contexts/users/application/queries/GetUser/GetUserByEmail';
import { User } from '../../../contexts/users/domain/User';

@JsonController('/user')
export class GetUserController {
  @Get('')
  @HttpCode(StatusCode.OK)
  async GetUser(@QueryParam('email') email: string): Promise<GetUserResponse> {
    const queryBus = DependencyContainer.get<QueryBus>(InMemoryQueryBus);
    console.log('hi');
    const user = await queryBus.dispatch<GetUserByEmailQuery, User>(
      new GetUserByEmailQuery({ email })
    );
    console.log('bye');
    return { id: user.id.value, nickname: user.nickname.value };
  }
}
