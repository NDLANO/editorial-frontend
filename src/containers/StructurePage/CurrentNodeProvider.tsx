/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { Node } from "@ndla/types-taxonomy";

const CurrentNodeContext = createContext<[Node | undefined, Dispatch<SetStateAction<Node | undefined>>] | undefined>(
  undefined,
);

interface Props {
  children: ReactNode;
}

export const CurrentNodeProvider = ({ children }: Props) => {
  const currentNodeState = useState<Node | undefined>(undefined);

  return <CurrentNodeContext.Provider value={currentNodeState}>{children}</CurrentNodeContext.Provider>;
};

export const useCurrentNode = () => {
  const context = useContext(CurrentNodeContext);

  if (!context) {
    throw new Error("useCurrentNode must be used within a CurrentNodeProvider");
  }

  const [currentNode, setCurrentNode] = context;

  return { currentNode, setCurrentNode };
};
