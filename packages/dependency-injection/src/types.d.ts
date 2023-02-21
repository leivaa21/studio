/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T> = new (...args: any[]) => T;

export type DependencyInfo = {
	class: Constructor<any>;
	dependencies?: Array<Constructor<any>>;
};

type DependencyName = string;

export type InjectableOptions = {
	dependencies: Array<Constructor<any>>;
};
