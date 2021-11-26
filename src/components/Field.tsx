/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';

export const classes = new BEMHelper({
  name: 'field',
  prefix: 'c-',
});

const Field = ({ children, className, noBorder = false, title = false, right = false }: Props) => (
  <div {...classes('', { 'no-border': noBorder, right, title }, className)}>{children}</div>
);

interface Props {
  className?: string;
  children: ReactNode;
  noBorder?: boolean;
  right?: boolean;
  title?: boolean;
}

Field.propTypes = {
  noBorder: PropTypes.bool,
  right: PropTypes.bool,
  title: PropTypes.bool,
};

export default Field;
