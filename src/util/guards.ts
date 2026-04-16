/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
  throw new Error(`This code should be unreachable but is not, because '${parameter}' is not of 'never' type.`);
};
