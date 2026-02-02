/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Badge, ExpandableBox, ExpandableBoxSummary } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { NodeChild } from "@ndla/types-taxonomy";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import NodeIconType from "../../components/NodeIconType";
import {
  TAXONOMY_CUSTOM_FIELD_LANGUAGE,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT,
  TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID,
} from "../../constants";
import ArrayDiffField from "./ArrayDiffField";
import {
  diffField,
  DiffType,
  DiffTypeWithChildren,
  NodeTypeWithResources,
  removeType,
  RootDiffType,
} from "./diffUtils";
import FieldDiff from "./FieldDiff";
import TranslationsDiff from "./TranslationsDiff";
import { DiffTypePill } from "./TreeNode";

interface Props {
  node: RootDiffType | DiffTypeWithChildren;
  isRoot?: boolean;
}

const DiffContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    padding: "xsmall",
    border: "2px solid",
    borderColor: "stroke.default",
    borderRadius: "xsmall",
  },
});

const NodeInfoContainer = styled("div", {
  base: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

const StyledExpandableBoxSummary = styled(ExpandableBoxSummary, {
  base: {
    "& > *": {
      display: "inline-flex",
      justifyContent: "space-between",
      width: "97%",
    },
  },
});

const DetailsContent = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const NodeDiff = ({ node, isRoot }: Props) => {
  const [params] = useSearchParams();
  const { t } = useTranslation();

  const fieldFilter = params.get("fieldView") ?? "changed";

  const filteredNode =
    fieldFilter === "changed"
      ? removeType<Omit<NodeChild, "resources"> | Omit<NodeTypeWithResources, "resources">>(node, "NONE")
      : node;
  const metadata = filteredNode.metadata;
  const customFields = metadata?.customFields;

  // Don't show diff if changed is the only property to exist on the top-level node.
  if (Object.keys(filteredNode).length === 1) return null;
  return (
    <DiffContainer>
      <NodeInfoContainer>
        {!!isRoot && <Badge colorTheme="brand1">{t("diff.isRoot")}</Badge>}
        <NodeIconType node={node} />
      </NodeInfoContainer>
      <FieldDiff fieldName="name" result={node.name} toDisplayValue={(v) => v} />
      {!!filteredNode.id && <FieldDiff fieldName="id" result={filteredNode.id} toDisplayValue={(v) => v} />}
      {!!filteredNode.contentUri && (
        <FieldDiff fieldName="contentUri" result={filteredNode.contentUri} toDisplayValue={(v) => v} />
      )}
      {!!filteredNode.translations && <TranslationsDiff translations={filteredNode.translations} />}
      {!!filteredNode.supportedLanguages && (
        <ArrayDiffField
          fieldName="supportedLanguages"
          result={filteredNode.supportedLanguages}
          toDisplayValue={(value) => value}
        />
      )}
      {!!filteredNode.relevanceId && (
        <FieldDiff fieldName="relevance" result={filteredNode.relevanceId} toDisplayValue={(v) => v} />
      )}
      {"connectionId" in filteredNode && !!filteredNode.connectionId && (
        <FieldDiff fieldName="connectionId" result={filteredNode.connectionId} toDisplayValue={(v) => v} />
      )}
      {"isPrimary" in filteredNode && !!filteredNode.isPrimary && (
        <FieldDiff
          fieldName="isPrimary"
          result={filteredNode.isPrimary}
          toDisplayValue={(v) => t(`diff.fields.isPrimary.${v ? "isOn" : "isOff"}`)}
        />
      )}
      {"rank" in filteredNode && !!filteredNode.rank && (
        <FieldDiff fieldName="rank" result={filteredNode.rank} toDisplayValue={(v) => v.toString()} />
      )}
      {"parentId" in filteredNode && !!filteredNode.parentId && (
        <FieldDiff fieldName="parentId" result={filteredNode.parentId} toDisplayValue={(v) => v} />
      )}
      {!!metadata && (
        <>
          {!!metadata.visible && (
            <FieldDiff
              fieldName="visible"
              result={metadata.visible}
              toDisplayValue={(v) => t(`diff.fields.visible.${v ? "isOn" : "isOff"}`)}
            />
          )}
          {!!metadata.grepCodes && (
            <ArrayDiffField fieldName="grepCodes" result={metadata.grepCodes} toDisplayValue={(val) => val} />
          )}
          {!!customFields && (
            <>
              {!!customFields["topic-resources"] && (
                <FieldDiff
                  fieldName="topic-resources"
                  result={customFields["topic-resources"]}
                  toDisplayValue={(v) => v}
                />
              )}
              {!!customFields[TAXONOMY_CUSTOM_FIELD_LANGUAGE] && (
                <FieldDiff
                  fieldName="language"
                  result={customFields[TAXONOMY_CUSTOM_FIELD_LANGUAGE]}
                  toDisplayValue={(v) => v}
                />
              )}
              {!!customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] && (
                <FieldDiff
                  fieldName="subjectCategory"
                  result={customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY]}
                  toDisplayValue={(v) => v}
                />
              )}
              {!!customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] && (
                <FieldDiff
                  fieldName="explanationSubject"
                  result={customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT]}
                  toDisplayValue={(v) => v}
                />
              )}
              {!!customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID] && (
                <FieldDiff
                  fieldName="oldSubjectId"
                  result={customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_OLD_SUBJECT_ID]}
                  toDisplayValue={(v) => v}
                />
              )}
            </>
          )}
        </>
      )}
      {!!node.resources && <ResourceDiffList resources={node.resources} fieldFilter={fieldFilter} />}
    </DiffContainer>
  );
};

interface ResourceDiffListProps {
  resources?: DiffType<NodeChild>[];
  fieldFilter: string;
}

const ResourceDiffList = ({ resources, fieldFilter }: ResourceDiffListProps) => {
  const { t } = useTranslation();

  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <>
      <strong>{t("taxonomy.resources")}</strong>
      {resources.map((res, i) => (
        <ResourceDiff resource={res} fieldView={fieldFilter} key={`resource-${i}`} />
      ))}
    </>
  );
};

interface ResourceDiffProps {
  resource: DiffType<NodeChild>;
  fieldView: string;
}

const ResourceDiff = ({ resource, fieldView }: ResourceDiffProps) => {
  const { t } = useTranslation();
  const res = fieldView === "changed" ? removeType(resource, "NONE") : resource;
  const originalResourceTypes = (res.resourceTypes?.original?.map((rt) => rt.name) ?? []).sort();
  const otherResourceTypes = (res.resourceTypes?.other?.map((rt) => rt.name) ?? []).sort();
  const resourceTypeDiff = diffField(originalResourceTypes, otherResourceTypes, resource.changed.diffType);
  if (Object.keys(res).length === 1) {
    return null;
  }
  return (
    <ExpandableBox>
      <StyledExpandableBoxSummary>
        <div>
          {resource.name.other ?? resource.name.original}
          <DiffTypePill diffType={resource.changed.diffType} />
        </div>
      </StyledExpandableBoxSummary>
      <DetailsContent>
        {!!res.connectionId && (
          <FieldDiff fieldName="connectionId" result={res.connectionId} toDisplayValue={(v) => v} />
        )}
        {!!res.contentUri && <FieldDiff fieldName="contentUri" result={res.contentUri} toDisplayValue={(v) => v} />}
        {!!res.id && <FieldDiff fieldName="id" result={res.id} toDisplayValue={(v) => v} />}
        {!!res.name && <FieldDiff fieldName="name" result={res.name} toDisplayValue={(v) => v} />}
        {!!res.parentId && <FieldDiff fieldName="parentId" result={res.parentId} toDisplayValue={(v) => v} />}
        {!!res.isPrimary && (
          <FieldDiff
            fieldName="isPrimary"
            result={res.isPrimary}
            toDisplayValue={(v) => t(`diff.fields.isPrimary.${v ? "isOn" : "isOff"}`)}
          />
        )}
        {!!res.rank && <FieldDiff fieldName="rank" result={res.rank} toDisplayValue={(v) => v.toString()} />}
        {!!res.relevanceId && <FieldDiff fieldName="relevance" result={res.relevanceId} toDisplayValue={(v) => v} />}
        {!!res.translations && <TranslationsDiff translations={res.translations} />}
        {!!res.supportedLanguages && (
          <ArrayDiffField fieldName="supportedLanguages" result={res.supportedLanguages} toDisplayValue={(v) => v} />
        )}
        {!!resourceTypeDiff && (
          <ArrayDiffField fieldName="resourceTypes" result={resourceTypeDiff} toDisplayValue={(v) => v} />
        )}
        {!!res.metadata?.grepCodes && (
          <ArrayDiffField fieldName="grepCodes" result={res.metadata.grepCodes} toDisplayValue={(v) => v} />
        )}
        {!!res.metadata?.visible && (
          <FieldDiff
            fieldName="visible"
            result={res.metadata.visible}
            toDisplayValue={(v) => t(`diff.fields.visible.${v ? "isOn" : "isOff"}`)}
          />
        )}
      </DetailsContent>
    </ExpandableBox>
  );
};

export default NodeDiff;
