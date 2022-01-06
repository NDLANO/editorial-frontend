/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RadioButtonGroup } from '@ndla/ui';
import { FieldInputProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { AvailabilityType } from '../../../interfaces';

interface Props {
  field: FieldInputProps<AvailabilityType>;
}

const AvailabilityField = ({ field }: Props) => {
  const { t } = useTranslation();
  const availabilityValues: AvailabilityType[] = ['everyone', 'teacher', 'student'];

  return (
    <RadioButtonGroup
      label={t('form.availability.description')}
      selected={field.value}
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
