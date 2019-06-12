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
import { visualElementClasses } from '../TopicArticlePage/components/TopicArticleVisualElement';

class VisualElement extends Component {
  constructor(props) {
    super(props);
    this.removeVisualElement = this.removeVisualElement.bind(this);
  }

  removeVisualElement() {
    const { onChange, name, resetSelectedResource } = this.props;
    onChange({ target: { name, value: {} } });
    resetSelectedResource();
  }

  render() {
    const { value: visualElement, changeVisualElement, ...rest } = this.props;
    if (!visualElement.resource) {
      return null;
    }
    return (
      <DisplayVisualElement
        embed={visualElement}
        changeVisualElement={changeVisualElement}
        onRemoveClick={this.removeVisualElement}
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
};

export default VisualElement;
