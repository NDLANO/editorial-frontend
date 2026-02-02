/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Button, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeChild } from "@ndla/types-taxonomy";
import { useTranslation } from "react-i18next";
import { NodeChildWithChildren } from "../../../modules/nodes/nodeApiTypes";
import SettingsMenu from "./SettingsMenu";

const StyledButton = styled(Button, {
  base: {
    desktop: { display: "none" },
  },
});
const StyledFolderWrapper = styled("div", {
  base: {
    display: "flex",
    flexGrow: "1",
    justifyContent: "flex-end",
    gap: "3xsmall",
  },
});

const Wrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "3xsmall",
  },
});

interface Props {
  node: NodeChild | Node;
  jumpToResources?: () => void;
  isMainActive?: boolean;
  resourcesLoading?: boolean;
  rootNodeId: string;
  onCurrentNodeChanged: (node?: Node) => void;
  nodeChildren: NodeChildWithChildren[];
  isLoading: boolean;
}

const NodeControls = ({
  node,
  jumpToResources,
  isMainActive,
  resourcesLoading,
  rootNodeId,
  onCurrentNodeChanged,
  nodeChildren,
  isLoading,
}: Props) => {
  const { t } = useTranslation();

  const showJumpToResources = isMainActive && (node.id.includes("topic") || node.id.includes("subject"));

  return (
    <StyledFolderWrapper data-testid="folderWrapper">
      {!!isMainActive && (
        <Wrapper>
          {isLoading ? <Spinner size="small" /> : null}
          <SettingsMenu
            node={node}
            rootNodeId={rootNodeId}
            onCurrentNodeChanged={onCurrentNodeChanged}
            nodeChildren={nodeChildren}
          />
        </Wrapper>
      )}
      {!!showJumpToResources && (
        <StyledButton variant="secondary" size="small" disabled={resourcesLoading} onClick={() => jumpToResources?.()}>
          {t("taxonomy.jumpToResources")}
          {!!resourcesLoading && <Spinner size="small" />}
        </StyledButton>
      )}
    </StyledFolderWrapper>
  );
};

export default NodeControls;
