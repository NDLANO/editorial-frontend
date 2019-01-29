/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import StructureContainer from './StructureContainer';

const StructurePage = ({ t }) => {
  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.structurePage')} />
      <StructureContainer />
    </Fragment>
  );
};

export default injectT(StructurePage);
