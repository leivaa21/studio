import {
	Constructor,
	DependencyInfo,
	DependencyName,
	ImplementationInfo,
} from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */
class DuplicatedDependencyException extends Error {
	constructor(dependencyName: string) {
		super(
			`A dependency can't be initialized twice on container! - ${dependencyName}`
		);
	}
}
class NotRegisteredException extends Error {
	constructor(dependencyName: string) {
		super(`Dependency is not registered in container! - ${dependencyName}`);
	}
}

class Container {
	private readonly dependencies = new Map<DependencyName, any>();
	private static instance?: Container = undefined;

	private constructor() {
		//
	}

	static getInstance(): Container {
		if (this.instance === undefined) this.instance = new Container();
		return this.instance;
	}

	register(dependency: DependencyInfo) {
		const dependencyName = dependency.class.name;
		const isAlreadyRegistered = this.dependencies.has(dependencyName);

		if (isAlreadyRegistered)
			throw new DuplicatedDependencyException(dependencyName);

		let subDependencies: Array<any> = [];
		if (dependency.dependencies) {
			subDependencies = dependency.dependencies.map((dep) => this.get(dep));
		}
		this.dependencies.set(
			dependencyName,
			new dependency.class(...subDependencies)
		);
	}

	registerImplementation<T>(dependency: ImplementationInfo<T>) {
		const dependencyName = dependency.constructor.name;
		const isAlreadyRegistered = this.dependencies.has(dependencyName);

		if (isAlreadyRegistered)
			throw new DuplicatedDependencyException(dependencyName);

		this.dependencies.set(dependencyName, dependency.implementation);
	}

	get<T>(dependency: Constructor<T>): T {
		const dependencyName = dependency.name;
		const isAlreadyRegistered = this.dependencies.has(dependencyName);

		if (!isAlreadyRegistered) throw new NotRegisteredException(dependencyName);

		const instance = this.dependencies.get(dependencyName);

		return instance;
	}
}

export const DependencyContainer = Container.getInstance();
