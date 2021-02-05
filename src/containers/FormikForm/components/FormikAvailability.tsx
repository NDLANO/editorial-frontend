/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
// @ts-ignore
import { RadioButtonGroup } from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';
import { FieldInputProps } from 'formik';

interface Props {
  availability: string;
  field: FieldInputProps<string[]>;
}

const FormikAvailability = ({ availability, field, t }: Props & tType) => {
  const availabilityValues = ['everyone', 'teacher', 'student'];

  return (
    <RadioButtonGroup
      label={t('labelChild')}
      selected={availability}
      uniqeIds
      options={availabilityValues.map(value => ({ title: t(value), value: value }))}
      onChange={(value: string) =>
        field.onChange({
          target: {
            name: field.name,
            value: value,
          },
        })
      }
    />
  );
};

export default injectT(FormikAvailability, 'form.availability.');
