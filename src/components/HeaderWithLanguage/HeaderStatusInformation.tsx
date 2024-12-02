/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ErrorWarningFill, RssLine } from "@ndla/icons/common";
import { CheckboxCircleFill } from "@ndla/icons/editor";
import { Text } from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { IConceptSummary } from "@ndla/types-backend/concept-api";
import { ILearningPathV2 } from "@ndla/types-backend/learningpath-api";
import { IMultiSearchSummary } from "@ndla/types-backend/search-api";
import EmbedConnection from "./EmbedInformation/EmbedConnection";
import HeaderFavoriteStatus from "./HeaderFavoriteStatus";
import LearningpathConnection from "./LearningpathConnection";
import config from "../../config";
import formatDate from "../../util/formatDate";
import { StatusTimeFill } from "../StatusTimeFill";

const StyledStatusWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    gap: "3xsmall",
  },
});

export const getWarnStatus = (date?: string): "warn" | "expired" | undefined => {
  if (!date) return undefined;
  const parsedDate = new Date(date);

  const daysToWarn = 365;
  const errorDate = new Date();
  const warnDate = new Date();
  warnDate.setDate(errorDate.getDate() + daysToWarn);

  if (errorDate > parsedDate) return "expired";
  if (warnDate > parsedDate) return "warn";
};

interface Props {
  noStatus?: boolean;
  statusText?: string;
  isNewLanguage?: boolean;
  published: boolean;
  multipleTaxonomy?: boolean;
  type?: string;
  id?: number;
  setHasConnections?: (hasConnections: boolean) => void;
  expirationDate?: string;
  responsibleName?: string;
  hasRSS?: boolean;
  inSearch?: boolean;
  slug?: string;
  favoriteCount?: number;
}

const StyledText = styled(Text, {
  base: {
    display: "flex",
    "& > *": {
      flex: "1",
    },
  },
});

const StyledErrorWarningFill = styled(ErrorWarningFill, {
  base: {
    fill: "icon.subtle",
  },
});

const HeaderStatusInformation = ({
  noStatus,
  statusText,
  isNewLanguage,
  published,
  multipleTaxonomy,
  type,
  id,
  setHasConnections,
  inSearch,
  expirationDate,
  responsibleName,
  slug,
  hasRSS,
  favoriteCount,
}: Props) => {
  const { t } = useTranslation();
  const [learningpaths, setLearningpaths] = useState<ILearningPathV2[]>([]);
  const [articles, setArticles] = useState<IMultiSearchSummary[]>([]);
  const [concepts, setConcepts] = useState<IConceptSummary[]>([]);

  useEffect(() => {
    setHasConnections?.(!!learningpaths?.length || !!articles?.length || !!concepts?.length);
  }, [learningpaths, articles, concepts, setHasConnections]);

  const expirationColor = useMemo(() => getWarnStatus(expirationDate), [expirationDate]);
  const hideFavoritedIcon = type === "frontpage-article" || type === "image" || type === "audio";
  if (!noStatus || isNewLanguage) {
    return (
      <StyledStatusWrapper>
        {(type === "standard" || type === "topic-article") && !inSearch ? (
          <>
            <EmbedConnection id={id} type="article" articles={articles} setArticles={setArticles} />
            <LearningpathConnection id={id} learningpaths={learningpaths} setLearningpaths={setLearningpaths} />
            {!!expirationColor && !!expirationDate && (
              <StatusTimeFill
                variant={expirationColor}
                title={t(`form.workflow.expiration.${expirationColor}`, {
                  date: formatDate(expirationDate),
                })}
                aria-label={t(`form.workflow.expiration.${expirationColor}`, {
                  date: formatDate(expirationDate),
                })}
                aria-hidden={false}
              />
            )}
          </>
        ) : (type === "concept" || type === "gloss") && !inSearch ? (
          <EmbedConnection id={id} type={type} articles={articles} setArticles={setArticles} />
        ) : null}
        {!!published && (
          <SafeLinkIconButton
            variant="success"
            size="small"
            target="_blank"
            aria-label={t("form.workflow.published")}
            title={t("form.workflow.published")}
            to={`${config.ndlaFrontendDomain}/${type === "concept" || type === "gloss" ? "concept" : "article"}/${
              slug ?? id
            }`}
          >
            <CheckboxCircleFill />
          </SafeLinkIconButton>
        )}
        {!!multipleTaxonomy && (
          <StyledErrorWarningFill
            aria-label={t("form.workflow.multipleTaxonomy")}
            title={t("form.workflow.multipleTaxonomy")}
            aria-hidden={false}
          />
        )}
        {!hideFavoritedIcon && <HeaderFavoriteStatus id={id} type={type} favoriteCount={favoriteCount} />}
        <div>
          <StyledText textStyle="label.xsmall">
            <b>{`${t("form.responsible.label")}: `}</b>
            {responsibleName || t("form.responsible.noResponsible")}
          </StyledText>
          {noStatus ? (
            t("form.status.new_language")
          ) : (
            <StyledText textStyle="label.xsmall">
              <b>{`${t("form.workflow.statusLabel")}: `}</b>
              {isNewLanguage ? t("form.status.new_language") : statusText || t("form.status.new")}
            </StyledText>
          )}
        </div>
      </StyledStatusWrapper>
    );
  } else if (type === "image") {
    return (
      <StyledStatusWrapper>
        <HeaderFavoriteStatus id={id} type={type} />
        <EmbedConnection
          id={id}
          type="image"
          articles={articles}
          setArticles={setArticles}
          concepts={concepts}
          setConcepts={setConcepts}
        />
      </StyledStatusWrapper>
    );
  } else if (type === "audio" || type === "podcast") {
    return (
      <StyledStatusWrapper>
        <HeaderFavoriteStatus id={id} type="audio" />
        <EmbedConnection
          id={id}
          type="audio"
          articles={articles}
          setArticles={setArticles}
          concepts={concepts}
          setConcepts={setConcepts}
        />
      </StyledStatusWrapper>
    );
  } else if (type === "podcast-series" && hasRSS && id !== undefined) {
    return (
      <SafeLinkIconButton
        size="small"
        variant="tertiary"
        target="_blank"
        to={`${config.ndlaFrontendDomain}/podkast/${id}/feed.xml`}
        title={t("podcastSeriesForm.rss")}
        aria-label={t("podcastSeriesForm.rss")}
      >
        <RssLine />
      </SafeLinkIconButton>
    );
  }
  return null;
};

export default HeaderStatusInformation;
