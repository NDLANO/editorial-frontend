/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from 'react-i18next';
import { FieldHeader, FieldSection, Select } from '@ndla/forms';
import FormikField from '../../../components/FormikField/FormikField';
import { useAuth0Editors } from '../../../modules/auth0/auth0Queries';
import { DRAFT_WRITE_SCOPE } from '../../../constants';

const ResponsibleField = () => {
  const { t } = useTranslation();
  const { data: users, isLoading } = useAuth0Editors(
    { permission: DRAFT_WRITE_SCOPE },
    {
      select: users => users.map(u => ({ id: `${u.app_metadata.ndla_id}`, name: u.name })),
      placeholderData: [],
    },
  );

  return (
    <FormikField name="responsibleId">
      {({ field }) => (
        <>
          <FieldHeader title={t('form.responsible.label')} width={3 / 4} />
          <FieldSection>
            <div>
              <Select
                disabled={isLoading}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}>
                {!field.value && <option>{t('form.responsible.choose')}</option>}
                {(users ?? []).map(user => {
                  return (
                    <option value={user.id} key={user.id}>
                      {user.name}
                    </option>
                  );
                })}
              </Select>
            </div>
          </FieldSection>
        </>
      )}
    </FormikField>
  );
};

export default ResponsibleField;
