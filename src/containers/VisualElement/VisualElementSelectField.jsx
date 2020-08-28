/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../../components/Lightbox';
import VisualElementSearch from './VisualElementSearch';

class VisualElementSelectField extends Component {
  constructor(props) {
    super(props);
    this.handleVisualElementChange = this.handleVisualElementChange.bind(this);
    this.onImageLightboxClose = this.onImageLightboxClose.bind(this);
  }

  onImageLightboxClose() {
    this.props.resetSelectedResource();
  }

  handleVisualElementChange(visualElement) {
    const { name, onChange, resetSelectedResource } = this.props;
    onChange({
      target: {
        name: 'visualElementCaption',
        value: visualElement.caption,
      },
    });
    onChange({
      target: {
        name: 'visualElementAlt',
        value: visualElement.alt,
      },
    });
    onChange({
      target: {
        name,
        value: visualElement,
      },
    });
    resetSelectedResource();
  }

  render() {
    const { selectedResource, videoTypes } = this.props;
    if (!selectedResource) {
      return null;
    }
    return (
      <Lightbox
        display
        appearance={selectedResource === 'h5p' ? 'fullscreen' : 'big'}
        onClose={this.onImageLightboxClose}>
        <VisualElementSearch
          selectedResource={selectedResource}
          handleVisualElementChange={this.handleVisualElementChange}
          closeModal={this.onImageLightboxClose}
          videoTypes={videoTypes}
        />
      </Lightbox>
    );
  }
}

VisualElementSelectField.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  selectedResource: PropTypes.string,
  value: PropTypes.shape({
    resource: PropTypes.string,
    metaData: PropTypes.object,
  }).isRequired,
  resetSelectedResource: PropTypes.func.isRequired,
  videoTypes: PropTypes.array,
};

export default VisualElementSelectField;
