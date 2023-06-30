/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import StructureContainer from './StructureContainer';
import { TaxonomyVersionProvider } from '../StructureVersion/TaxonomyVersionProvider';

const ProgrammePage = () => {
  const { t } = useTranslation();
  return (
    <TaxonomyVersionProvider>
      <HelmetWithTracker title={t('htmlTitles.programmePage')} />
      <StructureContainer
        rootNodeType="PROGRAMME"
        childNodeTypes={['PROGRAMME', 'SUBJECT']}
        rootPath="/programme/"
      />
    </TaxonomyVersionProvider>
  );
};

export default ProgrammePage;
