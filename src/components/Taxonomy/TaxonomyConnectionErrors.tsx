/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { InformationLine } from "@ndla/icons";
import { MessageBox, Text, UnOrderedList } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { partition } from "@ndla/util";
import { routes } from "../../util/routeHelpers";

interface Props {
  nodes: Node[];
  type: "resource" | "topic";
}

const StyledSafeLink = styled(SafeLink, {
  variants: {
    visible: {
      false: {
        fontStyle: "italic",
        color: "text.subtle",
        textDecoration: "underline",
        _hover: {
          textDecoration: "none",
        },
      },
    },
  },
});

const StyledText = styled(Text, {
  variants: {
    visible: {
      false: {
        fontStyle: "italic",
        color: "text.subtle",
      },
    },
  },
});

const StyledMessageBox = styled(MessageBox, {
  base: {
    flexDirection: "column",
  },
});

const StyledWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

const SafeLinkWrapper = ({ children, visible, path }: { children: ReactNode; visible: boolean; path?: string }) => {
  if (!path) {
    return <StyledText visible={visible}>{children}</StyledText>;
  }
  return (
    <StyledSafeLink to={routes.structure(path)} visible={visible}>
      {children}
    </StyledSafeLink>
  );
};

export const TaxonomyConnectionErrors = ({ nodes, type }: Props) => {
  const { t } = useTranslation();

  const [resources, topics] = partition(nodes, (node) => node.nodeType === "RESOURCE");

  const wrongConnections = type === "resource" ? topics : resources;

  if (!wrongConnections.length) return null;

  const title = t("taxonomy.info.wrongResourceType", {
    placedAs: t(`taxonomyResourceType.${type === "resource" ? "topic" : "resource"}`),
    isType: t(`taxonomyResourceType.${type}`),
  });

  return (
    <StyledMessageBox variant="error">
      <StyledWrapper>
        <InformationLine />
        <Text textStyle="label.medium" fontWeight="bold">
          {t("taxonomy.info.wrongConnections")}
        </Text>
      </StyledWrapper>
      <UnOrderedList>
        {wrongConnections.map((taxonomyElement) => {
          const visibility = taxonomyElement.metadata.visible ?? true;
          return (
            <li key={taxonomyElement.id}>
              <Text>{title}</Text>
              <SafeLinkWrapper visible={visibility} path={taxonomyElement.path}>
                {`${taxonomyElement.id} (${taxonomyElement.name})`}
              </SafeLinkWrapper>
            </li>
          );
        })}
      </UnOrderedList>
    </StyledMessageBox>
  );
};
