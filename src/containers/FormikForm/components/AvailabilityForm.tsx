/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { RadioButtonGroup } from '@ndla/ui';
import { injectT, tType } from '@ndla/i18n';
import { FieldInputProps } from 'formik';
import { AvailabilityType } from '../../../interfaces';

interface Props {
  availability: string;
  field: FieldInputProps<string[]>;
}

const AvailabilityForm = ({ availability, field, t }: Props & tType) => {
  const availabilityValues: AvailabilityType[] = ['everyone', 'teacher', 'student'];

  return (
    <RadioButtonGroup
      label={t('description')}
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

export default injectT(AvailabilityForm, 'form.availability.');
