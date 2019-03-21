/**
 * Copyright (C) 2017 -present, NDLA
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Fragment } from 'react';
import Button from '@ndla/button';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { injectT } from '@ndla/i18n';
import { loginPersonalAccessToken } from '../../util/authHelpers';

const VerticalMenu = styled('ul')`
  padding: 0;
  margin: 0;
  list-style: none;
`;

const VerticalMenuItem = styled('li')`
  margin: 0 0 1em;
  max-width: 300px;
`;

const googleButtonStyle = css`
  background-color: #dd4b39;
  border-color: #dd4b39;
  min-width: 150px;
  display: block;
  margin: 0 auto;
  &:hover,
  &:focus {
    background-color: #c23321;
    border-color: #c23321;
  }
`;

export const LoginProviders = ({ t }) => (
  <Fragment>
    <h3>{t('loginProviders.description')}</h3>
    <VerticalMenu>
      <VerticalMenuItem>
        <Button
          css={googleButtonStyle}
          onClick={() => loginPersonalAccessToken('google-oauth2')}>
          Google
        </Button>
      </VerticalMenuItem>
    </VerticalMenu>
  </Fragment>
);

export default injectT(LoginProviders);
