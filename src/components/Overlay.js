import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

const Overlay = ({ onExit, cssModifier }) => {
  const overlayClasses = new BEMHelper({
    name: 'overlay',
    prefix: 'c-',
  });

  return (
    <div
      onClick={onExit}
      role="button"
      tabIndex={0}
      {...overlayClasses('', cssModifier)}
    />
  );
};

Overlay.propTypes = {
  onExit: PropTypes.func.isRequired,
  cssModifier: PropTypes.string,
};

Overlay.defaultProps = {
  cssModifier: '',
};

export default Overlay;
