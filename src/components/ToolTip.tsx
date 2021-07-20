/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
  name: 'tooltip',
  prefix: 'c-',
});

interface Props {
  direction?: string;
  name: string;
  messages: {
    ariaLabel: string;
  };
  children: React.ReactChild | React.ReactChild[];
  noPopup: boolean;
  onPopupClick?: Function;
  content: string | React.ReactNode;
}

const ToolTip = ({
  direction = 'bottom',
  name,
  messages,
  content,
  children,
  onPopupClick,
  noPopup = false,
}: Props) => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handlePopupClick = () => {
    if (onPopupClick) {
      onPopupClick();
    }
    togglePopup();
  };

  const popupModifier = {
    visible: showPopup,
    [direction]: !!direction, // TODO Figure out if this works.
  };

  return (
    <span {...classes('item')}>
      <div
        role="button"
        tabIndex={0}
        aria-label={messages.ariaLabel}
        onKeyPress={noPopup ? undefined : togglePopup}
        onClick={noPopup ? undefined : togglePopup}
        {...classes('button')}>
        {children}
      </div>
      <span
        onClick={onPopupClick ? handlePopupClick : togglePopup}
        aria-hidden="true"
        role="dialog"
        aria-labelledby={name}
        aria-describedby={name}
        {...classes('popup', popupModifier)}>
        <span {...classes('content')}>{content}</span>
      </span>
    </span>
  );
};

ToolTip.propTypes = {
  direction: PropTypes.string,
  name: PropTypes.string.isRequired,
  messages: PropTypes.shape({
    ariaLabel: PropTypes.string.isRequired,
  }),
  noPopup: PropTypes.bool,
  onPopupClick: PropTypes.func,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

ToolTip.defaultProps = {
  direction: 'bottom',
  noPopup: false,
  onPopupClick: undefined,
};

export default ToolTip;
