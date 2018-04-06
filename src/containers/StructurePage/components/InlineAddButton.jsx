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

import Spinner from '../../../components/Spinner';

const classes = new BEMHelper({
  name: 'addButton',
  prefix: 'c-',
});

class InlineAddButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      loading: false,
      inputValue: '',
      errorMessage: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  async handleClick(e) {
    e.stopPropagation();
    this.setState({ loading: true, errorMessage: '' });
    try {
      await this.props.action(this.state.inputValue);
      this.setState({ editMode: false, loading: false });
    } catch (error) {
      this.setState({
        errorMessage: 'Beklager, noe gikk galt',
        loading: false,
      });
    }
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
      this.handleClick(e);
    }
  }

  render() {
    const { title } = this.props;

    return this.state.editMode ? (
      <React.Fragment>
        <div {...classes('editMode')}>
          <input
            type="text"
            autoFocus //  eslint-disable-line
            /* allow autofocus when it happens when clicking a dialog and not at page load
           ref: https://w3c.github.io/html/sec-forms.html#autofocusing-a-form-control-the-autofocus-attribute */
            data-testid="addSubjectInputField"
            value={this.state.inputValue}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyPress}
          />
          <Button stripped onClick={this.handleClick}>
            {this.state.loading ? <Spinner cssModifier="small" /> : <Done />}
          </Button>
        </div>
        {this.state.errorMessage && (
          <span {...classes('errorMessage')}>{this.state.errorMessage}</span>
        )}
      </React.Fragment>
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
