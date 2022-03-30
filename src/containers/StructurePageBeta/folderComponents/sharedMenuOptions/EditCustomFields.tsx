/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Pencil } from '@ndla/icons/action';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemButton from './components/MenuItemButton';
import { EditMode } from '../../../../interfaces';
import { NodeType } from '../../../../modules/nodes/nodeApiTypes';
import MenuItemCustomField from './components/MenuItemCustomField';

interface Props {
  node: NodeType;
  toggleEditMode: (state: EditMode) => void;
  editMode: string;
  onCurrentNodeChanged: (node: NodeType) => void;
}

const EditCustomFields = ({ node, toggleEditMode, editMode, onCurrentNodeChanged }: Props) => {
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
        <MenuItemCustomField node={node} onCurrentNodeChanged={onCurrentNodeChanged} />
      )}
    </div>
  );
};

export default EditCustomFields;
