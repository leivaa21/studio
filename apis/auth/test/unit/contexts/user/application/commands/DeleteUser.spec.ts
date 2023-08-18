import { UserRepository } from '../../../../../../src/contexts/users/domain/UserRepository';
import { UserBuilder } from '../../../../../helpers/builders/user/UserBuilder';
import { mock, mockReset } from 'jest-mock-extended';
import {
  DeleteUser,
  DeleteUserCommand,
} from '../../../../../../src/contexts/users/application/commands/DeleteUser';
import { UserNotFoundError } from '../../../../../../src/contexts/users/domain/errors/UserNotFound';
import { EventBus } from '../../../../../../src/contexts/shared/domain/EventBus';

const userRepository = mock<UserRepository>();
const eventBus = mock<EventBus>();

describe('Delete a user', () => {
  beforeEach(() => {
    mockReset(userRepository);
    mockReset(eventBus);
  });

  it('Should delete an existant user', async () => {
    const user = new UserBuilder().aBasicCredentialsUser().build();
    const command = new DeleteUserCommand({
      userId: user.id.value,
    });

    const useCase = new DeleteUser(userRepository, eventBus);

    userRepository.findById.mockResolvedValue(user);

    await expect(useCase.execute(command)).resolves.not.toThrow();
    expect(userRepository.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        id: user.id,
      })
    );
    expect(eventBus.publish).toHaveBeenCalled();
  });

  it('Should not delete a user if user is not found', async () => {
    const user = new UserBuilder().aBasicCredentialsUser().build();
    const command = new DeleteUserCommand({
      userId: user.id.value,
    });

    const useCase = new DeleteUser(userRepository, eventBus);

    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(command)).rejects.toThrow(UserNotFoundError);
    expect(userRepository.update).not.toHaveBeenCalled();
    expect(eventBus.publish).not.toHaveBeenCalled();
  });
});
