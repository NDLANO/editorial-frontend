/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, useContext } from "react";

const GridContext = createContext(false);

export const GridProvider = GridContext;

export const useInGrid = () => {
  const context = useContext(GridContext);
  return !!context;
};
