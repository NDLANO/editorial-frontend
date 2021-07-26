/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
// @ts-ignore
import { OneColumn, ErrorMessage } from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';

const NotFound = ({ t }: tType) => (
  <OneColumn cssModifier="clear">
    <ErrorMessage
      illustration={{
        url: '/not-exist.gif',
        altText: t('errorMessage.title'),
      }}
      messages={{
        title: t('errorMessage.title'),
        description: t('notFound.description'),
        back: t('errorMessage.back'),
        goToFrontPage: t('errorMessage.goToFrontPage'),
      }}
    />
  </OneColumn>
);

export default injectT(NotFound);
