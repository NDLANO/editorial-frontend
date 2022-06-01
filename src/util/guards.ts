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

/** Function to make sure all cases of a type is handled.
 *  Compilation will fail if code is reachable with other type than never.
 *
 *  This example will fail because the 'two' case is not handled.
 *  But once a 'two' case is added to the switch it will compile successfully.
 *  Example:
 *  ```
 *  type SomeUnion = 'one' | 'two'
 *  function handleUnion(x: SomeUnion): boolean {
 *    switch(x) {
 *      case 'one':
 *        return true;
 *      default:
 *        unreachable(x);
 *    }
 *  }
 *  ```
 */
export const unreachable = (parameter: never): never => {
  throw new Error(
    `This code should be unreachable but is not, because '${parameter}' is not of 'never' type.`,
  );
};
