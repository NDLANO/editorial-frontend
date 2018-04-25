/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Button } from 'ndla-ui';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Cross } from 'ndla-icons/action';
import { injectT } from 'ndla-i18n';
import Overlay from '../../../components/Overlay';
import Spinner from '../../../components/Spinner';

const classes = new BEMHelper({
  name: 'taxonomyLightbox',
  prefix: 'c-',
});

class TaxonomyLightbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { display: props.display };
    this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
  }

  componentWillReceiveProps(props) {
    const { display } = props;
    this.setState({ display });
  }

  onCloseButtonClick(evt) {
    this.setState({ display: false }, () => this.props.onClose());
    evt.preventDefault();
  }

  render() {
    const { children, title, onSelect, t, loading } = this.props;

    return this.state.display ? (
      <div {...classes()}>
        <Overlay onExit={this.onCloseButtonClick} />
        <div {...classes('wrapper')}>
          <div {...classes('header')}>
            {title}
            <Button
              {...classes('close')}
              stripped
              onClick={this.onCloseButtonClick}>
              <Cross />
            </Button>
          </div>
          <div {...classes('content')}>
            {children}
            {onSelect && (
              <Button
                data-testid="taxonomyLightboxButton"
                stripped
                {...classes('selectButton')}
                onClick={onSelect}>
                {loading ? <Spinner cssModifier="small" /> : t('form.choose')}
              </Button>
            )}
          </div>
        </div>
      </div>
    ) : null;
  }
}

TaxonomyLightbox.propTypes = {
  onClose: PropTypes.func.isRequired,
  display: PropTypes.bool,
  loading: PropTypes.bool,
  title: PropTypes.string,
  onSelect: PropTypes.func,
};

TaxonomyLightbox.defaultProps = {
  display: true,
};

export default injectT(TaxonomyLightbox);
