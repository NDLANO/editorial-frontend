/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AudioForm, { getInitialModel } from './components/AudioForm';
import { actions } from '../../modules/audio/audio';

const CreateAudio = ({ locale, updateAudio, history, ...rest }) => (
  <AudioForm
    initialModel={getInitialModel({ language: locale })}
    locale={locale}
    onUpdate={(audio, file) => updateAudio({ audio, file, history })}
    {...rest}
  />
);

CreateAudio.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  updateAudio: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  updateAudio: actions.updateAudio,
};

export default connect(undefined, mapDispatchToProps)(CreateAudio);
