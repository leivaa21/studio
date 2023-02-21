import { DependencyContainer } from '../container';

class SomeDependency {
	doSomething() {
		return 'something';
	}
}

class DoSomethingMore {
	constructor(private readonly something: SomeDependency) {}

	doSomethingMore() {
		return `${this.something.doSomething()} more`;
	}
}

class Example {
	run() {
		return 99;
	}
}

class SomeFactory {
	constructor(
		private readonly dep1: DoSomethingMore,
		private readonly dep2: Example
	) {}

	create() {
		return this.dep1.doSomethingMore().concat(this.dep2.run().toString());
	}
}
it('should be able to register dependencies with no subdependencies', () => {
	DependencyContainer.register({ class: SomeDependency });

	const dep = DependencyContainer.get(SomeDependency);

	expect(dep).toBeInstanceOf(SomeDependency);
});

it('should be able to register dependencies with subdependencies', () => {
	DependencyContainer.register({
		class: DoSomethingMore,
		dependencies: [SomeDependency],
	});

	const dep = DependencyContainer.get(DoSomethingMore) as DoSomethingMore;

	expect(dep).toBeInstanceOf(DoSomethingMore);
	expect(dep.doSomethingMore()).toStrictEqual('something more');
});

it('should be able to register dependencies with multiple subdependencies', () => {
	DependencyContainer.register({ class: Example });
	DependencyContainer.register({
		class: SomeFactory,
		dependencies: [DoSomethingMore, Example],
	});

	const dep = DependencyContainer.get(SomeFactory);
	expect(dep).toBeInstanceOf(SomeFactory);
});

it('should throw exception when calling a unregistered dependency', () => {
	class notRegisteredClass {
		err() {
			return 'err';
		}
	}

	expect(() => DependencyContainer.get(notRegisteredClass)).toThrowError();
});

it('should throw exception when registering a dependency twice', () => {
	class duplicatedClass {
		duplicated() {
			return 'dup';
		}
	}

	DependencyContainer.register({ class: duplicatedClass });

	expect(() =>
		DependencyContainer.register({ class: duplicatedClass })
	).toThrowError();
});
