// https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
export type IfEquals<X, Y, A, B> =
	(<T>() => T extends X ? 1 : 2) extends
	(<T>() => T extends Y ? 1 : 2) ? A : B;

export type OptionalPropertyNames<T> = {
	[ K in keyof T ]-?: undefined extends T[ K ] ? K : never
}[ keyof T ];

export type RequiredPropertyNames<T> = {
	[ K in keyof T ]-?: undefined extends T[ K ] ? never : K
}[ keyof T ];

export type OptionalProperties<T> = Pick<T, OptionalPropertyNames<T>>;

export type RequiredProperties<T> = Pick<T, RequiredPropertyNames<T>>;

export type WritableKeysOf<T> = {
	[ P in keyof T ]: IfEquals<{ [ Q in P ]: T[ P ] }, { -readonly [ Q in P ]: T[ P ] }, P, never>
}[ keyof T ];
export type WritablePart<T> = Pick<T, WritableKeysOf<T>>;

export type GetArrayType<T extends Array<any>> = T extends (infer U)[] ? U : never;

export type DeepPartial<T> = {
	[ P in keyof T ]?: T[ P ] extends Array<infer U>
	? Array<DeepPartial<U>>
	: T[ P ] extends ReadonlyArray<infer U1>
	? ReadonlyArray<DeepPartial<U1>>
	: DeepPartial<T[ P ]>
};

export type NumberPropertyNames<T> = {
	[ K in keyof T ]: T[ K ] extends number ? K : never
}[ keyof T ];

export type NumberProperties<T> = Pick<T, NumberPropertyNames<T>>;

export type NeverPropertyNames<T> = {
	[ K in keyof T ]: T[ K ] extends never ? K : never
}[ keyof T ];

export type NeverProperties<T> = Pick<T, NeverPropertyNames<T>>;

export type ArrayPropertyNames<T> = {
	[ K in keyof T ]: T[ K ] extends Array<any> ? K : never
}[ keyof T ];

export type Filter<T, U extends T> = T extends U ? T : never;

export type PickNames<T, U> = {
	[ K in keyof T ]: T[ K ] extends U ? K : never
}[ keyof T ];

export type NonFunctionPropertyNames<T> = {
	[ K in keyof T ]-?: T[ K ] extends Function ? never : K
}[ keyof T ];

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export type NonFunctionRequiredPropertyNames<T> = {
	[ K in keyof T ]-?: undefined extends T[ K ]
	? never
	: T[ K ] extends Function ? never : K
}[ keyof T ];

export type NonFunctionOptionalPropertyNames<T> = {
	[ K in keyof T ]-?: undefined extends T[ K ]
	? T[ K ] extends Function ? never : K
	: never
}[ keyof T ];

export type Stringify<T extends Object> = {
	[ K in keyof T ]: T[ K ] extends never ? never : string
};

export type Typify<T extends Object, U> = {
	[ K in keyof T ]: T[ K ] extends never ? never : U
};

export type Dictionary<T> = {
	[ index: string ]: T;
} & Object;

export type NumericDictionary<T> = {
	[ index: number ]: T;
};
