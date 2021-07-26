/*
 * Part of NDLA editorial-frontend.
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-ignore
import { OneColumn } from '@ndla/ui';
import React from 'react';
import { injectT, tType } from '@ndla/i18n';

const Forbidden = ({ t }: tType) => (
  <OneColumn>
    <div>
      <h2>403 - {t('forbiddenPage.description')}</h2>
    </div>
  </OneColumn>
);

export default injectT(Forbidden);
