import React, { PureComponent } from 'react';
import { Button } from 'ndla-ui';
import { Done } from 'ndla-icons/editor';
import PropTypes from 'prop-types';

class InlineEditField extends PureComponent {
  constructor() {
    super();
    this.state = {
      editMode: false,
    };
  }
  render() {
    const { title, icon, submit, currentval, classes } = this.props;
    const { editMode, input } = this.state;
    const value = input === undefined ? currentval : input;
    return (
      <Button
        {...classes('menuItem')}
        stripped
        onClick={() => this.setState({ editMode: true })}>
        <div {...classes('button', editMode && 'open')}>{icon}</div>
        {editMode ? (
          <React.Fragment>
            <input
              type="text"
              value={value}
              onChange={e => this.setState({ input: e.target.value })}
            />
            <Button onClick={() => submit(this.state.input)}>
              <Done />
            </Button>
          </React.Fragment>
        ) : (
          title
        )}
      </Button>
    );
  }
}

InlineEditField.propTypes = {};

export default InlineEditField;
