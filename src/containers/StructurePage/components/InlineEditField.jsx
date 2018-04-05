/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Done } from 'ndla-icons/editor';

import Spinner from '../../../components/Spinner';

class InlineEditField extends PureComponent {
  constructor() {
    super();
    this.state = {
      editMode: false,
      errorMessage: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  async handleSubmit() {
    this.setState({ loading: true });
    try {
      await this.props.onSubmit(this.state.input);
      this.setState({ loading: false });
    } catch (e) {
      this.setState({ errorMessage: 'En feil oppsto', loading: false });
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Escape') {
      this.setState({ editMode: false });
    }
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  render() {
    const { title, icon, currentVal, classes } = this.props;
    const { editMode, input } = this.state;
    const value = input === undefined ? currentVal : input;
    return editMode ? (
      <React.Fragment>
        <div {...classes('menuItem')}>
          <div {...classes('iconButton', 'open item')}>{icon}</div>
          <input
            type="text"
            value={value}
            data-testid="inlineEditInput"
            onChange={e => this.setState({ input: e.target.value })}
            onKeyDown={this.handleKeyPress}
          />
          <Button
            {...classes('saveButton')}
            data-testid="inlineEditSaveButton"
            onClick={this.handleSubmit}>
            {this.state.loading ? (
              <Spinner cssModifier="small" />
            ) : (
              <Done className={'c-icon--small'} />
            )}
          </Button>
        </div>
        {this.state.errorMessage && (
          <div
            data-testid="inlineEditErrorMessage"
            {...classes('errorMessage')}>
            {this.state.errorMessage}
          </div>
        )}
      </React.Fragment>
    ) : (
      <Button
        {...classes('menuItem')}
        stripped
        data-testid="inlineEditFieldButton"
        onClick={() => this.setState({ editMode: true })}>
        <div {...classes('iconButton', 'item')}>{icon}</div>
        {title}
      </Button>
    );
  }
}

InlineEditField.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.node,
  onSubmit: PropTypes.func,
  currentVal: PropTypes.string,
  classes: PropTypes.func,
};

export default InlineEditField;
