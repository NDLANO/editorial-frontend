/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { Done } from '@ndla/icons/editor';
import { Plus } from '@ndla/icons/action';
import BEMHelper from 'react-bem-helper';
import handleError from '../util/handleError';
import Spinner from './Spinner';

const classes = new BEMHelper({
  name: 'addButton',
  prefix: 'c-',
});

export class InlineAddButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: 'initial',
      inputValue: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  async handleClick(e) {
    e.stopPropagation();
    this.setState({ status: 'loading' });
    try {
      await this.props.action(this.state.inputValue);
      this.setState({ status: 'success' });
    } catch (error) {
      handleError(error);
      this.setState({
        status: 'error',
      });
    }
  }

  handleInputChange(e) {
    e.stopPropagation();
    this.setState({ inputValue: e.target.value });
  }

  handleKeyPress(e) {
    if (e.key === 'Escape') {
      this.setState({ status: 'initial' });
    }
    if (e.key === 'Enter') {
      this.handleClick(e);
    }
  }

  render() {
    const { title } = this.props;
    const { status, inputValue } = this.state;

    return status === 'edit' || status === 'loading' || status === 'error' ? (
      <React.Fragment>
        <div {...classes('editMode')}>
          <input
            type="text"
            autoFocus //  eslint-disable-line
            /* allow autofocus when it happens when clicking a dialog and not at page load
           ref: https://w3c.github.io/html/sec-forms.html#autofocusing-a-form-control-the-autofocus-attribute */
            data-testid="addSubjectInputField"
            value={inputValue}
            onChange={this.handleInputChange}
            onKeyDown={this.handleKeyPress}
          />
          <Button
            stripped
            disabled={status === 'loading'}
            onClick={this.handleClick}>
            {status === 'loading' ? <Spinner cssModifier="small" /> : <Done />}
          </Button>
        </div>
        {status === 'error' && (
          <span {...classes('errorMessage')}>
            {this.props.t('taxonomy.errorMessage')}
          </span>
        )}
      </React.Fragment>
    ) : (
      <Button
        stripped
        data-testid="AddSubjectButton"
        onClick={() => {
          this.setState({ status: 'edit' });
        }}
        {...classes('')}>
        <Plus />
        {title}
      </Button>
    );
  }
}

InlineAddButton.propTypes = {
  title: PropTypes.string.isRequired,
  action: PropTypes.func,
};

export default injectT(InlineAddButton);
