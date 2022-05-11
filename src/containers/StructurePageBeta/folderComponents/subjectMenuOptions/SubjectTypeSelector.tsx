/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { constants } from '@ndla/ui';
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE } from '../../../../constants';
import TaxonomyMetadataDropdown from './TaxonomyMetadataDropdown';

interface Props {
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
}

const SubjectTypeSelector = ({ customFields, updateCustomFields }: Props) => {
  const { t } = useTranslation();
  const { subjectTypes } = constants;
  const types = [subjectTypes.SUBJECT, subjectTypes.RESOURCE_COLLECTION];
  const options = types.map(type => ({
    key: type,
    value: t(`subjectTypes.${type}`),
  }));
  const messages = {
    selected: t('taxonomy.metadata.placeholders.type'),
    title: t('taxonomy.metadata.customFields.subjectType'),
  };
  return (
    <TaxonomyMetadataDropdown
      field={TAXONOMY_CUSTOM_FIELD_SUBJECT_TYPE}
      options={options}
      customFields={customFields}
      updateCustomFields={updateCustomFields}
      messages={messages}
    />
  );
};

export default SubjectTypeSelector;
