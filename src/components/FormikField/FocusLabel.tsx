/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import { connect, FormikContextType } from 'formik';
import { isEmpty } from '../validators';
import { FormikShape } from '../../shapes';
import { classes } from './';

interface Props {
  name: string;
  hasFocus: boolean;
  formik: FormikContextType<any>;
  children: ReactNode;
}

const FocusLabel = ({ name, hasFocus, children, formik: { values } }: Props) => {
  if (!hasFocus || isEmpty(values[name])) {
    return null;
  }
  return (
    <div {...classes('focus-label')}>
      <span {...classes('focus-text')}>{children}</span>
    </div>
  );
};

FocusLabel.propTypes = {
  name: PropTypes.string.isRequired,
  hasFocus: PropTypes.bool.isRequired,
  formik: FormikShape,
};

export default connect(FocusLabel);
