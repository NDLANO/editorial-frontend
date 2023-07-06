/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { DeleteForever } from '@ndla/icons/editor';
import { Node, NodeChild } from '@ndla/types-taxonomy';
import AlertModal from '../../../../components/AlertModal';
import RoundIcon from '../../../../components/RoundIcon';
import { updateStatusDraft } from '../../../../modules/draft/draftApi';
import { useDeleteNodeConnectionMutation } from '../../../../modules/nodes/nodeMutations';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import { EditModeHandler } from '../SettingsMenuDropdownType';
import MenuItemButton from './components/MenuItemButton';
import Spinner from '../../../../components/Spinner';
import Overlay from '../../../../components/Overlay';
import { StyledErrorMessage } from '../styles';

interface Props {
  node: Node | NodeChild;
  editModeHandler: EditModeHandler;
  onCurrentNodeChanged: (node?: Node) => void;
}

const DisconnectFromParent = ({
  node,
  editModeHandler: { editMode, toggleEditMode },
  onCurrentNodeChanged,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  const deleteNodeConnectionMutation = useDeleteNodeConnectionMutation();

  const toggleDisconnect = () => toggleEditMode('disconnectFromParent');

  const onDisconnect = async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    toggleDisconnect();
    try {
      if ('parentId' in node) {
        await deleteNodeConnectionMutation.mutateAsync({ id: node.connectionId, taxonomyVersion });
      }
      navigate(location.pathname.split(node.id)[0], { replace: true });
      onCurrentNodeChanged(undefined);
    } catch (error) {
      const e = error as Error;
      setError(`${t('taxonomy.errorMessage')}${e.message ? `:${e.message}` : ''}`);
      setLoading(false);
    }
  };
  return (
    <>
      <MenuItemButton data-testid="disconnectNode" onClick={toggleDisconnect}>
        <RoundIcon small icon={<DeleteForever />} />
        {t('taxonomy.disconnectNode')}
      </MenuItemButton>
      <AlertModal
        label={t('taxonomy.disconnectNode')}
        title={t('taxonomy.disconnectNode')}
        show={editMode === 'disconnectFromParent'}
        actions={[
          {
            text: t('form.abort'),
            onClick: toggleDisconnect,
          },
          {
            text: t('alertModal.disconnect'),
            onClick: onDisconnect,
          },
        ]}
        onCancel={toggleDisconnect}
        text={t('taxonomy.confirmDisconnect')}
      />
      {loading && <Spinner appearance="absolute" />}
      {loading && <Overlay modifiers={['absolute', 'white-opacity', 'zIndex']} />}
      {error && (
        <StyledErrorMessage data-testid="inlineEditErrorMessage">{error}</StyledErrorMessage>
      )}
    </>
  );
};

export default DisconnectFromParent;
