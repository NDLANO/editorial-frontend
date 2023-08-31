/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import sortBy from 'lodash/sortBy';
import { DRAFT_RESPONSIBLE, TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA } from '../../../../constants';
import TaxonomyMetadataDropdown from './TaxonomyMetadataDropdown';
import { useAuth0Responsibles } from '../../../../modules/auth0/auth0Queries';

interface Props {
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
}

const SubjectLMASelector = ({ customFields, updateCustomFields }: Props) => {
  const { t } = useTranslation();
  const { data: responsibles } = useAuth0Responsibles(
    { permission: DRAFT_RESPONSIBLE },
    {
      select: (users) =>
        sortBy(
          users.map((u) => ({
            id: `${u.app_metadata.ndla_id}`,
            name: u.name,
          })),
          (u) => u.name,
        ),
      placeholderData: [],
    },
  );
  const options =
    responsibles?.map((responsible) => ({
      key: responsible.id,
      value: responsible.name,
    })) || [];
  const messages = {
    selected: t('taxonomy.metadata.placeholders.lma'),
    title: t('taxonomy.metadata.customFields.subjectLMA'),
  };
  return (
    <TaxonomyMetadataDropdown
      field={TAXONOMY_CUSTOM_FIELD_SUBJECT_LMA}
      options={options}
      customFields={customFields}
      updateCustomFields={updateCustomFields}
      messages={messages}
    />
  );
};

export default SubjectLMASelector;
