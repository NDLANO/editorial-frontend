import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Warning } from 'ndla-icons/editor';
import BEMHelper from 'react-bem-helper';
import Lightbox from './Lightbox';

const classes = new BEMHelper({
  name: 'warning-modal',
  prefix: 'c-',
});

const WarningModal = ({
  text,
  onCancel,
  firstAction,
  secondAction,
  noButtons,
}) => (
  <Lightbox modal onClose={onCancel}>
    <div {...classes()}>
      <div>
        <Warning {...classes('icon')} />
        {text}
      </div>
      {!noButtons && (
        <div {...classes('buttons')}>
          {firstAction && (
            <Button
              outline
              onClick={firstAction.action}
              className="c-save-button">
              {firstAction.text}
            </Button>
          )}
          {secondAction && (
            <Button
              outline
              data-testid="warningModalConfirm"
              onClick={secondAction.action}
              className="c-save-button">
              {secondAction.text}
            </Button>
          )}
        </div>
      )}
    </div>
  </Lightbox>
);

WarningModal.propTypes = {
  text: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  firstAction: PropTypes.shape({
    text: PropTypes.string,
    action: PropTypes.func,
  }),
  secondAction: PropTypes.shape({
    text: PropTypes.string,
    action: PropTypes.func,
  }),
  noButtons: PropTypes.bool,
};

export default WarningModal;
