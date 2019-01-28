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
import styled, { css } from 'react-emotion';
import { colors, breakpoints, spacing } from '@ndla/core';

const appearances = {
  big: css`
    max-width: 870px;
  `,
  fullscreen: css`
    max-width: 95%;
  `,
  modal: css`
    border-radius: 0;
    min-height: 210px;
    max-width: 620px;
    padding-bottom: ${spacing.noraml};
  `,
};

const severities = {
  success: css`
    background-color: ${colors.support.green};
    color: white;
  `,
  info: css`
    background-color: white;
    color: black;
  `,
  warning: css`
    background-color: ${colors.support.yellow};
    color: white;
  `,
  danger: css`
    background-color: ${colors.support.red};
    color: white;
  `,
};

const StyledLightbox = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 100;
  overflow-x: auto;

  @media (max-width: ${breakpoints.tabletWide}) {
    top: 64px;
    overflow-y: auto;
    white-space: normal;
    z-index: 26;
  }

  @media (max-width: ${breakpoints.mobileWide}) {
    top: 43px;
  }
`;

const StyledLightboxContent = styled('div')`
  overflow-x: auto;
  background-color: white;
  margin: 10% auto 0;
  padding: 1em 2em 3em;
  max-width: ${p => p.maxWidth || '400px'};
  border-radius: 5px;
  ${p => appearances[p.appearance]} ${p => severities[p.severity]};
`;

export const closeLightboxButtonStyle = css`
  float: right;
  height: 44px;
  width: 44px;
  margin-top: -5px;
  margin-right: -20px;
`;

export const closeLightboxCrossStyle = severity => css`
  float: right;
  height: 24px;
  width: 24px;
  margin-right: 7px;
  color: ${colors.brand.grey};
  ${severities[severity]};
`;

class Lightbox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { display: props.display };
    this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
  }

  onCloseButtonClick(evt) {
    this.setState({ display: false }, () => this.props.onClose());
    evt.preventDefault();
  }

  static getDerivedStateFromProps({ display }, prevState) {
    if (display !== prevState.display) {
      return { display };
    }
    return null;
  }

  render() {
    const {
      children,
      closeButton,
      width,
      appearance,
      severity,
      contentCss,
    } = this.props;

    return this.state.display ? (
      <StyledLightbox>
        <StyledLightboxContent
          maxWidth={width}
          appearance={appearance}
          severity={severity}
          css={contentCss}>
          {closeButton ? (
            closeButton
          ) : (
            <Button
              css={closeLightboxButtonStyle}
              stripped
              onClick={this.onCloseButtonClick}>
              <Cross css={closeLightboxCrossStyle(severity)} />
            </Button>
          )}
          {children}
        </StyledLightboxContent>
      </StyledLightbox>
    ) : null;
  }
}

Lightbox.propTypes = {
  onClose: PropTypes.func.isRequired,
  display: PropTypes.bool,
  width: PropTypes.string,
  closeButton: PropTypes.node,
  appearance: PropTypes.oneOf(['modal', 'big', 'fullscreen']),
  severity: PropTypes.oneOf(['danger', 'info', 'success', 'warning']),
  contentCss: PropTypes.string,
};

export default Lightbox;
