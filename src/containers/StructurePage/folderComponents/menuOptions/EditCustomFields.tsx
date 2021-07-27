/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { Pencil } from '@ndla/icons/action';
import RoundIcon from '../../../../components/RoundIcon';
import {
  SubjectTopic,
  TaxonomyElement,
  TaxonomyMetadata,
} from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import MenuItemButton from './MenuItemButton';
import MenuItemCustomField from './MenuItemCustomField';

interface Props extends TaxonomyElement {
  subjectId: string;
  toggleEditMode: (state: string) => void;
  editMode: string;
  saveSubjectItems: (
    subjectid: string,
    saveItems: { topics?: SubjectTopic[]; loading?: boolean; metadata?: TaxonomyMetadata },
  ) => void;
  saveSubjectTopicItems: (topicId: string, saveItems: Pick<TaxonomyElement, 'metadata'>) => void;
  type: 'topic' | 'subject';
}

const EditCustomFields = ({
  id,
  subjectId,
  name,
  metadata,
  toggleEditMode,
  editMode,
  saveSubjectItems,
  saveSubjectTopicItems,
  type,
  t,
}: Props & tType) => {
  return (
    <div>
      <MenuItemButton
        stripped
        data-testid="editCustomFieldsButton"
        onClick={() => toggleEditMode('openCustomFields')}>
        <RoundIcon small open={editMode === 'openCustomFields'} icon={<Pencil />} />
        {t('taxonomy.metadata.customFields.alterFields')}
      </MenuItemButton>

      {editMode === 'openCustomFields' && (
        <MenuItemCustomField
          id={id}
          subjectId={subjectId}
          name={name}
          metadata={metadata}
          saveSubjectItems={saveSubjectItems}
          type={type}
          updateLocalTopics={saveSubjectTopicItems}
        />
      )}
    </div>
  );
};

export default injectT(EditCustomFields);
