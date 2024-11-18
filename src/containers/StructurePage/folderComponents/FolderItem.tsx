/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Portal } from "@ark-ui/react";
import { AddLine } from "@ndla/icons/action";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
  Spinner,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import SettingsMenu from "./SettingsMenu";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { getNodeTypeFromNodeId } from "../../../modules/nodes/nodeUtil";
import AddNodeModalContent from "../AddNodeModalContent";
import PlannedResourceForm from "../plannedResource/PlannedResourceForm";

const StyledButton = styled(Button, {
  base: {
    desktop: { display: "none" },
  },
});
const StyledFolderWrapper = styled("div", {
  base: {
    display: "flex",
    flexGrow: "1",
    justifyContent: "space-between",
    gap: "3xsmall",
  },
});

const ControlButtonsWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "3xsmall",
  },
});

interface Props {
  node: Node;
  jumpToResources?: () => void;
  isMainActive?: boolean;
  resourcesLoading?: boolean;
  rootNodeId: string;
  onCurrentNodeChanged: (node?: Node) => void;
  nodeChildren: Node[];
  addChildTooltip?: string;
}

const FolderItem = ({
  node,
  jumpToResources,
  isMainActive,
  resourcesLoading,
  rootNodeId,
  onCurrentNodeChanged,
  nodeChildren,
  addChildTooltip,
}: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const close = useCallback(() => setOpen(false), [setOpen]);
  const showJumpToResources = isMainActive && (node.id.includes("topic") || node.id.includes("subject"));

  return (
    <StyledFolderWrapper data-testid="folderWrapper">
      {isMainActive && (
        <ControlButtonsWrapper>
          <SettingsMenu
            node={node}
            rootNodeId={rootNodeId}
            onCurrentNodeChanged={onCurrentNodeChanged}
            nodeChildren={nodeChildren}
          />
          {addChildTooltip && (
            <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)} position="top">
              <DialogTrigger asChild>
                <IconButton size="small" variant="tertiary" title={addChildTooltip} aria-label={addChildTooltip}>
                  <AddLine />
                </IconButton>
              </DialogTrigger>
              <Portal>
                {node.id.includes("topic") || node.id.includes("subject") ? (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("taxonomy.addTopicHeader")}</DialogTitle>
                      <DialogCloseButton />
                    </DialogHeader>
                    <DialogBody>
                      <PlannedResourceForm node={node} articleType="topic-article" onClose={close} />
                    </DialogBody>
                  </DialogContent>
                ) : (
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {t("taxonomy.addNode", {
                          nodeType: t(`taxonomy.nodeType.${node.nodeType}`),
                        })}
                      </DialogTitle>
                      <DialogCloseButton />
                    </DialogHeader>
                    <DialogBody>
                      <AddNodeModalContent
                        parentNode={node}
                        rootId={rootNodeId}
                        nodeType={getNodeTypeFromNodeId(rootNodeId)}
                        onClose={close}
                      />
                    </DialogBody>
                  </DialogContent>
                )}
              </Portal>
            </DialogRoot>
          )}
        </ControlButtonsWrapper>
      )}
      {showJumpToResources && (
        <StyledButton variant="secondary" size="small" disabled={resourcesLoading} onClick={() => jumpToResources?.()}>
          {t("taxonomy.jumpToResources")}
          {!!resourcesLoading && <Spinner size="small" />}
        </StyledButton>
      )}
    </StyledFolderWrapper>
  );
};

export default FolderItem;
