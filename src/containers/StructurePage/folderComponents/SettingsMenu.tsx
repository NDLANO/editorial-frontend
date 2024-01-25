/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { Root, Trigger, Close, Content, Portal } from '@radix-ui/react-popover';
import { CloseButton, IconButtonV2 } from '@ndla/button';
import { animations, colors, spacing, stackOrder } from '@ndla/core';
import { Settings } from '@ndla/icons/editor';
import { Node } from '@ndla/types-taxonomy';
import SettingsMenuDropdownType from './SettingsMenuDropdownType';
import Overlay from '../../../components/Overlay';
import RoundIcon from '../../../components/RoundIcon';
import { getNodeTypeFromNodeId } from '../../../modules/nodes/nodeUtil';

const TitleWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledIconButton = styled(IconButtonV2)`
  margin-left: ${spacing.xsmall};
  border: 1px solid ${colors.brand.greyDark};
  background-color: ${colors.white};
  width: 32px;
  padding: 0;
  height: 32px;

  &:focus,
  &:hover,
  &:focus-within {
    border: 1px solid ${colors.brand.greyDark};
    background-color: ${colors.brand.greyDark};
    svg {
      color: ${colors.white};
    }
  }
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
        <StyledIconButton
          variant="stripped"
          data-testid="settings-button"
          aria-label={t(`taxonomy.${nodeType.toLowerCase()}Settings`)}
          colorTheme="primary"
        >
          <Settings />
        </StyledIconButton>
      </Trigger>
      <Portal>
        <>
          <Content side="right" sideOffset={10} asChild>
            <StyledDivWrapper data-testid="settings-menu-modal">
              <Header>
                <TitleWrapper>
                  <RoundIcon icon={<Settings />} open />
                  <span>{t(`taxonomy.${nodeType.toLowerCase()}Settings`)}</span>
                </TitleWrapper>
                <Close asChild>
                  <CloseButton />
                </Close>
              </Header>
              <SettingsMenuDropdownType
                node={node}
                rootNodeId={rootNodeId}
                onCurrentNodeChanged={onCurrentNodeChanged}
                nodeChildren={nodeChildren}
              />
            </StyledDivWrapper>
          </Content>
          <Overlay modifiers={['zIndex']} />
        </>
      </Portal>
    </Root>
  );
};

export const StyledDivWrapper = styled.div`
  position: absolute;
  ${animations.fadeIn()}
  z-index: ${stackOrder.offsetDouble};
  padding: ${spacing.xsmall};
  width: 550px;
  background-color: ${colors.brand.greyLightest};
  box-shadow: 0 0 4px 0 rgba(78, 78, 78, 0.5);
`;

export default SettingsMenu;
