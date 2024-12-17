/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";
import { DiffResultType } from "./diffUtils";

interface Props {
  type: DiffResultType;
}

const typeToSeparatorMap: Record<DiffResultType, string> = {
  ADDED: "+",
  DELETED: "-",
  MODIFIED: "~",
  NONE: " ",
};

const StyledSpan = styled("span", {
  base: {
    width: "1ch",
  },
});

const DiffSeparator = ({ type }: Props) => {
  return <StyledSpan>{typeToSeparatorMap[type] ?? " "}</StyledSpan>;
};

export default DiffSeparator;
