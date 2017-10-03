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
import { Link } from 'react-router-dom';
import { toEditArticle } from '../../util/routeHelpers';

const classes = new BEMHelper({
  name: 'dropdown-menu',
  prefix: 'c-',
});

class ArticleLanguage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
    };
    this.onDisplayToggle = this.onDisplayToggle.bind(this);
  }

  onDisplayToggle() {
    this.setState(prevState => ({
      display: !prevState.display,
    }));
  }

  render() {
    const { languages, modelId, articleType, t } = this.props;
    return (
      <div {...classes()}>
        <Button stripped onClick={this.onDisplayToggle}>
          {t('form.variant.create')}
        </Button>
        <ul {...classes('items', this.state.display ? 'show' : '')}>
          {languages.map(language => (
            <li key={language.key} {...classes('item')}>
              <Link
                to={toEditArticle(modelId, articleType, language.key)}
                {...classes('link')}
                onClick={this.onDisplayToggle}>
                {`${language.title}(${language.key})`}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
ArticleLanguage.propTypes = {
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  modelId: PropTypes.number.isRequired,
  articleType: PropTypes.string.isRequired,
};

export default injectT(ArticleLanguage);
