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
import { Plus, Minus } from 'ndla-icons/action';
import { Button } from 'ndla-ui';
import { injectT } from 'ndla-i18n';
import { withRouter, Link } from 'react-router-dom';
import {
  Learningpath,
  DetailSearch,
  Agreement,
  Media,
  SubjectMatter,
  Taxonomy,
} from 'ndla-icons/editor';
import config from '../../../config';
import {
  toCreateLearningResource,
  toCreateImage,
  toSearch,
} from '../../../util/routeHelpers';

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
  }

  toggleOpen() {
    this.setState(prevState => ({ open: !prevState.open }));
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <Button
          onClick={this.toggleOpen}
          stripped
          {...classes('open-button', '', 'c-masthead-editorial__open-button')}>
          <Plus
            {...classes(
              'icon',
              this.state.open ? 'hidden' : 'show',
              'c-icon--medium',
            )}
          />
          <Minus
            {...classes(
              'icon',
              !this.state.open ? 'hidden' : 'show',
              'c-icon--medium',
            )}
          />
        </Button>
        <div
          {...classes(
            'container',
            !this.state.open ? 'hidden' : ['absolute', 'brand-color-secondary'],
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
            <Link
              to="/structure"
              {...classes('item')}
              onClick={this.toggleOpen}>
              <Taxonomy className="c-icon--large" />
              <span>{t('subNavigation.structure')}</span>
            </Link>
            <Link
              to={toSearch(
                { types: 'articles', page: '1', sort: '-relevance' },
                'content',
              )}
              {...classes('item')}
              onClick={this.toggleOpen}>
              <DetailSearch className="c-icon--large" />
              <span>{t('subNavigation.detailSearch')}</span>
            </Link>
          </div>
        </div>
        {this.state.open ? (
          <div
            role="presentation"
            onClick={this.toggleOpen}
            {...classes('overlay')}
          />
        ) : (
          ''
        )}
      </div>
    );
  }
}

Navigation.propTypes = {
  userName: PropTypes.string,
  authenticated: PropTypes.bool.isRequired,
};

Navigation.defaultProps = {
  userName: '',
};

export default withRouter(injectT(Navigation));
