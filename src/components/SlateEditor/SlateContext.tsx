/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { createContext, useContext, useState, useEffect, FC } from 'react';

interface ProviderProps {
  isSubmitted?: boolean;
}
interface SlateContextType {
  submitted: boolean;
  setSubmitted: (s: boolean) => void;
}

const SlateContext = createContext<SlateContextType | undefined>(undefined);

const SlateProvider: FC<ProviderProps> = ({ isSubmitted, children }) => {
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (isSubmitted !== undefined) {
      setSubmitted(isSubmitted);
    }
  }, [isSubmitted]);

  return (
    <SlateContext.Provider value={{ submitted, setSubmitted }}>{children}</SlateContext.Provider>
  );
};

const useSlateContext = (): SlateContextType => {
  const context = useContext(SlateContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider');
  }
  return context;
};

export { SlateProvider, useSlateContext };
