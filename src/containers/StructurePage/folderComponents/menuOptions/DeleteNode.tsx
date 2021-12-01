/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { DeleteForever } from '@ndla/icons/editor';
import RoundIcon from '../../../../components/RoundIcon';
import handleError from '../../../../util/handleError';
import AlertModal from '../../../../components/AlertModal';
import Spinner from '../../../../components/Spinner';
import Overlay from '../../../../components/Overlay';
import MenuItemButton from './components/MenuItemButton';
import { StyledErrorMessage } from '../styles';
import { updateStatusDraft } from '../../../../modules/draft/draftApi';
import { ARCHIVED } from '../../../../util/constants/ArticleStatus';
import { CHILD_NODES_WITH_ARTICLE_TYPE, NODE_CONNECTIONS } from '../../../../queryKeys';
import {
  useDeleteNodeConnectionMutation,
  useDeleteNodeMutation,
} from '../../../../modules/taxonomy/nodes/nodeMutations';
import {
  useChildNodesWithArticleType,
  useConnectionsForNode,
} from '../../../../modules/taxonomy/nodes/nodeQueries';
import { EditModeHandler } from '../SettingsMenuDropdownType';
import { NodeType } from '../../../../modules/taxonomy/nodes/nodeApiTypes';
import { fetchNodes } from '../../../../modules/taxonomy/nodes/nodeApi';
import { EditMode } from '../../../../interfaces';

interface Props {
  editModeHandler: EditModeHandler;
  node: NodeType;
}

export const DeleteNode = ({ node, editModeHandler }: Props) => {
  const { i18n } = useTranslation();
  const qc = useQueryClient();
  const { data: childNodes } = useChildNodesWithArticleType(node.id, i18n.language, {
    enabled: editModeHandler.editMode === 'deleteNode',
  });
  const { mutateAsync: deleteNode, isLoading: loading, error } = useDeleteNodeMutation();

  const enabled = childNodes && childNodes.length === 0;

  const onDeleteNode = async () => {
    await deleteNode(node.id, {
      onSettled: _ => qc.invalidateQueries([CHILD_NODES_WITH_ARTICLE_TYPE, node.id, i18n.language]),
    });
    editModeHandler.toggleEditMode('deleteNode');
  };

  return (
    <DeleteNodeUi
      type={'Node'}
      disabled={!enabled}
      onDeleteNode={onDeleteNode}
      editModeHandler={editModeHandler}
      loading={loading}
      error={error}
    />
  );
};

interface DeleteNodeProps extends Props {
  rootNodeId: string;
}

export const DeleteChildNode = ({ node, rootNodeId, editModeHandler }: DeleteNodeProps) => {
  const { i18n } = useTranslation();

  const connections = useConnectionsForNode(node.id, {
    enabled: editModeHandler.editMode === 'deleteChildNode',
  });
  const { mutateAsync: deleteChildNode } = useDeleteNodeMutation();

  const deleteNodeConnection = useDeleteNodeConnectionMutation();

  const loading = connections.isLoading || deleteNodeConnection.isLoading;
  const error = connections.error ?? deleteNodeConnection.error;

  const qc = useQueryClient();

  const onDeleteChildNode = async () => {
    editModeHandler.toggleEditMode('deleteChildNode');
    try {
      await deleteNodeConnection.mutateAsync(
        { id: connections.data![0].connectionId },
        {
          onSettled: () => {
            qc.invalidateQueries([CHILD_NODES_WITH_ARTICLE_TYPE, rootNodeId]);
            qc.invalidateQueries([NODE_CONNECTIONS]);
          },
        },
      );
      await setNodeArticleArchived(node, i18n.language);
      await deleteChildNode(node.id);
    } catch (err) {
      handleError(err);
    }
  };

  const setNodeArticleArchived = async (node: NodeType, locale: string) => {
    let articleId = node.contentUri.split(':')[2];
    const nodes = await fetchNodes({ contentURI: `urn:article:${node.id}` });
    if (nodes.length === 1) {
      await updateStatusDraft(parseInt(articleId), ARCHIVED);
    }
  };

  const isDisabled = connections.data && connections.data.length > 1;

  return (
    <DeleteNodeUi
      type={'ChildNode'}
      disabled={isDisabled}
      onDeleteNode={onDeleteChildNode}
      loading={loading}
      error={error}
      editModeHandler={editModeHandler}
    />
  );
};
interface UIProps {
  editModeHandler: EditModeHandler;
  disabled?: boolean;
  onDeleteNode: () => Promise<void>;
  loading: boolean;
  type: 'ChildNode' | 'Node';
  error?: unknown;
}
const DeleteNodeUi = ({
  disabled,
  editModeHandler: { toggleEditMode, editMode },
  onDeleteNode,
  loading,
  error,
  type,
}: UIProps) => {
  const { t } = useTranslation();
  const deleteKey: EditMode = type === 'Node' ? 'deleteNode' : 'deleteChildNode';
  const onEditModeChange = () => toggleEditMode(deleteKey);
  return (
    <>
      <MenuItemButton
        stripped
        data-testid={`delete${type}Option`}
        disabled={disabled}
        onClick={onEditModeChange}>
        <RoundIcon small icon={<DeleteForever />} />
        {t(`taxonomy.delete${type}`)}
      </MenuItemButton>
      <AlertModal
        show={editMode === `delete${type}`}
        actions={[
          {
            text: t('form.abort'),
            onClick: () => onEditModeChange(),
          },
          {
            text: t('alertModal.delete'),
            'data-testid': 'confirmDelete',
            onClick: onDeleteNode,
          },
        ]}
        onCancel={() => onEditModeChange()}
        text={t(`taxonomy.confirmDelete${type}`)}
      />

      {loading && <Spinner appearance="absolute" />}
      {loading && <Overlay modifiers={['absolute', 'white-opacity', 'zIndex']} />}
      {error && (
        <StyledErrorMessage data-testid="inlineEditErrorMessage">
          {/* @ts-ignore */}
          {`${t('taxonomy.errorMessage')}: ${error.message}`}
        </StyledErrorMessage>
      )}
    </>
  );
};
