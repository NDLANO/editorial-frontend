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
import { ILearningPathSummaryV2DTO } from "@ndla/types-backend/learningpath-api";
import { IMultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import EmbedConnection from "./EmbedInformation/EmbedConnection";
import HeaderFavoriteStatus from "./HeaderFavoriteStatus";
import LearningpathConnection from "./LearningpathConnection";
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
  multipleTaxonomy?: boolean;
  type?: string;
  id?: number;
  expirationDate?: string;
  responsibleName?: string;
  slug?: string;
  favoriteCount?: number;
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
  multipleTaxonomy,
  type,
  id,
  expirationDate,
  responsibleName,
  slug,
  favoriteCount,
}: Props) => {
  const { t } = useTranslation();
  const [learningpaths, setLearningpaths] = useState<ILearningPathSummaryV2DTO[]>([]);
  const [articles, setArticles] = useState<IMultiSearchSummaryDTO[]>([]);

  const hideFavoritedIcon = type === "frontpage-article";
  return (
    <FormHeaderStatusWrapper>
      {type === "standard" || type === "topic-article" ? (
        <>
          <EmbedConnection id={id} type="article" articles={articles} setArticles={setArticles} />
          <LearningpathConnection id={id} learningpaths={learningpaths} setLearningpaths={setLearningpaths} />
          {!!expirationDate && <ResourceStatus expirationDate={expirationDate} />}
        </>
      ) : null}
      {!!published && (!!slug || !!id) && <ResourcePublishedLink type="article" slugOrId={slug ?? id!} />}
      {!!multipleTaxonomy && (
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
