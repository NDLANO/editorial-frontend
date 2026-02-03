/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { JsxStyleProps } from "@ndla/styled-system/types";
import { ComponentPropsWithoutRef } from "react";

const LinksContainer = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
  },
});

export const MastheadLinks = (props: ComponentPropsWithoutRef<"div"> & JsxStyleProps) => {
  return (
    <LinksContainer {...props}>
      <SafeLink target="_blank" to="https://edndla.zendesk.com/hc/no">
        Zendesk
      </SafeLink>
      <SafeLink target="_blank" to="https://kvalitet.ndla.no/">
        Kvalitaisen
      </SafeLink>
    </LinksContainer>
  );
};
