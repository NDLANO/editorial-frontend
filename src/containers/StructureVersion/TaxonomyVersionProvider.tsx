import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

const TaxonomyVersionContext = createContext<
  [string | undefined, Dispatch<SetStateAction<string | undefined>>] | undefined
>(undefined);

interface Props {
  children: ReactNode;
}

export const TaxonomyVersionProvider = ({ children }: Props) => {
  const versionState = useState<string | undefined>(undefined);
  return (
    <TaxonomyVersionContext.Provider value={versionState}>
      {children}
    </TaxonomyVersionContext.Provider>
  );
};

interface TaxonomyVersion {
  taxonomyVersion: string;
}

export const useTaxonomyVersion = (): TaxonomyVersion => {
  const versionContext = useContext(TaxonomyVersionContext);
  return {
    taxonomyVersion: versionContext?.[0] ?? 'default',
  };
};
