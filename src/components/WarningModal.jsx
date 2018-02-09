import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Warning } from 'ndla-icons/editor';
import { injectT } from 'ndla-i18n';
import BEMHelper from 'react-bem-helper';
import Lightbox from './Lightbox';

const classes = new BEMHelper({
  name: 'warning-modal',
  prefix: 'c-',
});

const WarningModal = ({
  text,
  onCancel,
  onSave,
  onContinue,
  t,
  confirmDelete,
}) => (
  <Lightbox modal onClose={onCancel}>
    <div {...classes()}>
      <span>
        <Warning {...classes('icon')} />
        {text}
      </span>
      <div {...classes('buttons')}>
        <Button
          outline
          onClick={confirmDelete ? onCancel : onSave}
          className="c-save-button">
          {confirmDelete ? t('form.abort') : t('form.save')}
        </Button>
        <Button outline onClick={onContinue} className="c-save-button">
          {confirmDelete
            ? t('warningModal.delete')
            : t('warningModal.continue')}
        </Button>
      </div>
    </div>
  </Lightbox>
);

WarningModal.propTypes = {
  text: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func,
  onContinue: PropTypes.func.isRequired,
  confirmDelete: PropTypes.bool,
};

export default injectT(WarningModal);
