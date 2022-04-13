import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { useSearchParams } from 'react-router-dom';
import { ChildNodeType, NodeType } from '../../modules/nodes/nodeApiTypes';
import { createGuard } from '../../util/guards';
import BooleanDiffField from './BooleanDiffField';
import { DiffType, removeType } from './diffUtils';
import NumberDiffField from './NumberDiffField';
import TextDiffField from './TextDiffField';

interface Props {
  node: DiffType<ChildNodeType> | DiffType<NodeType>;
}

const DiffContainer = styled.div`
  border: 2px solid black;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  padding: 10px;
`;

const isChildNode = createGuard<DiffType<ChildNodeType>>('rank');

const NodeDiff = ({ node }: Props) => {
  const [params] = useSearchParams();

  const fieldFilter = params.get('fieldView') ?? 'changed';
  const filteredNode = fieldFilter === 'changed' ? removeType(node, 'NONE') : node;
  const metadata = filteredNode.metadata;
  const customFields = metadata?.customFields;

  // Don't show diff if changed is the only property to exist on the top-level node.
  if (Object.keys(filteredNode).length === 1) return null;
  return (
    <DiffContainer>
      <TextDiffField fieldName="name" result={node.name} />
      {filteredNode.id && <TextDiffField fieldName="id" result={filteredNode.id} />}
      {filteredNode.contentUri && (
        <TextDiffField fieldName="contentUri" result={filteredNode.contentUri} />
      )}
      {filteredNode.relevanceId && (
        <TextDiffField fieldName="relevance" result={filteredNode.relevanceId} />
      )}
      {isChildNode(filteredNode) && (
        <>
          {filteredNode.connectionId && (
            <TextDiffField fieldName="connectionId" result={filteredNode.connectionId} />
          )}
          {filteredNode.primary && (
            <BooleanDiffField fieldName="primary" result={filteredNode.primary} />
          )}
          {filteredNode.isPrimary && (
            <BooleanDiffField fieldName="isPrimary" result={filteredNode.isPrimary} />
          )}
          {filteredNode.rank && <NumberDiffField label="rank" result={filteredNode.rank} />}
          {filteredNode.parent && <TextDiffField fieldName="parent" result={filteredNode.parent} />}
        </>
      )}
      {filteredNode.path && <TextDiffField fieldName="path" result={filteredNode.path} />}
      {metadata && (
        <>
          {metadata.visible && <BooleanDiffField fieldName="visible" result={metadata.visible} />}
          {customFields && (
            <>
              {customFields['topic-resources'] && (
                <TextDiffField
                  fieldName="topic-resources"
                  result={customFields['topic-resources']}
                />
              )}
            </>
          )}
        </>
      )}
    </DiffContainer>
  );
};
export default NodeDiff;
