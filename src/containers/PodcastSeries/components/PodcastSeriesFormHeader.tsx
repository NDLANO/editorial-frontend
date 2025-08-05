/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { RssLine } from "@ndla/icons";
import { SafeLinkIconButton } from "@ndla/safelink";
import { ISeriesDTO } from "@ndla/types-backend/audio-api";
import { ContentTypeBadge } from "@ndla/ui";
import HeaderActions from "../../../components/HeaderWithLanguage/HeaderActions";
import { HeaderCurrentLanguagePill } from "../../../components/HeaderWithLanguage/HeaderCurrentLanguagePill";
import config from "../../../config";
import { FormHeaderHeading, FormHeaderHeadingContainer, FormHeaderSegment } from "../../FormHeader/FormHeader";

interface Props {
  series: ISeriesDTO | undefined;
  language: string;
}

export const PodcastSeriesFormHeader = ({ series, language }: Props) => {
  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext();
  const isNewLanguage = !!series?.id && !series.supportedLanguages.includes(language);
  return (
    <header>
      <FormHeaderSegment>
        <FormHeaderHeadingContainer>
          <ContentTypeBadge contentType="podcast-series" />
          <FormHeaderHeading contentType="podcast-series">{series?.title.title}</FormHeaderHeading>
        </FormHeaderHeadingContainer>
        {!!series?.id && !!series?.hasRSS && (
          <SafeLinkIconButton
            size="small"
            variant="tertiary"
            target="_blank"
            to={`${config.ndlaFrontendDomain}/podkast/${series.id}/feed.xml`}
            title={t("podcastSeriesForm.rss")}
            aria-label={t("podcastSeriesForm.rss")}
          >
            <RssLine />
          </SafeLinkIconButton>
        )}
      </FormHeaderSegment>
      {series?.id ? (
        <HeaderActions
          id={series.id}
          articleRevisionHistory={undefined}
          language={language}
          supportedLanguages={series.supportedLanguages}
          disableDelete={false}
          noStatus
          isNewLanguage={isNewLanguage}
          isSubmitting={isSubmitting}
          type="podcast-series"
        />
      ) : (
        <HeaderCurrentLanguagePill>{t(`languages.${language}`)}</HeaderCurrentLanguagePill>
      )}
    </header>
  );
};
