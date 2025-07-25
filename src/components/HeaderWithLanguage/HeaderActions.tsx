/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRightShortLine, ShareBoxLine, EyeFill } from "@ndla/icons";
import { Button } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { IConceptDTO } from "@ndla/types-backend/concept-api";
import { ArticleRevisionHistoryDTO, IArticleDTO } from "@ndla/types-backend/draft-api";
import DeleteLanguageVersion from "./DeleteLanguageVersion";
import { HeaderCurrentLanguagePill } from "./HeaderCurrentLanguagePill";
import { StyledSplitter } from "./HeaderInformation";
import HeaderLanguagePicker from "./HeaderLanguagePicker";
import HeaderSupportedLanguages from "./HeaderSupportedLanguages";
import TranslateNbToNn from "./TranslateNbToNn";
import { createEditUrl, hasArticleFieldsChanged, toMapping, translatableTypes } from "./util";
import { PUBLISHED } from "../../constants";
import { toCompareLanguage } from "../../util/routeHelpers";
import { useIsTranslatableToNN } from "../NynorskTranslateProvider";
import { PreviewResourceDialog } from "../PreviewDraft/PreviewResourceDialog";

interface PreviewLightBoxProps {
  article?: IArticleDTO;
  concept?: IConceptDTO;
  type: string;
  currentLanguage: string;
}

const StyledWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "3xsmall",
  },
});

const StyledGroup = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "3xsmall",
  },
});

const PreviewLightBox = memo(({ type, currentLanguage, article, concept }: PreviewLightBoxProps) => {
  const { t } = useTranslation();
  if ((type === "concept" || type === "gloss") && concept) {
    return (
      <PreviewResourceDialog
        type="conceptCompare"
        concept={concept}
        language={currentLanguage}
        activateButton={
          <Button size="small" variant="secondary">
            <ArrowRightShortLine /> {t("form.previewLanguageArticle.button")}
          </Button>
        }
      />
    );
  } else if ((type === "standard" || type === "topic-article" || type === "frontpage-article") && article) {
    return (
      <SafeLinkButton
        size="small"
        variant="tertiary"
        to={toCompareLanguage(article.id, currentLanguage)}
        target="_blank"
      >
        {t("form.previewLanguageArticle.button")}
        <ShareBoxLine />
      </SafeLinkButton>
    );
  } else return null;
});

interface Props {
  id: number;
  isNewLanguage: boolean;
  article?: IArticleDTO;
  articleRevisionHistory: ArticleRevisionHistoryDTO | undefined;
  concept?: IConceptDTO;
  noStatus: boolean;
  disableDelete: boolean;
  language: string;
  type: keyof typeof toMapping;
  supportedLanguages?: string[];
}

const HeaderActions = ({
  isNewLanguage,
  noStatus,
  type,
  id,
  language,
  disableDelete,
  article,
  articleRevisionHistory,
  concept,
  supportedLanguages = [],
}: Props) => {
  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext();
  const showTranslate = useIsTranslatableToNN();

  const editUrl = useCallback(
    (id: number, locale: string) => {
      return createEditUrl(id, locale, type);
    },
    [type],
  );

  const lastPublishedVersion = useMemo(
    () => articleRevisionHistory?.revisions.find((v) => v.status.current === PUBLISHED),
    [articleRevisionHistory],
  );

  const hasChanges = useMemo(() => {
    return hasArticleFieldsChanged(article, lastPublishedVersion, [
      "title.title",
      "content.content",
      "introduction.introduction",
    ]);
  }, [article, lastPublishedVersion]);

  const languages = useMemo(
    () => [
      { key: "nn", title: t("languages.nn"), include: true },
      { key: "en", title: t("languages.en"), include: type !== "gloss" },
      { key: "nb", title: t("languages.nb"), include: true },
      { key: "sma", title: t("languages.sma"), include: type !== "gloss" },
      { key: "se", title: t("languages.se"), include: type !== "gloss" },
      { key: "und", title: t("languages.und"), include: false },
      { key: "de", title: t("languages.de"), include: type !== "gloss" },
      { key: "es", title: t("languages.es"), include: type !== "gloss" },
      { key: "zh", title: t("languages.zh"), include: type !== "gloss" },
      { key: "ukr", title: t("languages.ukr"), include: type !== "gloss" },
    ],
    [t, type],
  );

  const emptyLanguages = useMemo(
    () => languages.filter((lang) => lang.key !== language && !supportedLanguages.includes(lang.key) && lang.include),
    [language, languages, supportedLanguages],
  );

  return (
    <StyledWrapper>
      <StyledGroup>
        <HeaderSupportedLanguages
          id={id}
          editUrl={editUrl}
          language={language}
          supportedLanguages={supportedLanguages}
          isSubmitting={isSubmitting}
        />
        {!!isNewLanguage && (
          <HeaderCurrentLanguagePill key={`types_${language}`}>{t(`languages.${language}`)}</HeaderCurrentLanguagePill>
        )}
        <StyledSplitter />
        <HeaderLanguagePicker id={id} emptyLanguages={emptyLanguages} editUrl={editUrl} />
        {translatableTypes.includes(type) &&
        language === "nb" &&
        showTranslate &&
        !supportedLanguages.includes("nn") ? (
          <>
            <StyledSplitter />
            <TranslateNbToNn id={id} editUrl={editUrl} />
          </>
        ) : null}
        {!noStatus && (
          <>
            <StyledSplitter />
            <PreviewLightBox article={article} concept={concept} type={type} currentLanguage={language} />
          </>
        )}
        <StyledGroup>
          {!!lastPublishedVersion && (
            <>
              <StyledSplitter />
              <PreviewResourceDialog
                type="version"
                article={lastPublishedVersion}
                language={language}
                customTitle={t("form.previewProductionArticle.published")}
                activateButton={
                  <Button
                    variant="tertiary"
                    size="small"
                    aria-label={
                      hasChanges
                        ? t("form.previewProductionArticle.button")
                        : t("form.previewProductionArticle.buttonDisabled")
                    }
                    disabled={!hasChanges}
                    title={
                      hasChanges
                        ? t("form.previewProductionArticle.button")
                        : t("form.previewProductionArticle.buttonDisabled")
                    }
                  >
                    <EyeFill /> {t("form.previewVersion")}
                  </Button>
                }
              />
            </>
          )}
        </StyledGroup>
      </StyledGroup>
      <DeleteLanguageVersion
        id={id}
        language={language}
        supportedLanguages={supportedLanguages}
        type={type}
        disabled={disableDelete}
      />
    </StyledWrapper>
  );
};

export default memo(HeaderActions);
