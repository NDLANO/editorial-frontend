/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { TAXONOMY_VERSION_DEFAULT } from "../../constants";

const TaxonomyVersionContext = createContext<
  [string | undefined, Dispatch<SetStateAction<string | undefined>>] | undefined
>(undefined);

interface Props {
  children: ReactNode;
}

export const TaxonomyVersionProvider = ({ children }: Props) => {
  const versionState = useState<string | undefined>(undefined);
  return <TaxonomyVersionContext value={versionState}>{children}</TaxonomyVersionContext>;
};

export interface TaxonomyVersion {
  taxonomyVersion: string;
  changeVersion: (newHash: string) => void;
}

export const useTaxonomyVersion = (): TaxonomyVersion => {
  const versionContext = useContext(TaxonomyVersionContext);
  const changeVersion = (newHash: string) => {
    if (!versionContext) {
      throw new Error("You cannot change the taxonomy version without having a TaxonomyVersionProvider present!");
    }
    versionContext[1](newHash);
  };
  return {
    taxonomyVersion: versionContext?.[0] ?? TAXONOMY_VERSION_DEFAULT,
    changeVersion,
  };
};
