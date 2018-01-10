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
import { withRouter } from 'react-router-dom';
import { Home } from 'ndla-icons/common';

const classes = new BEMHelper({
  name: 'sub',
  prefix: 'masthead-',
});
const iconClass = new BEMHelper({
  name: 'icon',
  prefix: 'c-',
});
export class SubMasthead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      currentType: '',
      currentSubType: '',
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
        <Button onClick={this.toggleOpen} stripped {...classes('button')}>
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
        <div {...classes('container', !this.state.open ? 'hidden' : '')}>
          <div {...classes('items')}>
            <div {...classes('item')}>
              <Home className="c-icon--large" />
              Fagstoff
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SubMasthead.propTypes = {
  userName: PropTypes.string,
  authenticated: PropTypes.bool.isRequired,
};

SubMasthead.defaultProps = {
  authenticated: false,
  userName: '',
};

export default withRouter(injectT(SubMasthead));
