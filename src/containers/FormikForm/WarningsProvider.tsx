/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { WarningType } from '../../interfaces';

interface Props {
  children?: ReactNode;
  initialValues?: WarningType[];
}
const WarningsContext = createContext<
  [WarningType[], Dispatch<SetStateAction<WarningType[]>>] | undefined
>(undefined);

export const WarningsProvider = ({ children, initialValues = [] }: Props) => {
  const messagesState = useState<WarningType[]>(initialValues);
  return <WarningsContext.Provider value={messagesState}>{children}</WarningsContext.Provider>;
};

export const useWarnings = () => {
  const context = useContext(WarningsContext);
  if (context === undefined) {
    throw new Error('useWarnings can only be used within a WarningsContext');
  }
  const [warnings] = context;

  return {
    warnings,
  };
};
