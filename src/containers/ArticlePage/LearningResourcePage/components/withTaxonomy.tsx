/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ComponentType, ReactElement } from 'react';
import {
  TaxonomyVersion,
  useTaxonomyVersion,
} from '../../../StructureVersion/TaxonomyVersionProvider';

function withTaxonomy<P>(WrappedComponent: ComponentType<P & TaxonomyVersion>): ComponentType<P> {
  const WithTaxonomy = (props: P): ReactElement<P> => {
    const taxonomyVersion = useTaxonomyVersion();

    return <WrappedComponent {...{ ...props, ...taxonomyVersion }} />;
  };

  return WithTaxonomy;
}

export default withTaxonomy;
