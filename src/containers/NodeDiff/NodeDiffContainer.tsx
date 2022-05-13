/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import Button from '@ndla/button';
import { spacing } from '@ndla/core';
import { ContentLoader, MessageBox } from '@ndla/ui';
import { isEqual } from 'lodash';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import AlertModal from '../../components/AlertModal';
import { TAXONOMY_ADMIN_SCOPE } from '../../constants';
import { ChildNodeType, NodeType } from '../../modules/nodes/nodeApiTypes';
import { usePublishNodeMutation } from '../../modules/nodes/nodeMutations';
import { nodeTreeQueryKeys, useNodeTree } from '../../modules/nodes/nodeQueries';
import { fetchVersions } from '../../modules/taxonomy/versions/versionApi';
import { useSession } from '../Session/SessionProvider';
import { diffTrees, DiffType } from './diffUtils';
import NodeDiff from './NodeDiff';
import { RootNode } from './TreeNode';

interface Props {
  originalHash: string;
  nodeId: string;
  otherHash?: string;
}

const StyledNodeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const DiffContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const PublishButton = styled(Button)`
  align-self: flex-end;
  margin-right: ${spacing.small};
`;

interface NodeOptions {
  nodeView: string | null;
  fieldView: string | null;
}

const filterNodes = <T,>(diff: DiffType<T>[], options: NodeOptions): DiffType<T>[] => {
  const afterNodeOption =
    options.nodeView !== 'changed'
      ? diff
      : diff.filter(d => d.changed.diffType !== 'NONE' ?? d.childrenChanged?.diffType !== 'NONE');

  return afterNodeOption;
};

const NodeDiffcontainer = ({ originalHash, otherHash, nodeId }: Props) => {
  const [params] = useSearchParams();
  const view = params.get('view') === 'flat' ? 'flat' : 'tree';
  const { t, i18n } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<DiffType<NodeType> | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [hasPublished, setHasPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermissions } = useSession();
  const qc = useQueryClient();

  const publishNodeMutation = usePublishNodeMutation({
    onSettled: () =>
      qc.invalidateQueries(nodeTreeQueryKeys({ id: nodeId, taxonomyVersion: originalHash })),
  });

  useEffect(() => {
    setSelectedNode(undefined);
  }, [originalHash, otherHash]);

  const defaultQuery = useNodeTree(
    {
      id: nodeId,
      language: i18n.language,
      taxonomyVersion: originalHash,
    },
    {
      enabled: !!nodeId,
      //@ts-ignore
      retry: (_, err) => err.status !== 404,
    },
  );
  const otherQuery = useNodeTree(
    {
      id: nodeId,
      language: i18n.language,
      taxonomyVersion: otherHash || originalHash,
    },
    {
      enabled: !!nodeId && !!otherHash,
      //@ts-ignore
      retry: (_, err) => err.status !== 404,
    },
  );

  useEffect(() => {
    if (defaultQuery.isLoading || otherQuery.isLoading || (defaultQuery.data && otherQuery.data)) {
      setError(undefined);
      return;
    }
    if (!defaultQuery.data && !otherQuery.data) {
      setError('diff.error.doesNotExist');
    } else if (!defaultQuery.data) {
      setError('diff.error.onlyExistsInOther');
    } else {
      setError('diff.error.onlyExistsInOriginal');
    }
  }, [defaultQuery.data, defaultQuery.isLoading, otherQuery.data, otherQuery.isLoading]);

  const onPublish = async (node: NodeType) => {
    setHasPublished(false);
    if (!userPermissions?.includes(TAXONOMY_ADMIN_SCOPE) || originalHash === 'default') {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const targetVersions = await fetchVersions({
      hash: originalHash,
      taxonomyVersion: 'default',
    });
    const sourceVersions =
      otherHash !== 'default'
        ? await fetchVersions({ hash: otherHash, taxonomyVersion: 'default' })
        : undefined;
    if (targetVersions.length !== 1 || (sourceVersions && sourceVersions.length !== 1)) {
      setIsLoading(false);
      setError('diff.publishError');
      return;
    }

    const targetVersion = targetVersions[0];
    const sourceVersion = sourceVersions?.[0];

    await publishNodeMutation.mutateAsync(
      { id: node.id, targetId: targetVersion.id, sourceId: sourceVersion?.id },
      {
        onSuccess: () => setHasPublished(true),
        onError: () => {
          setHasPublished(false);
          setError('diff.publishError');
        },
      },
    );
    setIsLoading(false);
  };

  const shownNodes = Math.max(
    (defaultQuery.data?.children.length ?? 0) + 1,
    (otherQuery.data?.children.length ?? 0) + 1,
  );

  if (defaultQuery.isLoading || otherQuery.isLoading) {
    const rows: ReactNode[] = [];
    for (let i = 0; i < shownNodes; i++) {
      rows.push(
        <rect
          x="0"
          y={(i * 45).toString()}
          rx="3"
          ry="3"
          width="800"
          height="40"
          key={`rect-${i}`}
        />,
      );
    }
    return (
      <ContentLoader width={800} height={shownNodes * 50}>
        {rows}
      </ContentLoader>
    );
  }

  const diff = diffTrees(defaultQuery.data!, otherQuery.data!, view);
  const children: DiffType<ChildNodeType>[] = diff.children;

  const nodes = filterNodes(children, {
    nodeView: params.get('nodeView') ?? 'changed',
    fieldView: params.get('fieldView'),
  });

  const equal =
    (defaultQuery.data || otherQuery.data) &&
    diff.root.changed.diffType === 'NONE' &&
    diff.root.childrenChanged?.diffType === 'NONE';
  const publishable =
    !equal && userPermissions?.includes(TAXONOMY_ADMIN_SCOPE) && originalHash !== 'default';
  const isPublishing =
    isLoading || defaultQuery.data?.root.metadata.customFields['isPublishing'] === 'true';
  return (
    <DiffContainer id="diffContainer">
      {publishable && (
        <PublishButton onClick={() => setShowAlertModal(true)} disabled={isPublishing}>
          {t(`diff.${isPublishing ? 'publishing' : 'publish'}`)}
        </PublishButton>
      )}
      {hasPublished && <MessageBox>{t('diff.published')}</MessageBox>}
      {equal && <MessageBox>{t('diff.equalNodes')}</MessageBox>}
      {error && <MessageBox>{t(error)}</MessageBox>}
      {view === 'tree' && (
        <RootNode tree={diff} onNodeSelected={setSelectedNode} selectedNode={selectedNode} />
      )}
      {view === 'tree' && selectedNode && (
        <NodeDiff node={selectedNode} isRoot={isEqual(selectedNode.id, diff.root.id)} />
      )}
      {view === 'flat' && (
        <StyledNodeList>
          <NodeDiff
            node={diff.root}
            key={diff.root.id.original ?? diff.root.id.other!}
            isRoot={true}
          />
          {nodes.map(node => (
            <NodeDiff node={node} key={node.id.original ?? node.id.other} />
          ))}
        </StyledNodeList>
      )}
      <AlertModal
        show={showAlertModal}
        text={t('diff.publishWarning')}
        actions={[
          {
            text: t('form.abort'),
            onClick: () => setShowAlertModal(false),
          },
          {
            text: t('alertModal.continue'),
            onClick: () => {
              setShowAlertModal(false);
              if (otherQuery.data?.root) {
                onPublish(otherQuery.data.root);
              }
            },
          },
        ]}
        onCancel={() => setShowAlertModal(false)}
      />
    </DiffContainer>
  );
};

export default NodeDiffcontainer;
