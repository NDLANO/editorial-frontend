/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ErrorWarningFill, InformationLine } from "@ndla/icons/common";
import { Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { routes } from "../../../util/routeHelpers";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "3xsmall",
  },
});

const StyledErrorWarningFill = styled(ErrorWarningFill, {
  base: {
    fill: "surface.danger",
  },
});

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
    <Wrapper>
      <TextWrapper>
        <Text textStyle="label.medium" fontWeight="bold">
          {t("taxonomy.info.wrongConnections")}
        </Text>
        <InformationLine
          aria-label={t("taxonomy.info.canBeFixedInDatabase")}
          title={t("taxonomy.info.canBeFixedInDatabase")}
        />
      </TextWrapper>
      <Text>{t("taxonomy.info.wrongConnectionsSubTitle")}</Text>
      <StyledList>
        {wrongConnections.map((taxonomyElement) => {
          const visibility = taxonomyElement.metadata.visible ?? true;

          return (
            <li key={taxonomyElement.id}>
              <SafeLinkWrapper visible={visibility} path={taxonomyElement.path}>
                <StyledErrorWarningFill aria-label={title} title={title} />
                {` - ${taxonomyElement.id} (${taxonomyElement.name})`}
              </SafeLinkWrapper>
            </li>
          );
        })}
      </StyledList>
    </Wrapper>
  );
};

export default TaxonomyConnectionErrors;
