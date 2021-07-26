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
import Status from '../../components/Status';

const Forbidden = ({ t }: tType) => (
  <Status code={403}>
    <OneColumn>
      <div>
        <h2>403 - {t('forbiddenPage.description')}</h2>
      </div>
    </OneColumn>
  </Status>
);

export default injectT(Forbidden);
