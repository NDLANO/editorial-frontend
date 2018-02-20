import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

const Overlay = ({ onExit, cssModifiers }) => {
  const overlayClasses = new BEMHelper({
    name: 'overlay',
    prefix: 'c-',
  });

  return (
    <div
      onClick={onExit}
      role="button"
      tabIndex={0}
      {...overlayClasses('', cssModifiers)}
    />
  );
};

Overlay.propTypes = {
  onExit: PropTypes.func.isRequired,
  cssModifiers: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
};

Overlay.defaultProps = {
  cssModifiers: '',
};

export default Overlay;
