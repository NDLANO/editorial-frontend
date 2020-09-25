/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { FormikValues } from 'formik';
import { FieldHeader } from '@ndla/forms';
import { StyledFilterCheckBox } from '../../../style/LearningResourceTaxonomyStyles';

interface Props {
  value: FormikValues['string'];
  setFieldValue: Function;
  title: string;
  label: string;
}

const SubjectpageLayoutPicker = ({
  value,
  setFieldValue,
  title,
  label,
}: Props) => (
  <>
    <FieldHeader title={title} />
    <StyledFilterCheckBox
      type="button"
      onClick={() => {
        setFieldValue(
          'layout',
          value === 'stacked' ? 'single' : 'stacked',
          false,
        );
      }}
      className={value === 'stacked' ? 'checkboxItem--checked' : ''}>
      <span />
      <span>{label}</span>
    </StyledFilterCheckBox>
  </>
);

export default SubjectpageLayoutPicker;
