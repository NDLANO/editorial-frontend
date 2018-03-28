import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Done } from 'ndla-icons/editor';

class InlineEditField extends PureComponent {
  constructor() {
    super();
    this.state = {
      editMode: false,
    };
  }
  render() {
    const { title, icon, onSubmit, currentVal, classes } = this.props;
    const { editMode, input } = this.state;
    const value = input === undefined ? currentVal : input;
    return editMode ? (
      <div {...classes('menuItem')}>
        <div {...classes('iconButton', 'open item')}>{icon}</div>
        <input
          type="text"
          value={value}
          onChange={e => this.setState({ input: e.target.value })}
        />
        <Button
          {...classes('saveButton')}
          onClick={() => onSubmit(this.state.input)}>
          <Done className={'c-icon--small'} />
        </Button>
      </div>
    ) : (
      <Button
        {...classes('menuItem')}
        stripped
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
