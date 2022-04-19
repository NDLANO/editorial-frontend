import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { ContentLoader, MessageBox } from '@ndla/ui';
import { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ChildNodeType, NodeType } from '../../modules/nodes/nodeApiTypes';
import { useNodeTree } from '../../modules/nodes/nodeQueries';
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

  useEffect(() => {
    setSelectedNode(undefined);
  }, [originalHash, otherHash]);
  const defaultQuery = useNodeTree(
    {
      id: nodeId,
      language: i18n.language,
      taxonomyVersion: originalHash,
    },
    { enabled: !!nodeId },
  );
  const otherRootQuery = useNodeTree(
    {
      id: nodeId,
      language: i18n.language,
      taxonomyVersion: otherHash || originalHash,
    },
    { enabled: !!nodeId },
  );

  const shownNodes = Math.max(
    (defaultQuery.data?.children.length ?? 0) + 1,
    (otherRootQuery.data?.children.length ?? 0) + 1,
  );

  if (defaultQuery.isLoading || otherRootQuery.isLoading) {
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

  const diff = diffTrees(defaultQuery.data!, otherRootQuery.data!, view);

  const test: DiffType<ChildNodeType>[] = diff.children;

  const nodes = filterNodes(test, {
    nodeView: params.get('nodeView') ?? 'changed',
    fieldView: params.get('fieldView'),
  });

  const isEqual =
    diff.root.changed.diffType === 'NONE' && diff.root.childrenChanged?.diffType === 'NONE';
  return (
    <div id="diffContainer">
      {isEqual && <MessageBox>{t('diff.equalNodes')}</MessageBox>}
      {view === 'tree' && (
        <RootNode tree={diff} onNodeSelected={setSelectedNode} selectedNode={selectedNode} />
      )}
      {view === 'tree' && selectedNode && <NodeDiff node={selectedNode} />}
      {view === 'flat' && (
        <StyledNodeList>
          <NodeDiff node={diff.root} key={diff.root.id.original ?? diff.root.id.other!} />
          {nodes.map(node => (
            <NodeDiff node={node} key={node.id.original ?? node.id.other} />
          ))}
        </StyledNodeList>
      )}
    </div>
  );
};

export default NodeDiffcontainer;
