/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pencil } from '@ndla/icons/action';
import RoundIcon from '../../../../components/RoundIcon';
import { TaxonomyElement } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import MenuItemButton from './MenuItemButton';
import MenuItemCustomField from './MenuItemCustomField';
import { EditMode } from '../../../../interfaces';

interface Props extends TaxonomyElement {
  subjectId: string;
  toggleEditMode: (state: EditMode) => void;
  editMode: string;
  type: 'topic' | 'subject';
}

const EditCustomFields = ({
  id,
  subjectId,
  name,
  metadata,
  toggleEditMode,
  editMode,
  type,
}: Props) => {
  const { t } = useTranslation();
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
          type={type}
        />
      )}
    </div>
  );
};

export default EditCustomFields;
