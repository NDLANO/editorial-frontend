/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Settings } from "@ndla/icons/editor";
import {
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
  DialogBody,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import SettingsMenuDropdownType from "./SettingsMenuDropdownType";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { getNodeTypeFromNodeId } from "../../../modules/nodes/nodeUtil";

const StyledDialogBody = styled(DialogBody, {
  base: {
    alignItems: "flex-start",
  },
});

interface Props {
  node: Node;
  rootNodeId: string;
  nodeChildren: Node[];
  onCurrentNodeChanged: (node?: Node) => void;
}

const SettingsMenu = ({ node, rootNodeId, onCurrentNodeChanged, nodeChildren }: Props) => {
  const { t } = useTranslation();
  const nodeType = getNodeTypeFromNodeId(node.id);

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <IconButton
          variant="secondary"
          size="small"
          data-testid="settings-button"
          aria-label={t(`taxonomy.${nodeType.toLowerCase()}Settings`)}
        >
          <Settings />
        </IconButton>
      </DialogTrigger>
      <DialogContent data-testid="settings-menu-dialog">
        <DialogHeader>
          <DialogTitle>{t(`taxonomy.${nodeType.toLowerCase()}Settings`)}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <StyledDialogBody>
          <SettingsMenuDropdownType
            node={node}
            rootNodeId={rootNodeId}
            onCurrentNodeChanged={onCurrentNodeChanged}
            nodeChildren={nodeChildren}
          />
        </StyledDialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default SettingsMenu;
