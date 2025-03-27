/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { RenderLeafProps } from "slate-react";
import { styled } from "@ndla/styled-system/jsx";

interface Props {
  attributes: RenderLeafProps["attributes"];
  children: ReactNode;
  placeholder: string;
}

const StyledSpan = styled("span", {
  base: {
    position: "relative",
    color: "text.subtle",
  },
});

const PlaceholderSpan = styled("span", {
  base: {
    position: "absolute",
    top: "0",
    left: "0",
    userSelect: "none",
    pointerEvents: "none",
  },
});

const WithPlaceHolder = ({ attributes, children, placeholder }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledSpan {...attributes}>
      <PlaceholderSpan contentEditable={false}>{t(placeholder)}</PlaceholderSpan>
      {children}
    </StyledSpan>
  );
};

export default WithPlaceHolder;
