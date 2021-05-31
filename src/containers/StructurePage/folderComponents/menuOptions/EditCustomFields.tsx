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
import { TaxonomyElement } from '../../../../interfaces';
import MenuItemButton from './MenuItemButton';
import MenuItemCustomField from './MenuItemCustomField';

interface Props extends TaxonomyElement {
  toggleEditMode: (state: string) => void;
  editMode: string;
  saveSubjectItems: (subjectid: string, saveItems: Pick<TaxonomyElement, 'metadata'>) => void;
  refreshTopics: () => void;
  type: 'topic' | 'subject';
}

const EditCustomFields = ({
  id,
  name,
  metadata,
  toggleEditMode,
  editMode,
  saveSubjectItems,
  refreshTopics,
  type,
  t,
}: Props & tType) => {
  return (
    <div>
      <MenuItemButton
        stripped
        data-testid="editSubjectFiltersButton"
        onClick={() => toggleEditMode('openCustomFields')}>
        <RoundIcon small open={editMode === 'openCustomFields'} icon={<Pencil />} />
        {t('taxonomy.metadata.customFields.alterFields')}
      </MenuItemButton>

      {editMode === 'openCustomFields' && (
        <MenuItemCustomField
          id={id}
          name={name}
          metadata={metadata}
          saveSubjectItems={saveSubjectItems}
          type={type}
          refreshTopics={refreshTopics}
        />
      )}
    </div>
  );
};

export default injectT(EditCustomFields);
