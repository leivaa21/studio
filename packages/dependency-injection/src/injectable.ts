import { DependencyContainer } from './container';
import { Constructor, InjectableOptions } from './types';

export function Injectable(options?: InjectableOptions) {
	return (constructor: Constructor<unknown>) => {
		DependencyContainer.register({
			class: constructor,
			dependencies: options?.dependencies,
		});
	};
}
