export type GetArrayType<T extends Array<any>> = T extends (infer U)[] ? U : never;

export type DeepPartial<T> = {
	[K in keyof T]?: T[K] | DeepPartial<T[K]>;
};

export type NonFunctionPropertyNames<T> = {
	[K in keyof T]: T[K] extends Function ? never : K
}[keyof T];

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export type NumberPropertyNames<T> = {
	[K in keyof T]: T[K] extends number ? K : never
}[keyof T];

export type NumberProperties<T> = Pick<T, NumberPropertyNames<T>>;

export type ArrayPropertyNames<T> = {
	[K in keyof T]: T[K] extends Array<any> ? K : never
}[keyof T];

export type Filter<T, U extends T> = T extends U ? T : never;
