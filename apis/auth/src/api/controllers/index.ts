import { GetUserController } from './user/GetUserController';
import { SingUpController } from './user/SignUpController';
import { HealthController } from './_health';

const Controllers = [HealthController, SingUpController, GetUserController];

export { Controllers };
