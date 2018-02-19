/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ImageForm, { getInitialModel } from './components/ImageForm';
import { actions } from '../../modules/image/image';

const CreateImage = ({ locale, updateImage, history, ...rest }) => (
  <ImageForm
    initialModel={getInitialModel({ language: locale })}
    onUpdate={(image, file) => updateImage({ image, file, history })}
    {...rest}
  />
);

CreateImage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  updateImage: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  updateImage: actions.updateImage,
};

export default connect(undefined, mapDispatchToProps)(CreateImage);
