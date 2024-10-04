/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { InformationOutline } from "@ndla/icons/common";
import { AlertCircle } from "@ndla/icons/editor";
import { Node } from "@ndla/types-taxonomy";
import FieldHeader from "../../../components/Field/FieldHeader";
import { toStructure } from "../../../util/routeHelpers";

const StyledWarnIcon = styled(AlertCircle)`
  height: ${spacing.nsmall};
  width: ${spacing.nsmall};
  fill: ${colors.support.red};
`;

const TaxonomyInfoDiv = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const StyledId = styled.span<{ isVisible: boolean }>`
  font-style: ${(props) => !props.isVisible && "italic"};
  ${(props) => (!props.isVisible ? `color: ${colors.brand.grey}` : "")}
`;

interface Props {
  articleType: string;
  topics: Node[];
  resources: Node[];
}

const iconCSS = css`
  color: ${colors.brand.tertiary};

  &:hover,
  &:focus {
    color: ${colors.brand.primary};
  }
  width: ${spacing.normal};
  height: ${spacing.normal};
  padding: 0;
`;

export const HelpIcon = styled(InformationOutline)`
  ${iconCSS}
`;

const getOtherArticleType = (articleType: string): string => {
  return articleType === "standard" ? "topic-article" : "standard";
};

const LinkWrapper = ({ children, path }: { children: ReactNode; path?: string }) => {
  if (!path) {
    return <div>{children}</div>;
  }
  return <Link to={toStructure(path)}>{children}</Link>;
};

const TaxonomyConnectionErrors = ({ topics, resources, articleType }: Props) => {
  const { t } = useTranslation();

  const wrongConnections = useMemo(
    () => (articleType === "standard" ? topics : articleType === "topic-article" ? resources : []),
    [articleType, resources, topics],
  );

  if (wrongConnections.length < 1) return null;

  const wrongTooltip = t("taxonomy.info.wrongArticleType", {
    placedAs: t(`articleType.${getOtherArticleType(articleType)}`),
    isType: t(`articleType.${articleType}`),
  });

  return (
    <>
      <FieldHeader title={t("taxonomy.info.wrongConnections")} subTitle={t("taxonomy.info.wrongConnectionsSubTitle")}>
        <div>
          <HelpIcon
            aria-label={t("taxonomy.info.canBeFixedInDatabase")}
            title={t("taxonomy.info.canBeFixedInDatabase")}
          />
        </div>
      </FieldHeader>
      {wrongConnections.map((taxonomyElement) => {
        const visibility = taxonomyElement.metadata ? taxonomyElement.metadata.visible : true;
        const errorElement = ` - ${taxonomyElement.id} (${taxonomyElement.name})`;

        return (
          <TaxonomyInfoDiv key={taxonomyElement.id}>
            <LinkWrapper path={taxonomyElement.path}>
              <StyledId isVisible={visibility}>
                <StyledWarnIcon aria-label={wrongTooltip} title={wrongTooltip} />
                {errorElement}
              </StyledId>
            </LinkWrapper>
          </TaxonomyInfoDiv>
        );
      })}
    </>
  );
};

export default TaxonomyConnectionErrors;
