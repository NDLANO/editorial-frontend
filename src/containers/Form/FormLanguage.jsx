/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import BEMHelper from 'react-bem-helper';
import { injectT } from '@ndla/i18n';
import { Link } from 'react-router-dom';
import Overlay from '../../components/Overlay';

const classes = new BEMHelper({
  name: 'dropdown-menu',
  prefix: 'c-',
});

class FormLanguage extends Component {
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
    const { emptyLanguages, editUrl, t } = this.props;
    const { display } = this.state;
    return (
      <div {...classes()}>
        <Button stripped onClick={this.onDisplayToggle}>
          {t('form.variant.create')}
        </Button>
        {display && <Overlay onExit={this.onDisplayToggle} />}
        <ul {...classes('items', display ? 'show' : '')}>
          {emptyLanguages.length > 0 ? (
            emptyLanguages.map(language => (
              <li key={language.key} {...classes('item')}>
                <Link
                  to={editUrl(language.key)}
                  {...classes('link')}
                  onClick={this.onDisplayToggle}>
                  {`${language.title}(${language.key})`}
                </Link>
              </li>
            ))
          ) : (
            <li {...classes('item')}>{t('language.empty')}</li>
          )}
        </ul>
      </div>
    );
  }
}
FormLanguage.propTypes = {
  emptyLanguages: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  editUrl: PropTypes.func.isRequired,
};

export default injectT(FormLanguage);
