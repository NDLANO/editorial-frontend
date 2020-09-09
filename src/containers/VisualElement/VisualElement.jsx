/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DisplayVisualElement from './DisplayVisualElement';
import { visualElementClasses } from '../FormikForm/components/FormikVisualElement';
import VisualElementEditor from '../../components/SlateEditor/VisualElementEditor';
import visualElementPlugin from '../../components/SlateEditor/plugins/visualElement';
import visualElementPickerPlugin from '../../components/SlateEditor/plugins/visualElementPicker';
import { renderBlock } from '../../components/SlateEditor/slateRendering';

class VisualElement extends Component {
  constructor(props) {
    super(props);

    const {
      value: embed,
      changeVisualElement: onSelect,
      types,
      language
    } = this.props;

    this.plugins = [
      visualElementPickerPlugin({
        onSelect,
        types
      }),
      visualElementPlugin({
        embed,
        onSelect,
        language
      }),
      
    ];

    this.removeVisualElement = this.removeVisualElement.bind(this);
  }

  removeVisualElement() {
    const { onChange, name, resetSelectedResource } = this.props;
    onChange({ target: { name, value: {} } });
    resetSelectedResource();
  }

  render() {
    const { value: visualElement, changeVisualElement, types, content, language, ...rest } = this.props;
    if (!visualElement.resource) {
      return null;
    }
    return (
      <VisualElementEditor
        value={content}
        plugins={this.plugins}
        renderBlock={renderBlock}
      />
    );
    return (
      <DisplayVisualElement
        embed={visualElement}
        changeVisualElement={changeVisualElement}
        onRemoveClick={this.removeVisualElement}
        visualElementCaptionName={this.props.visualElementCaptionName}
        {...visualElementClasses(visualElement.resource)}
        {...rest}
      />
    );
  }
}

VisualElement.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.shape({
    resource: PropTypes.string,
    metaData: PropTypes.object,
  }).isRequired,
  resetSelectedResource: PropTypes.func.isRequired,
  changeVisualElement: PropTypes.func.isRequired,
  visualElementCaptionName: PropTypes.string,
};

export default VisualElement;
