/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Heading, Text } from "@ndla/primitives";
import { css } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { ElementType } from "react";

const ComponentWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
  },
});

const TitleWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "xsmall",
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

const StyledIconWrapper = styled("div", {
  base: {
    width: "xxlarge",
    height: "xxlarge",
    flexShrink: "0",
    backgroundColor: "surface.action",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const iconCss = css.raw({
  color: "text.onAction",
});

interface Props {
  title: string;
  description: string;
  Icon: ElementType;
}

const TableTitle = ({ title, description, Icon }: Props) => {
  return (
    <ComponentWrapper>
      <StyledIconWrapper>
        <Icon css={iconCss} />
      </StyledIconWrapper>
      <TextWrapper>
        <TitleWrapper>
          <Heading textStyle="title.medium" asChild consumeCss>
            <h2>{title}</h2>
          </Heading>
        </TitleWrapper>
        <Text textStyle="body.small">{description}</Text>
      </TextWrapper>
    </ComponentWrapper>
  );
};

export default TableTitle;
