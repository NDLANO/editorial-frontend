/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent, PureComponent, ReactNode } from 'react';
import { ButtonV2 } from '@ndla/button';
import { Cross } from '@ndla/icons/action';
import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/react';
import { colors, breakpoints, spacing } from '@ndla/core';
import { MessageSeverity } from '../interfaces';

const appearances: Record<string, SerializedStyles> = {
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

const severities: Record<string, SerializedStyles> = {
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

const StyledLightbox = styled.div<{ appearance?: string }>`
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

interface StyledContentProps {
  maxWidth?: string;
  appearance?: string;
  severity?: string;
}

const StyledContent = styled.div<StyledContentProps>`
  overflow-x: auto;
  background-color: white;
  margin: 52px auto 52px;
  padding: 1em 2em 3em;
  max-width: ${p => p.maxWidth || '400px'};
  border-radius: 5px;
  ${p => (p.appearance ? appearances[p.appearance] : null)}
  ${p => (p.severity ? severities[p.severity] : null)};
`;

export const StyledButton = styled(ButtonV2)`
  float: right;
  height: 44px;
  width: 44px;
  margin-top: -5px;
  margin-right: -20px;
`;

export const StyledCross = styled(Cross)<{ severity?: string }>`
  float: right;
  height: 24px;
  width: 24px;
  margin-right: 7px;
  color: ${colors.brand.grey};
  ${p => (p.severity ? severities[p.severity] : null)};
`;

const ChildWrapper = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
`;

interface State {
  display: boolean;
}

interface Props {
  onClose: Function;
  display: boolean;
  width?: string;
  closeButton?: ReactNode;
  appearance?: 'modal' | 'big' | 'fullscreen';
  severity?: MessageSeverity;
  contentCss?: SerializedStyles;
  hideCloseButton?: boolean;
}

class Lightbox extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { display: props.display };
    this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
  }

  onCloseButtonClick(evt: MouseEvent<HTMLButtonElement>) {
    this.setState({ display: false }, () => this.props.onClose());
    evt.preventDefault();
  }

  static getDerivedStateFromProps({ display }: Props, prevState: State) {
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
        <StyledContent
          maxWidth={width}
          appearance={appearance}
          severity={severity}
          css={contentCss}>
          {!hideCloseButton &&
            (closeButton ? (
              closeButton
            ) : (
              <StyledButton
                variant="stripped"
                data-testid="closeAlert"
                onClick={this.onCloseButtonClick}>
                <StyledCross severity={severity} />
              </StyledButton>
            ))}
          <ChildWrapper>{children}</ChildWrapper>
        </StyledContent>
      </StyledLightbox>
    ) : null;
  }
}

export default Lightbox;
