/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Switch } from '@ndla/switch';
import { NodeType } from '../../../../modules/nodes/nodeApiTypes';
import { EditModeHandler } from '../SettingsMenuDropdownType';
import { useUpdateNodeMetadataMutation } from '../../../../modules/nodes/nodeMutations';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemButton from './components/MenuItemButton';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';

interface Props {
  node: NodeType;
  editModeHandler: EditModeHandler;
  rootNodeId: string;
}

export const DropDownWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  background-color: white;
  padding: calc(${spacing.small} / 2);
`;

const ToggleVisibility = ({
  node,
  editModeHandler: { toggleEditMode, editMode },
  rootNodeId,
}: Props) => {
  const { t } = useTranslation();
  const { name, id, metadata } = node;
  const [visible, setVisible] = useState(metadata?.visible);
  const { taxonomyVersion } = useTaxonomyVersion();
  const { mutateAsync: updateMetadata } = useUpdateNodeMetadataMutation();

  const toggleVisibility = async () => {
    await updateMetadata({
      vars: {
        id,
        metadata: { grepCodes: metadata.grepCodes, visible: !visible },
        rootId: rootNodeId !== node.id ? rootNodeId : undefined,
      },
      taxonomyVersion,
    });
    setVisible(!visible);
  };

  const toggleEditModes = () => toggleEditMode('toggleMetadataVisibility');

  return (
    <>
      <MenuItemButton stripped data-testid="toggleVisibilityButton" onClick={toggleEditModes}>
        <RoundIcon small icon={<Eye />} />
        {t('metadata.changeVisibility')}
      </MenuItemButton>
      {editMode === 'toggleMetadataVisibility' && (
        <DropDownWrapper>
          {name} {t(`metadata.${visible ? 'visible' : 'notVisible'}`)}
          <Switch onChange={toggleVisibility} checked={visible} label="" id={'visible'} />
        </DropDownWrapper>
      )}
    </>
  );
};

export default ToggleVisibility;
