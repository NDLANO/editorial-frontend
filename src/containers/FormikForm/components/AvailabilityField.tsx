/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { RadioButtonGroup } from '@ndla/ui';
import { FieldInputProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { AvailabilityType } from '../../../interfaces';

interface Props {
  availability: string;
  field: FieldInputProps<string[]>;
}

const AvailabilityField = ({ availability, field }: Props) => {
  const { t } = useTranslation();
  const availabilityValues: AvailabilityType[] = ['everyone', 'teacher', 'student'];

  return (
    <RadioButtonGroup
      label={t('form.availability.description')}
      selected={availability}
      uniqeIds
      options={availabilityValues.map(value => ({
        title: t(`form.availability.${value}`),
        value: value,
      }))}
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

export default AvailabilityField;
