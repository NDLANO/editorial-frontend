/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { InformationLine } from "@ndla/icons";
import { MessageBox, Text, UnOrderedList } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { routes } from "../../../util/routeHelpers";

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

interface Props {
  articleType: string;
  topics: Node[];
  resources: Node[];
}

const getOtherArticleType = (articleType: string): string => {
  return articleType === "standard" ? "topic-article" : "standard";
};

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

const TaxonomyConnectionErrors = ({ topics, resources, articleType }: Props) => {
  const { t } = useTranslation();

  const wrongConnections = useMemo(
    () => (articleType === "standard" ? topics : articleType === "topic-article" ? resources : []),
    [articleType, resources, topics],
  );

  if (!wrongConnections.length) return null;

  const title = t("taxonomy.info.wrongArticleType", {
    placedAs: t(`articleType.${getOtherArticleType(articleType)}`),
    isType: t(`articleType.${articleType}`),
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

export default TaxonomyConnectionErrors;
