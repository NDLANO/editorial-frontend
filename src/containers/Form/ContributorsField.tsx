/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import Contributors from '../../components/Contributors';
import FormField from '../../components/Form';
import { ContributorType } from '../../interfaces';

interface Props {
  contributorTypes: ContributorType[];
  width?: number;
}

const ContributorsField = ({ contributorTypes, width }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      {contributorTypes.map(contributorType => {
        const label = t(`form.${contributorType}.label`);
        return (
          <FormField
            showError={false}
            key={`form_contributor_${contributorType}`}
            name={contributorType}>
            {({ name, onChange, value, error }) => (
              <Contributors
                name={name}
                value={value}
                onChange={onChange}
                label={label}
                showError={!!error}
                errorMessages={error?.message ? [error.message] : []}
                width={width}
              />
            )}
          </FormField>
        );
      })}
    </>
  );
};

export default ContributorsField;
