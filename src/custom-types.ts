export const customTypes = {
  date: {
    parse: (value: number) => new Date(value),
    format: (value: Date) => value.valueOf(),
  } satisfies DamascoCustomType<Date, number>,
};

export type CustomTypes = typeof customTypes;

type DamascoCustomType<T, U> = {
  parse: (value: U) => T;
  format: (value: T) => U;
};
