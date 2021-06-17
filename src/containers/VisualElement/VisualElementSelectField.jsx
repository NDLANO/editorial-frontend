/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import VisualElementSearch from './VisualElementSearch';
import VisualElementModalWrapper from './VisualElementModalWrapper';

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
        name,
        value: visualElement,
      },
    });
    resetSelectedResource();
  }

  render() {
    const { selectedResource, videoTypes, articleLanguage } = this.props;
    if (!selectedResource) {
      return null;
    }
    return (
      <VisualElementModalWrapper
        resource={selectedResource}
        isOpen
        onClose={this.onImageLightboxClose}>
        {setH5pFetchFail => (
          <VisualElementSearch
            selectedResource={selectedResource}
            handleVisualElementChange={this.handleVisualElementChange}
            closeModal={this.onImageLightboxClose}
            videoTypes={videoTypes}
            articleLanguage={articleLanguage}
            setH5pFetchFail={setH5pFetchFail}
          />
        )}
      </VisualElementModalWrapper>
    );
  }
}

VisualElementSelectField.propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  selectedResource: PropTypes.string,
  resetSelectedResource: PropTypes.func.isRequired,
  videoTypes: PropTypes.array,
  articleLanguage: PropTypes.string.isRequired,
};

export default VisualElementSelectField;
