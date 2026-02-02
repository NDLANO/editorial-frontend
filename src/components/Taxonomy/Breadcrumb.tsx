/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ArrowRightShortLine } from "@ndla/icons";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { useMemo } from "react";
import { MinimalNodeChild } from "./types";

const StyledSafeLink = styled(SafeLink, {
  base: {
    color: "text.default",
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
    },
  },
  variants: {
    visible: {
      false: {
        fontStyle: "italic",
        color: "text.subtle",
      },
    },
  },
});

const StyledList = styled("ol", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    listStyle: "none",
  },
});

const StyledListItem = styled("li", {
  base: {
    _lastOfType: {
      fontWeight: "semibold",
    },
  },
});

interface Props {
  node: Node | MinimalNodeChild;
}

const Breadcrumb = ({ node }: Props) => {
  let url = "/structure";

  const crumbs = useMemo(() => {
    const ids = node.context?.parentIds ?? [];
    if (node.nodeType === "TOPIC" || node.nodeType === "SUBJECT") {
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
    <StyledList>
      {crumbs.map((crumb, index) => {
        url = `${url}/${crumb.id}`;
        return (
          <StyledListItem key={`${crumb.id}_${index}`}>
            <StyledSafeLink visible={!!node.metadata.visible} to={url}>
              {crumb.name}
            </StyledSafeLink>
            {index + 1 !== crumbs.length && <ArrowRightShortLine />}
          </StyledListItem>
        );
      })}
    </StyledList>
  );
};

export default Breadcrumb;
