/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Fragment, useMemo } from "react";
import styled from "@emotion/styled";
import { colors, fonts } from "@ndla/core";
import { ArrowRightShortLine } from "@ndla/icons/common";
import { SafeLink } from "@ndla/safelink";
import { Node } from "@ndla/types-taxonomy";
import { MinimalNodeChild } from "../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomy";

interface Props {
  error?: boolean;
  node: Node | MinimalNodeChild;
}

const StyledBreadCrumb = styled.div`
  flex-grow: 1;
  span:last-of-type {
    font-weight: ${fonts.weight.semibold};
  }
`;

const StyledLink = styled(SafeLink)`
  color: ${colors.brand.primary};
  &[data-visible="false"] {
    font-style: italic;
    color: ${colors.brand.grey};
  }
`;

const StyledSpan = styled.span`
  white-space: "nowrap";
`;

const Breadcrumb = ({ node, error }: Props) => {
  let url = "/structure";

  const crumbs = useMemo(() => {
    const ids = node.context?.parentIds ?? [];
    if (node.nodeType === "TOPIC") {
      ids.push(node.id);
    }
    return (
      ids.map((path, index) => ({
        id: path,
        name: node.breadcrumbs[index],
      })) ?? []
    );
  }, [node.breadcrumbs, node.context, node.id, node.nodeType]);

  return (
    <StyledBreadCrumb>
      {crumbs.map((crumb, index) => {
        url = `${url}/${crumb.id}`;
        return (
          <Fragment key={`${crumb.id}_${index}`}>
            <StyledSpan>
              <StyledLink data-visible={error ? true : node.metadata.visible} to={url}>
                {crumb.name}
              </StyledLink>
            </StyledSpan>
            {index + 1 !== crumbs.length && <ArrowRightShortLine />}
          </Fragment>
        );
      })}
    </StyledBreadCrumb>
  );
};

export default Breadcrumb;
