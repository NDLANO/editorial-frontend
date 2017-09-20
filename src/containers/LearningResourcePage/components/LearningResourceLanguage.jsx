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

const classes = new BEMHelper({
  name: 'dropdown-menu',
  prefix: 'c-',
});

export default class LearningResourceLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
    };
    this.onLanguageVariantClick = this.onLanguageVariantClick.bind(this);
    this.onDisplayToggle = this.onDisplayToggle.bind(this);
  }

  onLanguageVariantClick(language) {
    this.onDisplayToggle();
    this.props.onVariantClick(language);
  }

  onDisplayToggle() {
    this.setState(prevState => ({
      display: !prevState.display,
    }));
  }

  render() {
    const { supportedLanguages } = this.props;
    return (
      <div {...classes()}>
        <Button stripped onClick={this.onDisplayToggle}>
          Lag variant +
        </Button>
        <ul {...classes('items', this.state.display ? 'show' : '')}>
          {supportedLanguages.map(language =>
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
  supportedLanguages: PropTypes.array.isRequired,
  onVariantClick: PropTypes.func.isRequired,
};
