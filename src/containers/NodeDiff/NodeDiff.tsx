import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ChildNodeType, NodeType } from '../../modules/nodes/nodeApiTypes';
import { createGuard } from '../../util/guards';
import ArrayDiffField from './ArrayDiffField';
import { DiffType, removeType } from './diffUtils';
import FieldDiff from './FieldDiff';
import TranslationsDiff from './TranslationsDiff';

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
  const { t } = useTranslation();

  const fieldFilter = params.get('fieldView') ?? 'changed';
  const filteredNode = fieldFilter === 'changed' ? removeType(node, 'NONE') : node;
  const metadata = filteredNode.metadata;
  const customFields = metadata?.customFields;

  // Don't show diff if changed is the only property to exist on the top-level node.
  if (Object.keys(filteredNode).length === 1) return null;
  return (
    <DiffContainer>
      <FieldDiff fieldName="name" result={node.name} toDisplayValue={v => v} />
      {filteredNode.id && (
        <FieldDiff fieldName="id" result={filteredNode.id} toDisplayValue={v => v} />
      )}
      {filteredNode.contentUri && (
        <FieldDiff
          fieldName="contentUri"
          result={filteredNode.contentUri}
          toDisplayValue={v => v}
        />
      )}
      {filteredNode.translations && <TranslationsDiff translations={filteredNode.translations} />}
      {filteredNode.supportedLanguages && (
        <ArrayDiffField
          fieldName="supportedLanguages"
          result={filteredNode.supportedLanguages}
          toDisplayValue={value => value}
        />
      )}
      {filteredNode.paths && (
        <ArrayDiffField fieldName="paths" result={filteredNode.paths} toDisplayValue={val => val} />
      )}
      {filteredNode.relevanceId && (
        <FieldDiff
          fieldName="relevance"
          result={filteredNode.relevanceId}
          toDisplayValue={v => v}
        />
      )}
      {isChildNode(filteredNode) && (
        <>
          {filteredNode.connectionId && (
            <FieldDiff
              fieldName="connectionId"
              result={filteredNode.connectionId}
              toDisplayValue={v => v}
            />
          )}
          {filteredNode.primary && (
            <FieldDiff
              fieldName="primary"
              result={filteredNode.primary}
              toDisplayValue={v => t(`diff.fields.primary.${v ? 'isOn' : 'isOff'}`)}
            />
          )}
          {filteredNode.isPrimary && (
            <FieldDiff
              fieldName="isPrimary"
              result={filteredNode.isPrimary}
              toDisplayValue={v => t(`diff.fields.isPrimary.${v ? 'isOn' : 'isOff'}`)}
            />
          )}
          {filteredNode.rank && (
            <FieldDiff
              fieldName="rank"
              result={filteredNode.rank}
              toDisplayValue={v => v.toString()}
            />
          )}
          {filteredNode.parent && (
            <FieldDiff fieldName="parent" result={filteredNode.parent} toDisplayValue={v => v} />
          )}
        </>
      )}
      {filteredNode.path && (
        <FieldDiff fieldName="path" result={filteredNode.path} toDisplayValue={v => v} />
      )}
      {metadata && (
        <>
          {metadata.visible && (
            <FieldDiff
              fieldName="visible"
              result={metadata.visible}
              toDisplayValue={v => t(`diff.fields.visible.${v ? 'isOn' : 'isOff'}`)}
            />
          )}
          {metadata.grepCodes && (
            <ArrayDiffField
              fieldName="grepCodes"
              result={metadata.grepCodes}
              toDisplayValue={val => val}
            />
          )}
          {customFields && (
            <>
              {customFields['topic-resources'] && (
                <FieldDiff
                  fieldName="topic-resources"
                  result={customFields['topic-resources']}
                  toDisplayValue={v => v}
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
