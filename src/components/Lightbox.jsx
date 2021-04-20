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
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { colors, breakpoints, spacing } from '@ndla/core';

const appearances = {
  big: css`
    max-width: 870px;
  `,
  fullscreen: css`
    align-self: center;
    margin: auto;
    min-width: 95vw;
    height: 95vh;
  `,
  modal: css`
    border-radius: 0;
    min-height: 210px;
    max-width: 620px;
    padding-bottom: ${spacing.normal};
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
  z-index: 1000;
  overflow-x: auto;
  ${p =>
    p.appearance === 'fullscreen' &&
    css`
      display: flex;
    `};

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
  margin: 52px auto 52px;
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

export const StyledCross = styled(Cross)`
  float: right;
  height: 24px;
  width: 24px;
  margin-right: 7px;
  color: ${colors.brand.grey};
  ${p => severities[p.severity]};
`;

const ChildWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
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
      hideCloseButton,
    } = this.props;

    return this.state.display ? (
      <StyledLightbox appearance={appearance}>
        <StyledLightboxContent
          maxWidth={width}
          appearance={appearance}
          severity={severity}
          css={contentCss}>
          {!hideCloseButton &&
            (closeButton ? (
              closeButton
            ) : (
              <Button
                css={closeLightboxButtonStyle}
                stripped
                data-testid="closeAlert"
                onClick={this.onCloseButtonClick}>
                <StyledCross severity={severity} />
              </Button>
            ))}
          <ChildWrapper>{children}</ChildWrapper>
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
  hideCloseButton: PropTypes.bool,
};

export default Lightbox;
