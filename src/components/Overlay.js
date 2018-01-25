import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

const Overlay = ({ onExit }) => {
  const overlayClasses = new BEMHelper({
    name: 'overlay',
    prefix: 'c-',
  });

  return (
    <div onClick={onExit} role="button" tabIndex={0} {...overlayClasses('')}>
      <div
        ref={node => {
          this.inner = node;
        }}
      />
    </div>
  );
};

Overlay.propTypes = {
  onExit: PropTypes.func.isRequired,
};

export default Overlay;
