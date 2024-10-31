/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { mq, breakpoints } from "@ndla/core";

export const StyledButton = styled(ButtonV2)`
  ${mq.range({ from: breakpoints.desktop })} {
    display: none;
  }
`;

interface Props {
  nodeId: string;
}

const JumpToStructureButton = ({ nodeId }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledButton
      size="small"
      variant="outline"
      onClick={() => document.getElementById(nodeId)?.scrollIntoView({ block: "center" })}
    >
      {t("taxonomy.jumpToStructure")}
    </StyledButton>
  );
};

export default JumpToStructureButton;
