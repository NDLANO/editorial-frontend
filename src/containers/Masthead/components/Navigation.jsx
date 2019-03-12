/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Cross } from '@ndla/icons/action';
import { Menu } from '@ndla/icons/common';
import { injectT } from '@ndla/i18n';
import { withRouter, Link } from 'react-router-dom';
import { colors, spacing, fonts, animations } from '@ndla/core';
import { Logo } from '@ndla/ui';
import FocusTrapReact from 'focus-trap-react';
import styled, { css } from 'react-emotion';
import config from '../../../config';
import {
  toCreateLearningResource,
  toCreateTopicArticle,
  toCreateImage,
  toCreateAudioFile,
} from '../../../util/routeHelpers';
import MastheadButton from './MastheadButton';
import MastheadSearch from '../MastheadSearch';
import SessionContainer from './SessionContainer';

export const classes = new BEMHelper({
  name: 'navigation',
  prefix: 'c-',
});

const StyledNavigationWrapper = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  padding: ${spacing.xsmall};
  background: #fff;
`;

const StyledHeaderItems = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 972px;
  margin: 0 auto;
`;

const StyledMenuContainer = styled.div`
  background: ${colors.brand.greyLightest};
  position: absolute;
  right: 0;
  left: 0;
  ${animations.fadeIn(animations.durations.superFast)};
  > div {
    max-width: 660px;
    margin: ${spacing.large} auto;
  }
  nav {
    display: flex;
    justify-content: space-between;
    > div {
      display: flex;
      flex-direction: column;
      width: calc(50% - ${spacing.normal});
    }
  }
`;

const menuItemCss = css`
  display: flex;
  width: 100%;
  padding: ${spacing.small};
  background: transparent;
  box-shadow: none;
  border: 0;
  color: ${colors.brand.primary};
  font-family: ${fonts.sans};
  font-weight: ${fonts.weight.semibold};
  ${fonts.sizes(18, 1.1)};
  &:focus, &:hover {
    background: ${colors.brand.lighter} !important;
  }
`;

const StyledBackground = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background: rgba(1, 1, 1, 0.3);
  ${animations.fadeIn()};
`;

export class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  toggleOpen() {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  render() {
    const { open } = this.state;
    const { t, userName, authenticated } = this.props;
    return (
      <>
        <FocusTrapReact
          active={open}
          focusTrapOptions={{
            onDeactivate: () => {
              this.setState({ open: false });
            },
            clickOutsideDeactivates: true,
            escapeDeactivates: true,
          }}
        >
          <StyledNavigationWrapper>
            <StyledHeaderItems>
              <MastheadButton
                onClick={this.toggleOpen}>
                {open ? (
                  <>
                    <Cross {...classes('icon')} /><span>Lukk</span>
                  </>
                ) : (
                  <>
                    <Menu {...classes('icon')} /><span>Meny</span>
                  </>
                )}
              </MastheadButton>
              <MastheadSearch t={t} />
              <SessionContainer userName={userName} authenticated={authenticated} />
              <Logo to="/" label="Nasjonal digital læringsarena" />
            </StyledHeaderItems>
            {open && (
              <StyledMenuContainer>
                <div>
                  <nav>
                    <div>
                      <Link
                        className={menuItemCss}
                        to={toCreateLearningResource()}
                        onClick={this.toggleOpen}>
                        <span>{t('subNavigation.subjectMatter')}</span>
                      </Link>
                      <Link
                        className={menuItemCss}
                        to={toCreateTopicArticle()}
                        onClick={this.toggleOpen}>
                        <span>{t('subNavigation.topicArticle')}</span>
                      </Link>
                      <Link
                        className={menuItemCss}
                        to={toCreateImage()}
                        onClick={this.toggleOpen}>
                        <span>{t('subNavigation.image')}</span>
                      </Link>
                      <Link
                        className={menuItemCss}
                        to={toCreateAudioFile()}
                        onClick={this.toggleOpen}>
                        <span>{t('subNavigation.audio')}</span>
                      </Link>
                      <Link
                        className={menuItemCss}
                        to="/agreement/new"
                        onClick={this.toggleOpen}>
                        <span>{t('subNavigation.agreement')}</span>
                      </Link>
                    </div>
                    <div>
                      <a
                        className={menuItemCss}
                        href={config.learningpathFrontendDomain}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={this.toggleOpen}>
                        <span>{t('subNavigation.learningPathLink')}</span>
                      </a>
                      <a
                        className={menuItemCss}
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={this.toggleOpen}>
                        <span>{t('subNavigation.concept')}</span>
                      </a>
                      <Link
                        className={menuItemCss}
                        to="/structure"
                        onClick={this.toggleOpen}>
                        <span>{t('subNavigation.structure')}</span>
                      </Link>
                    </div>
                  </nav>
                </div>
              </StyledMenuContainer>
            )}
          </StyledNavigationWrapper>
        </FocusTrapReact>
        {open && <StyledBackground />}
      </>
    );
  }
}

Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  userName: PropTypes.string,
};

export default withRouter(injectT(Navigation));
