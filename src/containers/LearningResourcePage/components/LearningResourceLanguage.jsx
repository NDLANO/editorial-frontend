/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import BEMHelper from 'react-bem-helper';
import { injectT } from 'ndla-i18n';

const classes = new BEMHelper({
  name: 'dropdown-menu',
  prefix: 'c-',
});

class LearningResourceLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
    };
    this.onLanguageVariantClick = this.onLanguageVariantClick.bind(this);
    this.onDisplayToggle = this.onDisplayToggle.bind(this);
  }

  onLanguageVariantClick(languageKey) {
    this.onDisplayToggle();
    this.props.onVariantClick(languageKey);
  }

  onDisplayToggle() {
    this.setState(prevState => ({
      display: !prevState.display,
    }));
  }

  render() {
    const { languages, t } = this.props;
    return (
      <div {...classes()}>
        <Button stripped onClick={this.onDisplayToggle}>
          {t('learningResourceForm.variant.create')}
        </Button>
        <ul {...classes('items', this.state.display ? 'show' : '')}>
          {languages.map(language =>
            <li key={language.key} {...classes('item')}>
              <Button
                stripped
                {...classes('link')}
                onClick={() => this.onLanguageVariantClick(language.key)}>
                {`${language.title}(${language.key})`}
              </Button>
            </li>,
          )}
        </ul>
      </div>
    );
  }
}
LearningResourceLanguage.propTypes = {
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onVariantClick: PropTypes.func.isRequired,
};

export default injectT(LearningResourceLanguage);
