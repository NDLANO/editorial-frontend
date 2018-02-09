import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import BEMHelper from 'react-bem-helper';
import Lightbox from './Lightbox';

const classes = new BEMHelper({
  name: 'warning-modal',
  prefix: 'c-',
});

const WarningModal = ({ text, onCancel, onSave, onContinue, t }) => (
  <Lightbox modal onClose={onCancel}>
    <div {...classes()}>
      <span>{text}</span>
      <div {...classes('buttons')}>
        <button type="button" onClick={onSave}>
          {t('form.save')}
        </button>
        <button type="button" onClick={onContinue}>
          {t('warningModal.continue')}
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

export default injectT(WarningModal);
