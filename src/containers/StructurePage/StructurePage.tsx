/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import StructureContainer from './NewStructureContainer';

const StructurePage = () => {
  const { t } = useTranslation();
  return (
    <>
      <HelmetWithTracker title={t('htmlTitles.structurePage')} />
      <StructureContainer />
    </>
  );
};

export default StructurePage;
