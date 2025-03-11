export const customTypes = {
  date: {
    parse: (value: number) => new Date(value),
    stringify: (value: Date) => value.valueOf(),
  } satisfies DamascoCustomType<Date, number>,
};

export type CustomTypes = typeof customTypes;

type DamascoCustomType<T, U> = {
  parse: (value: U) => T;
  stringify: (value: T) => U;
};
