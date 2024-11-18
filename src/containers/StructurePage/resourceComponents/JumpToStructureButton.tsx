/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const StyledButton = styled(Button, {
  base: {
    desktop: {
      display: "none",
    },
  },
});

interface Props {
  nodeId: string;
}

const JumpToStructureButton = ({ nodeId }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledButton
      size="small"
      variant="secondary"
      onClick={() => document.getElementById(nodeId)?.scrollIntoView({ block: "center" })}
    >
      {t("taxonomy.jumpToStructure")}
    </StyledButton>
  );
};

export default JumpToStructureButton;
