/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { colors, fonts, mq, breakpoints } from "@ndla/core";
import { constants } from "@ndla/ui";
import { toEditArticle, toLearningpathFull } from "../../../util/routeHelpers";

const { contentTypes } = constants;

type FontSizeType = "small" | "medium";

const StyledH1 = styled.h1<{ isVisible?: boolean; size?: FontSizeType }>`
  font-style: ${(props) => !props.isVisible && "italic"};
  color: ${(props) => (!props.isVisible ? colors.brand.grey : colors.brand.primary)};
  text-transform: none;
  letter-spacing: 0;
  margin: 0;
  display: inline;
  ${(props) => fonts.sizes(props.size === "small" ? "16px" : "18px")};
  font-weight: ${fonts.weight.normal};

  ${mq.range({ from: breakpoints.desktop })} {
    ${(props) => fonts.sizes(props.size === "small" ? "18px" : "20px")};
  }
`;

interface Props {
  contentType?: string;
  contentUri?: string;
  name?: string;
  isVisible?: boolean;
  size?: FontSizeType;
}

const ResourceItemLink = ({ contentType, contentUri, name, isVisible = true, size = "medium" }: Props) => {
  const { i18n } = useTranslation();
  const linkTo = contentUri && contentUri.split(":").pop();

  if (linkTo) {
    if (contentType === contentTypes.LEARNING_PATH) {
      const linkProps = {
        href: toLearningpathFull(parseInt(linkTo), i18n.language),
        target: "_blank",
        rel: "noopener noreferrer",
      };
      return (
        <StyledH1 isVisible={isVisible} size={size}>
          <a {...linkProps}>{name}</a>
        </StyledH1>
      );
    }
    return (
      <Link to={toEditArticle(parseInt(linkTo), contentType!)} target="_blank" rel="noopener noreferrer">
        <StyledH1 isVisible={isVisible} size={size}>
          {name}
        </StyledH1>
      </Link>
    );
  }
  return (
    <StyledH1 isVisible={isVisible} size={size}>
      {name}
    </StyledH1>
  );
};

export default ResourceItemLink;
