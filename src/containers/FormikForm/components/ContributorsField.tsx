/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from 'react-i18next';
import Contributors from '../../../components/Contributors';
import FormikField from '../../../components/FormikField';

interface Props {
  contributorTypes: string[];
  width?: number;
}

const ContributorsField = ({ contributorTypes, width }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      {contributorTypes.map((contributorType) => {
        const label = t(`form.${contributorType}.label`);
        return (
          <FormikField
            showError={false}
            key={`formik_contributor_${contributorType}`}
            name={contributorType}
          >
            {({ field, form }) => {
              const { errors } = form;
              const error = errors[field.name] || '';
              return (
                <Contributors
                  label={label}
                  labelRemove={t(`form.${contributorType}.labelRemove`)}
                  showError={!!errors[field.name]}
                  errorMessages={errors[field.name] ? [error] : []}
                  width={width}
                  {...field}
                />
              );
            }}
          </FormikField>
        );
      })}
    </>
  );
};

export default ContributorsField;
