/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import { MessageBox } from '@ndla/ui';
import config from '../../config';
import StructureContainer from './StructureContainer';
import { TaxonomyVersionProvider } from '../StructureVersion/TaxonomyVersionProvider';

const ProgrammePage = () => {
  const { t } = useTranslation();
  return (
    <TaxonomyVersionProvider>
      <HelmetWithTracker title={t('htmlTitles.programmePage')} />
      <MessageBox>
        {`[${t('taxonomy.previewProgrammes')}](${
          config.ndlaFrontendDomain
        }?taxStructure=true&versionHash=default)`}
      </MessageBox>
      <StructureContainer
        rootNodeType="PROGRAMME"
        childNodeTypes={['PROGRAMME', 'SUBJECT']}
        rootPath="/programme/"
        showResourceColumn={false}
      />
    </TaxonomyVersionProvider>
  );
};

export default ProgrammePage;
