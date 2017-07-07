/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { classes } from './Fields';

class VisualElementTypeSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.toggleIsOpen = this.toggleIsOpen.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
  }

  onTypeChange(type) {
    const { onChange, name, toggleShowVisualElement } = this.props;
    onChange({
      target: {
        name,
        value: type
      }
    });
    this.setState({isOpen: false})
    toggleShowVisualElement();
  }

  toggleIsOpen() {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  }



  render() {
    const { value } = this.props;
    if (value) {
      return null;
    }
    const typeClassName = this.state.isOpen ? '' : 'hidden'
    return (
      <div>
        <Button stripped {...classes('visual-element-type-button')} onClick={this.toggleIsOpen}>
          {this.state.isOpen ? 'x' : '+'}
        </Button>
        <div {...classes('visual-element-type', typeClassName)}>
          <Button stripped {...classes('visual-element-type-button')} onClick={() => this.onTypeChange('image')}>
            B
          </Button>
          <Button stripped {...classes('visual-element-type-button')} onClick={() => this.onTypeChange('video')}>
            V
          </Button>
        </div>
      </div>
    );
  }
}

VisualElementTypeSelect.propTypes = {
  toggleShowVisualElement: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default VisualElementTypeSelect;
