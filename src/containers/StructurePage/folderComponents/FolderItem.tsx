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
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing, fonts, mq, breakpoints } from "@ndla/core";
import { AddLine } from "@ndla/icons/action";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
} from "@ndla/primitives";
import { Node } from "@ndla/types-taxonomy";
import SettingsMenu from "./SettingsMenu";
import { Row } from "../../../components";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import Spinner from "../../../components/Spinner";
import { getNodeTypeFromNodeId } from "../../../modules/nodes/nodeUtil";
import AddNodeModalContent from "../AddNodeModalContent";
import PlannedResourceForm from "../plannedResource/PlannedResourceForm";

const StyledResourceButton = styled(ButtonV2)`
  min-height: unset;
  margin: 3px ${spacing.xsmall} 3px auto;
  ${fonts.sizes(14, 1.1)};

  ${mq.range({ from: breakpoints.desktop })} {
    display: none;
  }
`;

const StyledFolderWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  gap: ${spacing.small};
`;

const ControlButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xxsmall};
`;

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
        <StyledResourceButton variant="outline" disabled={resourcesLoading} onClick={() => jumpToResources?.()}>
          <Row>
            {t("taxonomy.jumpToResources")}
            {!!resourcesLoading && <Spinner appearance="small" />}
          </Row>
        </StyledResourceButton>
      )}
    </StyledFolderWrapper>
  );
};

export default FolderItem;
