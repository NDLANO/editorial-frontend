/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useContext } from 'react';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import StructureContainer from './StructureContainer';
import { LocaleContext, UserAccessContext } from '../App/App';

const StructurePage = ({ t }) => {
  const locale = useContext(LocaleContext);
  const userAccess = useContext(UserAccessContext);
  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.structurePage')} />
      <StructureContainer locale={locale} userAccess={userAccess} />
    </Fragment>
  );
};

export default injectT(StructurePage);
