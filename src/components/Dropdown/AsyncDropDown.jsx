/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import DropDown from './DropDown';

export const dropDownClasses = new BEMHelper({
  name: 'dropdown',
  prefix: 'c-',
});

class AsyncDropDown extends React.Component {
  constructor(){
    super();
    this.state = { items: [] };
    this.onInputChange = this.onInputChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async onInputChange(evt) {
    const { apiAction } = this.props;
    const value = evt.target.value;
    const items = await apiAction(value);
    this.setState({items})
  }

  handleChange(selectedItem) {
    this.props.onChange({ target: { name, value: selectedItem } });
  }

  render(){
    const {...rest} = this.props;
    return (
      <DropDown {...rest} items={this.state.items} onChange={this.handleChange} onInputChange={this.onInputChange}/>
    );
  }
}

AsyncDropDown.propTypes = {
  onChange: PropTypes.func.isRequired,
  apiAction: PropTypes.func.isRequired,
};

export default AsyncDropDown;
