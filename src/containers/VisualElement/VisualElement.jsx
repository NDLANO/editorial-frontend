/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisualElementEditor from '../../components/SlateEditor/VisualElementEditor';
import visualElementPlugin from '../../components/SlateEditor/plugins/visualElement';
import visualElementPickerPlugin from '../../components/SlateEditor/plugins/visualElementPicker';
import { renderBlock } from '../../components/SlateEditor/slateRendering';

class VisualElement extends Component {
  constructor(props) {
    super(props);

    this.removeVisualElement = this.removeVisualElement.bind(this);
  }

  componentDidUpdate() {
    const { onChange, name, resetSelectedResource, value } = this.props;
    const empty = !value.resource;

    this.plugins = [
      empty ?
        visualElementPickerPlugin()
        :
        visualElementPlugin({
          onChange,
          name,
          resetSelectedResource
        }),
    ];
  }

  removeVisualElement() {
    const { onChange, name, resetSelectedResource } = this.props;
    onChange({ target: { name, value: {} } });
    resetSelectedResource();
  }

  render() {
    const { changeVisualElement, visualElementValue } = this.props;
    return (
      <VisualElementEditor
        value={visualElementValue}
        plugins={this.plugins}
        renderBlock={renderBlock}
        onChange={changeVisualElement}
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
