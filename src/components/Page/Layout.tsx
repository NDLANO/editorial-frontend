/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useComponentSize } from "@ndla/hooks";
import { styled } from "@ndla/styled-system/jsx";
import { Footer } from "../Footer";

const PageLayout = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    // The minimum page height should be 100vh - masthead height
    minHeight: "calc(100vh - (var(--masthead-height, 72px)))",
  },
});

export const Layout = () => {
  const { height } = useComponentSize("masthead");
  const mastheadHeightVar = useMemo(() => ({ "--masthead-height": `${height}px` }) as CSSProperties, [height]);
  return (
    <>
      <PageLayout style={mastheadHeightVar}>
        <Outlet />
      </PageLayout>
      <Footer />
    </>
  );
};
