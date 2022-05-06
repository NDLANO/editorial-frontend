import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteForever } from '@ndla/icons/editor';
import AlertModal from '../../../../components/AlertModal';
import RoundIcon from '../../../../components/RoundIcon';
import { updateStatusDraft } from '../../../../modules/draft/draftApi';
import { ChildNodeType, NodeType } from '../../../../modules/nodes/nodeApiTypes';
import {
  useDeleteNodeConnectionMutation,
  useDeleteNodeMutation,
} from '../../../../modules/nodes/nodeMutations';
import { queryTopics } from '../../../../modules/taxonomy';
import { ARCHIVED } from '../../../../util/constants/ArticleStatus';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';
import { EditModeHandler } from '../SettingsMenuDropdownType';
import MenuItemButton from './components/MenuItemButton';
import Spinner from '../../../../components/Spinner';
import Overlay from '../../../../components/Overlay';
import { StyledErrorMessage } from '../styles';

interface Props {
  node: NodeType | ChildNodeType;
  nodeChildren: NodeType[];
  editModeHandler: EditModeHandler;
  rootNodeId?: string;
}

const DeleteNode = ({
  node,
  nodeChildren,
  editModeHandler: { editMode, toggleEditMode },
  rootNodeId,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const disabled = nodeChildren && nodeChildren.length !== 0;

  const deleteNodeConnectionMutation = useDeleteNodeConnectionMutation();
  const deleteNodeMutation = useDeleteNodeMutation();

  const toggleDelete = () => toggleEditMode('deleteNode');

  const onDelete = async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    toggleDelete();
    try {
      if ('parent' in node) {
        await deleteNodeConnectionMutation.mutateAsync({ id: node.connectionId, taxonomyVersion });
      }
      const articleId = Number(node.contentUri?.split(':')[2]);
      if ('parent' in node && articleId) {
        const topicPlacements = await queryTopics({
          contentId: articleId,
          language: i18n.language,
          taxonomyVersion,
        });
        if (topicPlacements.length === 1) {
          await updateStatusDraft(articleId, ARCHIVED);
        }
      }

      await deleteNodeMutation.mutateAsync(
        {
          id: node.id,
          taxonomyVersion,
          rootId: 'parent' in node ? rootNodeId : undefined,
        },
        { onSuccess: () => setLoading(false) },
      );
    } catch (e) {
      setError(`${t('taxonomy.errorMessage')}${e.message ? `:${e.message}` : ''}`);
      setLoading(false);
    }
  };
  return (
    <>
      <MenuItemButton stripped data-testid="deleteNode" disabled={disabled} onClick={toggleDelete}>
        <RoundIcon small icon={<DeleteForever />} />
        {t('taxonomy.deleteNode')}
      </MenuItemButton>
      <AlertModal
        show={editMode === 'deleteNode'}
        actions={[
          {
            text: t('form.abort'),
            onClick: toggleDelete,
          },
          {
            text: t('alertModal.delete'),
            onClick: onDelete,
          },
        ]}
        onCancel={toggleDelete}
        text={t('taxonomy.confirmDelete')}
      />
      {loading && <Spinner appearance="absolute" />}
      {loading && <Overlay modifiers={['absolute', 'white-opacity', 'zIndex']} />}
      {error && (
        <StyledErrorMessage data-testid="inlineEditErrorMessage">{error}</StyledErrorMessage>
      )}
    </>
  );
};

export default DeleteNode;
