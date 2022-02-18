/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { shadows, colors, spacing, animations } from '@ndla/core';
import { Settings } from '@ndla/icons/editor';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { getNodeTypeFromNodeId } from '../../../modules/nodes/nodeUtil';
import RoundIcon from '../../../components/RoundIcon';
import Overlay from '../../../components/Overlay';
import CrossButton from '../../../components/CrossButton';
import { NodeType } from '../../../modules/nodes/nodeApiTypes';
import SettingsMenuDropdownType from './SettingsMenuDropdownType';

const SettingsMenuWrapper = styled('div')`
  position: relative;
  display: flex;

  > button {
    outline: none;
  }
`;

interface Props {
  node: NodeType;
  rootNodeId: string;
  structure: NodeType[];
}

const SettingsMenu = ({ node, rootNodeId, structure }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const nodeType = getNodeTypeFromNodeId(node.id);

  const toggleOpenMenu = () => {
    setOpen(!open);
  };

  return (
    <SettingsMenuWrapper>
      <Button onClick={toggleOpenMenu} data-cy={`settings-button`} stripped>
        <RoundIcon icon={<Settings />} margin open={open} />
      </Button>
      {open && (
        <>
          <Overlay modifiers={['zIndex']} onExit={toggleOpenMenu} />

          <StyledDivWrapper>
            <div className="header">
              <RoundIcon icon={<Settings />} open />
              <span
                css={css`
                  margin-left: calc(${spacing.small} / 2);
                `}>
                {t(`taxonomy.${nodeType.toLowerCase()}Settings`)}
              </span>
              <CrossButton stripped css={closeButtonStyle} onClick={toggleOpenMenu} />
            </div>
            <SettingsMenuDropdownType
              node={node}
              onClose={toggleOpenMenu}
              rootNodeId={rootNodeId}
              structure={structure}
            />
          </StyledDivWrapper>
        </>
      )}
    </SettingsMenuWrapper>
  );
};

const closeButtonStyle = css`
  color: ${colors.brand.grey};
  margin-left: auto;
`;

export const StyledDivWrapper = styled('div')`
   position: absolute;
   ${animations.fadeIn()}
   box-shadow: ${shadows.levitate1};
   z-index: 2;
   top: -1px;
   padding: calc(${spacing.small} / 2);
   width: 550px;
   background-color: ${colors.brand.greyLightest};
   box-shadow: 0 0 4px 0 rgba(78, 78, 78, 0.5);
 
   & .header {
     display: flex;
     align-items: center;
   }
 `;

export default SettingsMenu;
