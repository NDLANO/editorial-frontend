/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { Plus } from '@ndla/icons/action';
import GroupNodeResources from '../GroupNodeResources';
import { TaxonomyMetadata } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import CustomFieldComponent from './components/CustomFieldComponent';
import {
  TAXONOMY_CUSTOM_FIELD_LANGUAGE,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
} from '../../../../constants';
import { filterWrapper } from '../styles';
import ToggleExplanationSubject from './ToggleExplanationSubject';
import TaxonomyMetadataLanguageSelector from './TaxonomyMetadataLanguageSelector';
import ConstantMetaField from './components/ConstantMetaField';
import NodeCategorySelector from './NodeCategorySelector';
import { NodeType, SUBJECT_NODE } from '../../../../modules/taxonomy/nodes/nodeApiTypes';
import { useUpdateNodeMetadataMutation } from '../../../../modules/taxonomy/nodes/nodeMutations';
import { getNodeTypeFromNodeId } from '../../../../modules/taxonomy/nodes/nodeUtil';

interface Props {
  node: NodeType;
}

const MenuItemCustomField = ({ node }: Props) => {
  const { t } = useTranslation();
  const { id, metadata } = node;
  const nodeType = getNodeTypeFromNodeId(id);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [customFields, setCustomFields] = useState<TaxonomyMetadata['customFields']>(
    metadata.customFields,
  );

  const { mutateAsync: updateMetadata } = useUpdateNodeMetadataMutation();

  useEffect(() => {
    if (customFields !== metadata.customFields) {
      updateMetadata({ id, metadata: { customFields } });
    }
  }, [customFields]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredRootFields = [
    TAXONOMY_CUSTOM_FIELD_LANGUAGE,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID,
    TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
  ];
  const [filteredChildFields] = [TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES];

  const filterHardcodedMetadataValues = () => {
    return Object.entries(customFields).filter(([taxonomyMetadataField, _]) => {
      const fieldsToFilter = nodeType === SUBJECT_NODE ? filteredRootFields : filteredChildFields;
      return !fieldsToFilter.includes(taxonomyMetadataField);
    });
  };

  return (
    <div>
      {nodeType === SUBJECT_NODE ? (
        <>
          <TaxonomyMetadataLanguageSelector
            customFields={customFields}
            updateCustomFields={setCustomFields}
          />
          <NodeCategorySelector customFields={customFields} updateCustomFields={setCustomFields} />
          <ToggleExplanationSubject customFields={customFields} updateFields={setCustomFields} />
          <ConstantMetaField
            keyPlaceholder={t('taxonomy.metadata.customFields.oldSubjectId')}
            valuePlaceholder={'urn:subject:***'}
            fieldKey={TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID}
            onSubmit={setCustomFields}
            initialVal={metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID]}
          />
        </>
      ) : (
        <GroupNodeResources node={node} />
      )}
      {filterHardcodedMetadataValues()
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, value]) => (
          <CustomFieldComponent
            key={`unique-${key}`}
            onSubmit={setCustomFields}
            initialKey={key}
            initialVal={value}
          />
        ))}

      {isOpen ? (
        <CustomFieldComponent onSubmit={setCustomFields} onClose={() => setOpen(false)} />
      ) : (
        <div css={filterWrapper}>
          <Button
            stripped
            css={css`
              text-decoration: underline;
            `}
            data-testid="addCustomFieldButton"
            onClick={() => setOpen(true)}>
            <Plus />
            {t('taxonomy.metadata.customFields.addField')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MenuItemCustomField;
