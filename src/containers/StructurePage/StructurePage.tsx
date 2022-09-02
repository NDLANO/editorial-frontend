/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import StructureContainer from './StructureContainer';
import { TaxonomyVersionProvider } from '../StructureVersion/TaxonomyVersionProvider';

const StructurePage = () => {
  const { t } = useTranslation();
  return (
    <TaxonomyVersionProvider>
      <HelmetWithTracker title={t('htmlTitles.structurePage')} />
      <StructureContainer />
    </TaxonomyVersionProvider>
  );
};

export default StructurePage;
