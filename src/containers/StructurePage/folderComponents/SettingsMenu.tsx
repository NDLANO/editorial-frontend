/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { Root, Trigger, Close, Content, Portal } from "@radix-ui/react-popover";
import { animations, colors, spacing, stackOrder } from "@ndla/core";
import { CloseLine } from "@ndla/icons/action";
import { Settings } from "@ndla/icons/editor";
import { IconButton } from "@ndla/primitives";
import { Node } from "@ndla/types-taxonomy";
import SettingsMenuDropdownType from "./SettingsMenuDropdownType";
import Overlay from "../../../components/Overlay";
import RoundIcon from "../../../components/RoundIcon";
import { getNodeTypeFromNodeId } from "../../../modules/nodes/nodeUtil";

const TitleWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledContent = styled(Content)`
  z-index: ${stackOrder.dropdown};
`;

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
    <Root>
      <Trigger asChild>
        <IconButton
          variant="secondary"
          size="small"
          data-testid="settings-button"
          aria-label={t(`taxonomy.${nodeType.toLowerCase()}Settings`)}
        >
          <Settings />
        </IconButton>
      </Trigger>
      <Portal>
        <>
          <StyledContent side="right" sideOffset={10} asChild>
            <StyledDivWrapper data-testid="settings-menu-modal">
              <Header>
                <TitleWrapper>
                  <RoundIcon icon={<Settings />} open />
                  <span>{t(`taxonomy.${nodeType.toLowerCase()}Settings`)}</span>
                </TitleWrapper>
                <Close asChild>
                  <IconButton aria-label={t("close")} variant="clear" title={t("close")}>
                    <CloseLine />
                  </IconButton>
                </Close>
              </Header>
              <SettingsMenuDropdownType
                node={node}
                rootNodeId={rootNodeId}
                onCurrentNodeChanged={onCurrentNodeChanged}
                nodeChildren={nodeChildren}
              />
            </StyledDivWrapper>
          </StyledContent>
          <Overlay modifiers={["zIndex"]} />
        </>
      </Portal>
    </Root>
  );
};

export const StyledDivWrapper = styled.div`
  position: absolute;
  ${animations.fadeIn()}
  padding: ${spacing.xsmall};
  width: 550px;
  background-color: ${colors.brand.greyLightest};
  box-shadow: 0 0 4px 0 rgba(78, 78, 78, 0.5);
`;

export default SettingsMenu;
