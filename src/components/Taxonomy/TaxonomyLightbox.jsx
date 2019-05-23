/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import Button from '@ndla/button';
import PropTypes from 'prop-types';
import { Cross } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { spacing, colors } from '@ndla/core';
import Overlay from '../Overlay';
import Spinner from '../Spinner';

const TaxonomyLightbox = ({
  children,
  title,
  onSelect,
  t,
  loading,
  onClose,
}) => (
  <StyledLightboxWrapper>
    <Overlay onExit={onClose} />
    <StyledContentWrapper>
      <StyledHeader>
        {title}
        <Button css={closeButtonStyle} stripped onClick={onClose}>
          <Cross css={crossStyle} />
        </Button>
      </StyledHeader>
      <StyledContent>
        {children}
        {onSelect && (
          <Button
            data-testid="taxonomyLightboxButton"
            stripped
            css={selectButtonStyle}
            onClick={onSelect}>
            {loading ? <Spinner appearance="small" /> : t('form.choose')}
          </Button>
        )}
      </StyledContent>
    </StyledContentWrapper>
  </StyledLightboxWrapper>
);

const closeButtonStyle = css`
  height: 50px;
  width: 50px;
`;

const crossStyle = css`
  height: 24px;
  width: 24px;
  margin-right: 7px;
`;

const selectButtonStyle = css`
  &,
  &:hover {
  border-radius: 5px;
  background-color: white;
  margin-top: ${spacing.normal};
  padding: 3px ${spacing.large};
`;

const StyledLightboxWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1;
  display: flex;
  justify-content: center;
`;

const StyledContentWrapper = styled.div`
  background-color: ${colors.brand.greyLightest};
  box-shadow: 0 0 2px 0 rgba(115, 115, 115, 0.5);
  width: 600px;
  border-radius: 5px;
  position: absolute;
  top: 5%;
  z-index: 2;
  max-height: 90vh;
  overflow: auto;
`;

const StyledHeader = styled.div`
  background: linear-gradient(180deg, #5d97a9, #508a9c);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2rem;
  padding-left: ${spacing.small};
  height: 50px;
  color: ${colors.brand.greyLightest};
`;

const StyledContent = styled.div`
  padding: 2em;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;

TaxonomyLightbox.propTypes = {
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  title: PropTypes.string,
  onSelect: PropTypes.func,
};

export default injectT(TaxonomyLightbox);
