/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Path } from "slate";

const getNextPath = (path: Path, previous?: boolean): Path => {
  const workingPath = [...path];
  while (workingPath[workingPath.length - 1] === 0) workingPath.pop();
  return previous ? Path.previous(workingPath) : Path.next(path);
};

export default getNextPath;
