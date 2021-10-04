type TypeOfReturnType = 'string' | 'number' | 'object' | 'function' | 'undefined';

interface GuardOptions {
  type?: TypeOfReturnType;
  lacksProp?: boolean;
}

export const createGuard = <T, S = T>(prop: keyof S, options?: GuardOptions) => {
  return (value: any): value is T => isType(prop, value, options);
};

export const createArrayGuard = <T, S = T>(prop: keyof S, options?: GuardOptions) => {
  return (value: any[]): value is T[] => value.every(v => isType(prop, v, options));
};

export const createReturnTypeGuard = <T, S = T>(prop: keyof S, options?: GuardOptions) => {
  return (value: () => any): value is () => T => isType(prop, value(), options);
};

const isType = <T, S = T>(prop: keyof S, value: any, options: GuardOptions = {}): value is T => {
  if (options.type !== undefined) {
    return typeof value[prop] === options.type;
  }
  if (options.lacksProp) {
    return value[prop] === undefined;
  }
  return value[prop] !== undefined;
};
