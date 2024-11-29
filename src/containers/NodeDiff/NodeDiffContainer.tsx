/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isEqual from "lodash/isEqual";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing, fonts } from "@ndla/core";
import { ArrowRightShortLine } from "@ndla/icons/common";
import { MessageBox, Skeleton } from "@ndla/primitives";
import { NodeChild } from "@ndla/types-taxonomy";
import { diffTrees, DiffType, DiffTypeWithChildren, RootDiffType } from "./diffUtils";
import NodeDiff from "./NodeDiff";
import { RootNode } from "./TreeNode";
import { useNodeTree } from "../../modules/nodes/nodeQueries";

interface Props {
  originalHash: string;
  nodeId: string;
  otherHash: string;
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

interface NodeOptions {
  nodeView: string | null;
  fieldView: string | null;
}

const StyledBreadCrumb = styled("div")`
  flex-grow: 1;
  flex-direction: row;
  font-style: italic;
  font-size: ${fonts.sizes(16)};
`;

const filterNodes = <T,>(diff: DiffType<T>[], options: NodeOptions): DiffType<T>[] => {
  const afterNodeOption =
    options.nodeView !== "changed"
      ? diff
      : diff.filter((d) => d.changed.diffType !== "NONE" || d.childrenChanged?.diffType !== "NONE");

  return afterNodeOption;
};

const NodeDiffcontainer = ({ originalHash, otherHash, nodeId }: Props) => {
  const [params] = useSearchParams();
  const view = params.get("view") === "flat" ? "flat" : "tree";
  const { t, i18n } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<RootDiffType | DiffTypeWithChildren | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

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
      //@ts-expect-error - this is a network error
      retry: (_, err) => err.status !== 404,
    },
  );
  const otherQuery = useNodeTree(
    {
      id: nodeId,
      language: i18n.language,
      taxonomyVersion: otherHash,
    },
    {
      enabled: !!nodeId && !!otherHash,
      //@ts-expect-error - this is a network error
      retry: (_, err) => err.status !== 404,
    },
  );

  useEffect(() => {
    if (defaultQuery.isLoading || otherQuery.isLoading || (defaultQuery.data && otherQuery.data)) {
      setError(undefined);
      return;
    }
    if (!defaultQuery.data && !otherQuery.data) {
      setError("diff.error.doesNotExist");
    } else if (!defaultQuery.data) {
      setError("diff.error.onlyExistsInOther");
    } else {
      setError("diff.error.onlyExistsInOriginal");
    }
  }, [defaultQuery.data, defaultQuery.isLoading, otherQuery.data, otherQuery.isLoading]);

  const shownNodes = Math.max(
    (defaultQuery.data?.children.length ?? 0) + 1,
    (otherQuery.data?.children.length ?? 0) + 1,
  );

  if (defaultQuery.isLoading || otherQuery.isLoading) {
    return (
      <div>
        {new Array(shownNodes).fill(0).map((_, i) => (
          <Skeleton key={i} css={{ width: "100%", height: "xxlarge", marginBlockEnd: "small" }} />
        ))}
      </div>
    );
  }

  const diff = diffTrees(defaultQuery.data!, otherQuery.data!, view);
  const children: DiffType<NodeChild>[] = diff.children;

  const nodes = filterNodes(children, {
    nodeView: params.get("nodeView") ?? "changed",
    fieldView: params.get("fieldView"),
  });

  const equal =
    (defaultQuery.data || otherQuery.data) &&
    diff.root.changed.diffType === "NONE" &&
    diff.root.resourcesChanged?.diffType === "NONE" &&
    diff.root.childrenChanged?.diffType === "NONE";
  return (
    <DiffContainer id="diffContainer">
      <StyledBreadCrumb>
        {defaultQuery.data?.root?.breadcrumbs?.map((path, index, arr) => {
          return (
            <Fragment key={`${path}_${index}`}>
              {path}
              {index + 1 !== arr.length && <ArrowRightShortLine />}
            </Fragment>
          );
        })}
      </StyledBreadCrumb>
      {!!equal && <MessageBox>{t("diff.equalNodes")}</MessageBox>}
      {!!error && <MessageBox variant="error">{t(error)}</MessageBox>}
      {view === "tree" && <RootNode tree={diff} onNodeSelected={setSelectedNode} selectedNode={selectedNode} />}
      {view === "tree" && !!selectedNode && (
        <NodeDiff node={selectedNode} isRoot={isEqual(selectedNode.id, diff.root.id)} />
      )}
      {view === "flat" && (
        <StyledNodeList>
          <NodeDiff node={diff.root} key={diff.root.id.original ?? diff.root.id.other!} isRoot={true} />
          {nodes.map((node) => (
            <NodeDiff node={node} key={node.id.original ?? node.id.other} />
          ))}
        </StyledNodeList>
      )}
    </DiffContainer>
  );
};

export default NodeDiffcontainer;
