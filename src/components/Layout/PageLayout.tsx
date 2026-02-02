/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useComponentSize } from "@ndla/hooks";
import { styled } from "@ndla/styled-system/jsx";
import { JsxStyleProps } from "@ndla/styled-system/types";
import { ComponentPropsWithRef, CSSProperties, useMemo } from "react";

const StyledPageLayout = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    // The minimum page height should be 100vh - masthead height
    minHeight: "calc(100vh - (var(--masthead-height, 72px)))",
  },
});

interface Props extends ComponentPropsWithRef<"div">, JsxStyleProps {}

export const PageLayout = (props: Props) => {
  const { height } = useComponentSize("masthead");
  const mastheadHeightVar = useMemo(() => ({ "--masthead-height": `${height}px` }) as CSSProperties, [height]);
  return <StyledPageLayout {...props} style={mastheadHeightVar} />;
};
