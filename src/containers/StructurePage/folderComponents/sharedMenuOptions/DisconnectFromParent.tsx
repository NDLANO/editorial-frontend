/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { DeleteForever } from '@ndla/icons/editor';
import { Node, NodeChild } from '@ndla/types-taxonomy';
import AlertModal from '../../../../components/AlertModal';
import RoundIcon from '../../../../components/RoundIcon';
import { useDeleteNodeConnectionMutation } from '../../../../modules/nodes/nodeMutations';
import { childNodesWithArticleTypeQueryKey } from '../../../../modules/nodes/nodeQueries';
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
  const { mutateAsync: disconnectNode } = useDeleteNodeConnectionMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();

  const toggleDisconnect = () => toggleEditMode('disconnectFromParent');

  const onDisconnect = async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    toggleDisconnect();
    if ('connectionId' in node) {
      await disconnectNode(
        {
          id: node.connectionId,
          taxonomyVersion,
        },
        {
          onSuccess: () => {
            qc.invalidateQueries(
              childNodesWithArticleTypeQueryKey({
                taxonomyVersion,
                language: i18n.language,
              }),
            );
            navigate(location.pathname.split(node.id)[0], { replace: true });
            onCurrentNodeChanged(undefined);
          },
          onError: () => setError(t('taxonomy.errorMessage')),
        },
      );
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