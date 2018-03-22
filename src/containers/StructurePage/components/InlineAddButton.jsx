/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Done } from 'ndla-icons/editor';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'addButton',
  prefix: 'c-',
});

class InlineAddButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      inputValue: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleClick(e) {
    e.stopPropagation();
    this.props.action(this.state.inputValue);
    this.setState({ editMode: false });
  }

  handleInputChange(e) {
    e.stopPropagation();
    this.setState({ inputValue: e.target.value });
  }

  handleKeyPress(e) {
    if (e.key === 'Escape') {
      this.setState({ editMode: false });
    }
    if (e.key === 'Enter') {
      this.props.action(this.state.inputValue);
      this.setState({ editMode: false });
    }
  }

  render() {
    const { title } = this.props;

    return this.state.editMode ? (
      <div {...classes('editMode')}>
        <input
          type="text"
          data-testid="addSubjectInputField"
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyPress}
        />
        <Button stripped onClick={this.handleClick}>
          <Done />
        </Button>
      </div>
    ) : (
      <Button
        stripped
        data-testid="AddSubjectButton"
        onClick={() => {
          this.setState({ editMode: true });
        }}
        {...classes('')}>
        {title}
      </Button>
    );
  }
}

InlineAddButton.propTypes = {
  title: PropTypes.string.isRequired,
  action: PropTypes.func,
};

export default InlineAddButton;
