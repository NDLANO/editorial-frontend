/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import TaxonomyLightbox from './Taxonomy/TaxonomyLightbox';

interface Props {
  contentUri: string;
  onClose: () => void;
  locale: string;
}

const GrepCodesModal = ({ contentUri, onClose, locale }: Props) => {
  return (
    <TaxonomyLightbox title={'Title'} onClose={onClose}>
      <></>
    </TaxonomyLightbox>
  );
};

export default GrepCodesModal;
