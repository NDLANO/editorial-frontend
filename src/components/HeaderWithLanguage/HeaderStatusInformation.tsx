/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ErrorWarningFill } from "@ndla/icons";
import { styled } from "@ndla/styled-system/jsx";
import { LearningPathSummaryV2DTO } from "@ndla/types-backend/learningpath-api";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { Node } from "@ndla/types-taxonomy";
import EmbedConnection from "./EmbedInformation/EmbedConnection";
import HeaderFavoriteStatus from "./HeaderFavoriteStatus";
import LearningpathConnection from "./LearningpathConnection";
import { LinkConnections } from "./LinkConnections";
import { ResourcePublishedLink } from "./ResourcePublishedLink";
import { ResourceStatus } from "./ResourceStatus";
import {
  FormHeaderResponsibleInfo,
  FormHeaderStatusInfo,
  FormHeaderStatusWrapper,
} from "../../containers/FormHeader/FormHeader";

interface Props {
  statusText?: string;
  isNewLanguage?: boolean;
  published: boolean;
  type?: string;
  id?: number;
  expirationDate?: string;
  responsibleName?: string;
  slug?: string;
  favoriteCount?: number;
  nodes: Node[] | undefined;
}

const StyledErrorWarningFill = styled(ErrorWarningFill, {
  base: {
    fill: "icon.subtle",
  },
});

const HeaderStatusInformation = ({
  statusText,
  isNewLanguage,
  published,
  nodes,
  type,
  id,
  expirationDate,
  responsibleName,
  slug,
  favoriteCount,
}: Props) => {
  const { t } = useTranslation();
  const [learningpaths, setLearningpaths] = useState<LearningPathSummaryV2DTO[]>([]);
  const [articles, setArticles] = useState<MultiSearchSummaryDTO[]>([]);

  const hideFavoritedIcon = type === "frontpage-article";
  return (
    <FormHeaderStatusWrapper>
      {type === "standard" || type === "topic-article" ? (
        <>
          <EmbedConnection id={id} type="article" articles={articles} setArticles={setArticles} />
          <LearningpathConnection id={id} learningpaths={learningpaths} setLearningpaths={setLearningpaths} />
          <LinkConnections nodes={nodes} />
          {!!expirationDate && <ResourceStatus expirationDate={expirationDate} />}
        </>
      ) : null}
      {!!published && (!!slug || !!id) && <ResourcePublishedLink type="article" slugOrId={slug ?? id!} />}
      {(nodes?.flatMap((node) => node.contexts) ?? []).length > 1 && (
        <StyledErrorWarningFill
          aria-label={t("form.workflow.multipleTaxonomy")}
          title={t("form.workflow.multipleTaxonomy")}
          aria-hidden={false}
        />
      )}
      {!hideFavoritedIcon && <HeaderFavoriteStatus id={id} type={type} favoriteCount={favoriteCount} />}
      <div>
        <FormHeaderResponsibleInfo responsibleName={responsibleName} />
        <FormHeaderStatusInfo isNewLanguage={!!isNewLanguage} statusText={statusText} />
      </div>
    </FormHeaderStatusWrapper>
  );
};

export default HeaderStatusInformation;
