/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectT } from '@ndla/i18n';

import { clearMessage } from './messagesActions';
import { MessageShape } from '../../shapes';
import WarningModal from '../../components/WarningModal';

export const Action = ({ title, onClick }) => (
  <button type="button" onClick={onClick} className="un-button alert_action">
    <span className="alert_action-text">{title}</span>
  </button>
);

Action.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const Alert = injectT(({ message, dispatch, t }) => {
  const severity = message.severity ? message.severity : 'info';

  return (
    <WarningModal
      show
      text={
        message.translationKey ? t(message.translationKey) : message.message
      }
      onCancel={() => dispatch(clearMessage(message.id))}
      className={`alert alert--${severity}`}
    />
  );
});

Alert.propTypes = {
  message: MessageShape.isRequired,
  dispatch: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export const Alerts = ({ dispatch, messages }) => {
  const isHidden = messages.length === 0;
  const overlayClasses = classNames({
    'alert-overlay': true,
    'alert-overlay--hidden': isHidden,
  });

  const timeoutMessage = item => {
    setTimeout(() => dispatch(clearMessage(item.id)), item.timeToLive);
  };

  messages.filter(m => m.timeToLive > 0).forEach(item => timeoutMessage(item));

  return (
    <div className={overlayClasses}>
      {messages.map(message => (
        <Alert key={message.id} dispatch={dispatch} message={message} />
      ))}
    </div>
  );
};

Alerts.propTypes = {
  messages: PropTypes.arrayOf(MessageShape).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default Alerts;
