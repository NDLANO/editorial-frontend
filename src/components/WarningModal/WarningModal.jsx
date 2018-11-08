/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Warning } from '@ndla/icons/editor';
import BEMHelper from 'react-bem-helper';
import Lightbox from '../Lightbox';
import WarningModalFooter from './WarningModalFooter';

export const classes = new BEMHelper({
  name: 'warning-modal',
  prefix: 'c-',
});

const WarningModal = ({ text, onCancel, actions, component, show }) =>
  show ? (
    <Lightbox modal onClose={onCancel}>
      <div {...classes()}>
        <div {...classes('body')}>
          <Warning {...classes('body-icon')} />
          <span {...classes('body-text')}>{text}</span>
        </div>
        <WarningModalFooter actions={actions} component={component} />
      </div>
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
};

export default WarningModal;
