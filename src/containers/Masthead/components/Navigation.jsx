/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import BEMHelper from 'react-bem-helper';
import { Plus, Minus } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import { withRouter, Link } from 'react-router-dom';
import {
  Learningpath,
  DetailSearch,
  Agreement,
  Media,
  SubjectMatter,
  Taxonomy,
} from '@ndla/icons/editor';
import { colors } from '@ndla/core';
import FocusTrapReact from 'focus-trap-react';
import config from '../../../config';
import {
  toCreateLearningResource,
  toCreateImage,
  toSearch,
} from '../../../util/routeHelpers';
import MastheadButton from './MastheadButton';

export const classes = new BEMHelper({
  name: 'navigation',
  prefix: 'c-',
});

export class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggleOpen = this.toggleOpen.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
  }

  toggleOpen() {
    this.setState(
      prevState => ({ open: !prevState.open }),
    );
  }

  renderMenu(open) {
    const { t } = this.props;
    return (
      <div>
        <MastheadButton
          color={colors.brand.primary}
          minWidth={4}
          onClick={this.toggleOpen}
          stripped>
          <Plus
            {...classes('icon', open ? 'hidden' : 'show', 'c-icon--medium')}
          />
          <Minus
            {...classes('icon', !open ? 'hidden' : 'show', 'c-icon--medium')}
          />
        </MastheadButton>

        <div
          {...classes(
            'container',
            !open ? 'hidden' : ['absolute', 'brand-color-secondary'],
          )}>
          <div {...classes('items')}>
            <Link
              to={toCreateLearningResource()}
              {...classes('item')}
              onClick={this.toggleOpen}>
              <SubjectMatter className="c-icon--large" />
              <span>{t('subNavigation.subjectMatter')}</span>
            </Link>
            <a
              tabIndex="0"
              href={config.learningpathFrontendDomain}
              target="_blank"
              rel="noopener noreferrer"
              {...classes('item')}
              onClick={this.toggleOpen}>
              <Learningpath className="c-icon--large" />
              <span>{t('subNavigation.learningPath')}</span>
            </a>
            <Link
              to={toCreateImage()}
              {...classes('item')}
              onClick={this.toggleOpen}>
              <Media className="c-icon--large" />
              <span>{t('subNavigation.media')}</span>
            </Link>
            <Link
              to="/agreement/new"
              {...classes('item')}
              onClick={this.toggleOpen}>
              <Agreement className="c-icon--large" />
              <span>{t('subNavigation.agreement')}</span>
            </Link>
            {
              <Link
                to="/structure"
                {...classes('item')}
                onClick={this.toggleOpen}>
                <Taxonomy className="c-icon--large" />
                <span>{t('subNavigation.structure')}</span>
              </Link>
            }
            <Link
              to={toSearch(
                {
                  page: '1',
                  sort: '-relevance',
                  'page-size': 10,
                },
                'content',
              )}
              {...classes('item')}
              onClick={this.toggleOpen}>
              <DetailSearch className="c-icon--large" />
              <span>{t('subNavigation.detailSearch')}</span>
            </Link>
          </div>
        </div>

        {open ? (
          <div
            role="presentation"
            onKeyPress={this.toggleOpen}
            onClick={this.toggleOpen}
            {...classes('overlay')}
          />
        ) : (
          ''
        )}
      </div>
    );
  }

  render() {
    const { open } = this.state;
    return (
      <FocusTrapReact
        active={open}
        focusTrapOptions={{
          onDeactivate: () => {
            this.setState({open: false})
          },
          clickOutsideDeactivates: true,
        }}>
        {this.renderMenu(open)}
      </FocusTrapReact>
    );
  }
}

export default withRouter(injectT(Navigation));
