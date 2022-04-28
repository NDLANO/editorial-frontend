/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { MenuBook } from '@ndla/icons/lib/action';
import { Subject } from '@ndla/icons/lib/contentType';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  ChildNodeType,
  NodeType,
  ResourceWithNodeConnection,
} from '../../modules/nodes/nodeApiTypes';
import { getNodeTypeFromNodeId } from '../../modules/nodes/nodeUtil';
import ArrayDiffField from './ArrayDiffField';
import { diffField, DiffType, DiffTypeWithChildren, removeType } from './diffUtils';
import { DiffTypePill } from './TreeNode';
import FieldDiff from './FieldDiff';
import TranslationsDiff from './TranslationsDiff';

interface Props {
  node: DiffType<NodeType> | DiffTypeWithChildren;
  isRoot?: boolean;
}

const DiffContainer = styled.div`
  border: 2px solid black;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  padding: 10px;
`;

const RootNodePill = styled.div`
  background-color: ${colors.brand.primary};
  color: ${colors.white};
  padding: 0 ${spacing.small};
  border-radius: 15px;
  margin-right: 10px;
`;

const NodeInfoContainer = styled.div`
  justify-content: flex-end;
  align-items: center;
  display: flex;
  flex-direction: row;
`;

const iconCSS = css`
  height: 31px;
  width: 31px;
  color: ${colors.brand.primary};
`;

const SummaryContent = styled.div`
  display: inline-flex;
  justify-content: space-between;
  flex-direction: row;
  width: 97%;
`;

const StyledDetails = styled.details`
  margin: 0 !important;
`;

const DetailsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const isChildNode = (
  node: Partial<DiffType<NodeType | ChildNodeType>>,
): node is DiffTypeWithChildren => 'parent' in node;

interface NodeIconProps {
  node: DiffType<NodeType>;
}

const NodeIcon = ({ node }: NodeIconProps) => {
  const { t } = useTranslation();
  const nodeType = getNodeTypeFromNodeId(node.id.other ?? node.id.original!);

  const Icon = nodeType === 'SUBJECT' ? MenuBook : Subject;

  return (
    <Tooltip tooltip={t(`diff.nodeTypeTooltips.${nodeType}`)}>
      <Icon css={iconCSS} />
    </Tooltip>
  );
};

const NodeDiff = ({ node, isRoot }: Props) => {
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
      <NodeInfoContainer>
        {isRoot && <RootNodePill>{t('diff.isRoot')}</RootNodePill>}
        <NodeIcon node={node} />
      </NodeInfoContainer>
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
      {isChildNode(filteredNode) && (
        <ResourceDiffList resources={filteredNode.resources} fieldFilter={fieldFilter} />
      )}
    </DiffContainer>
  );
};

interface ResourceDiffListProps {
  resources?: DiffType<ResourceWithNodeConnection>[];
  fieldFilter: string;
}

const ResourceDiffList = ({ resources, fieldFilter }: ResourceDiffListProps) => {
  const { t } = useTranslation();

  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <>
      <strong>{t('taxonomy.resources')}</strong>
      {resources.map((res, i) => (
        <ResourceDiff resource={res} fieldView={fieldFilter} key={`resource-${i}`} />
      ))}
    </>
  );
};

interface ResourceDiffProps {
  resource: DiffType<ResourceWithNodeConnection>;
  fieldView: string;
}

const ResourceDiff = ({ resource, fieldView }: ResourceDiffProps) => {
  const { t } = useTranslation();
  const res = fieldView === 'changed' ? removeType(resource, 'NONE') : resource;
  const originalResourceTypes = (res.resourceTypes?.original?.map(rt => rt.name) ?? []).sort();
  const otherResourceTypes = (res.resourceTypes?.other?.map(rt => rt.name) ?? []).sort();
  const resourceTypeDiff = diffField(
    originalResourceTypes,
    otherResourceTypes,
    resource.changed.diffType,
  );
  if (Object.keys(res).length === 1) {
    return null;
  }
  return (
    <StyledDetails>
      <summary>
        <SummaryContent>
          {resource.name.other ?? resource.name.original}
          <DiffTypePill diffType={resource.changed.diffType} />
        </SummaryContent>
      </summary>
      <DetailsContent>
        {res.connectionId && (
          <FieldDiff fieldName="connectionId" result={res.connectionId} toDisplayValue={v => v} />
        )}
        {res.contentUri && (
          <FieldDiff fieldName="contentUri" result={res.contentUri} toDisplayValue={v => v} />
        )}
        {res.id && <FieldDiff fieldName="id" result={res.id} toDisplayValue={v => v} />}
        {res.name && <FieldDiff fieldName="name" result={res.name} toDisplayValue={v => v} />}
        {res.nodeId && <FieldDiff fieldName="nodeId" result={res.nodeId} toDisplayValue={v => v} />}
        {res.parentId && (
          <FieldDiff fieldName="parent" result={res.parentId} toDisplayValue={v => v} />
        )}
        {res.primary && (
          <FieldDiff
            fieldName="primary"
            result={res.primary}
            toDisplayValue={v => t(`diff.fields.primary.${v ? 'isOn' : 'isOff'}`)}
          />
        )}
        {res.rank && (
          <FieldDiff fieldName="rank" result={res.rank} toDisplayValue={v => v.toString()} />
        )}
        {res.relevanceId && (
          <FieldDiff fieldName="relevance" result={res.relevanceId} toDisplayValue={v => v} />
        )}
        {res.translations && <TranslationsDiff translations={res.translations} />}
        {res.supportedLanguages && (
          <ArrayDiffField
            fieldName="supportedLanguages"
            result={res.supportedLanguages}
            toDisplayValue={v => v}
          />
        )}
        {resourceTypeDiff && (
          <ArrayDiffField
            fieldName="resourceTypes"
            result={resourceTypeDiff}
            toDisplayValue={v => v}
          />
        )}
        {res.metadata?.grepCodes && (
          <ArrayDiffField
            fieldName="grepCodes"
            result={res.metadata.grepCodes}
            toDisplayValue={v => v}
          />
        )}
        {res.metadata?.visible && (
          <FieldDiff
            fieldName="visible"
            result={res.metadata.visible}
            toDisplayValue={v => t(`diff.fields.visible.${v ? 'isOn' : 'isOff'}`)}
          />
        )}
      </DetailsContent>
    </StyledDetails>
  );
};

export default NodeDiff;
