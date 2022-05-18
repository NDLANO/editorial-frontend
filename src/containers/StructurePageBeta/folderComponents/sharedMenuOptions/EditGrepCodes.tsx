/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { Plus, Pencil } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { EditModeHandler } from '../SettingsMenuDropdownType';
import { NodeType } from '../../../../modules/nodes/nodeApiTypes';
import { useUpdateNodeMetadataMutation } from '../../../../modules/nodes/nodeMutations';
import Spinner from '../../../../components/Spinner';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemButton from './components/MenuItemButton';
import { useGrepCodes } from '../../../../modules/grep/grepQueries';
import MenuItemEditField from './components/MenuItemEditField';
import { getRootIdForNode, isRootNode } from '../../../../modules/nodes/nodeUtil';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';

interface Props {
  editModeHandler: EditModeHandler;
  node: NodeType;
}

export const DropDownWrapper = styled('div')`
  font-size: 0.9rem;
  background-color: white;
  padding: calc(${spacing.small} / 2);
`;

const StyledGrepItem = styled('div')`
  display: flex;
  justify-content: space-between;
  margin: calc(var(--spacing--small) / 2);
`;

const EditGrepCodes = ({ node, editModeHandler: { editMode, toggleEditMode } }: Props) => {
  const rootId = getRootIdForNode(node);
  const { t } = useTranslation();
  const { id, metadata } = node;
  const [grepCodes, setGrepCodes] = useState<string[]>(metadata?.grepCodes ?? []);
  const [addingNewGrepCode, setAddingNewGrepCode] = useState(false);
  const { taxonomyVersion } = useTaxonomyVersion();
  const { mutateAsync: patchMetadata } = useUpdateNodeMetadataMutation();
  const grepCodesWithName = useGrepCodes(grepCodes, editMode === 'editGrepCodes');

  const updateMetadata = async (codes: string[]) => {
    await patchMetadata({
      id,
      metadata: { grepCodes: codes, visible: metadata.visible },
      rootId: isRootNode(node) ? undefined : rootId,
      taxonomyVersion,
    });
    setGrepCodes(codes);
  };

  const toggleEditModes = () => toggleEditMode('editGrepCodes');

  const addGrepCode = async (code: string) => updateMetadata([...grepCodes, code.toUpperCase()]);

  const deleteGrepCode = (code: string) => updateMetadata(grepCodes.filter(c => c !== code));

  const grepCodesList = (
    <DropDownWrapper>
      {grepCodesWithName?.length > 0 ? (
        grepCodesWithName.map((grepCode, index) => {
          if (grepCode.isLoading) {
            return <Spinner key={index} />;
          }
          if (!grepCode.data) {
            return null;
          }
          return (
            <StyledGrepItem key={index}>
              {grepCode.data.title}
              <Button
                stripped
                data-testid="deleteGrepCode"
                onClick={() => deleteGrepCode(grepCode.data.code)}>
                <RoundIcon small icon={<DeleteForever />} />
              </Button>
            </StyledGrepItem>
          );
        })
      ) : (
        <p>{t('taxonomy.grepCodes.empty')}</p>
      )}

      {addingNewGrepCode ? (
        <MenuItemEditField
          currentVal=""
          messages={{ errorMessage: t('taxonomy.errorMessage') }}
          dataTestid="addGrepCopde"
          onClose={() => setAddingNewGrepCode(!addingNewGrepCode)}
          onSubmit={addGrepCode}
          icon={<Pencil />}
          placeholder={t('form.grepCodes.placeholder')}
        />
      ) : (
        <Button
          stripped
          data-testid="addFilterButton"
          onClick={() => setAddingNewGrepCode(!addingNewGrepCode)}>
          <Plus />
          {t('taxonomy.grepCodes.addNew')}
        </Button>
      )}
    </DropDownWrapper>
  );

  return (
    <>
      <MenuItemButton stripped data-testid="editGrepCodes" onClick={() => toggleEditModes()}>
        <RoundIcon small icon={<Pencil />} />
        {t('taxonomy.grepCodes.edit')}
      </MenuItemButton>
      {editMode === 'editGrepCodes' && grepCodesList}
    </>
  );
};

export default EditGrepCodes;
