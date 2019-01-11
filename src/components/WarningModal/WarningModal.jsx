/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Lightbox from '../Lightbox';
import AlertModal from '../AlertModal';

const WarningModal = ({ text, onCancel, actions, component, show, severity }) =>
  show ? (
    <Lightbox onClose={onCancel}>
      <AlertModal
        text={text}
        onCancel={onCancel}
        actions={actions}
        component={component}
        show={show}
        severity={severity}
      />
    </Lightbox>
  ) : null;

WarningModal.propTypes = {
  text: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  component: PropTypes.node,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
  show: PropTypes.bool,
  severity: PropTypes.string,
};

export default WarningModal;
