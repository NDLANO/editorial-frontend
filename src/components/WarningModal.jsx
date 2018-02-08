import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import Lightbox from './Lightbox';

const classes = new BEMHelper({
  name: 'warning-modal',
  prefix: 'c-',
});

const WarningModal = ({ text, onCancel, onSave, onContinue }) => (
  <Lightbox modal onClose={onCancel}>
    <div {...classes()}>
      <span>{text}</span>
      <div {...classes('buttons')}>
        <button type="button" onClick={onSave}>
          Lagre
        </button>
        <button type="button" onClick={onContinue}>
          Fortsett
        </button>
      </div>
    </div>
  </Lightbox>
);

WarningModal.propTypes = {
  text: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default WarningModal;
