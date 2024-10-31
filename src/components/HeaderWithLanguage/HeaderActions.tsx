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
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { FileCompare } from "@ndla/icons/action";
import { Launch } from "@ndla/icons/common";
import { Check, Eye } from "@ndla/icons/editor";
import { SafeLinkButton } from "@ndla/safelink";
import { IConcept } from "@ndla/types-backend/concept-api";
import { IArticle } from "@ndla/types-backend/draft-api";
import DeleteLanguageVersion from "./DeleteLanguageVersion";
import { StyledSplitter } from "./HeaderInformation";
import HeaderLanguagePicker from "./HeaderLanguagePicker";
import HeaderLanguagePill from "./HeaderLanguagePill";
import HeaderSupportedLanguages from "./HeaderSupportedLanguages";
import TranslateNbToNn from "./TranslateNbToNn";
import { createEditUrl, hasArticleFieldsChanged, toMapping, translatableTypes } from "./util";
import { PUBLISHED } from "../../constants";
import { toCompareLanguage } from "../../util/routeHelpers";
import { useIsTranslatableToNN } from "../NynorskTranslateProvider";
import PreviewDraftLightboxV2 from "../PreviewDraft/PreviewDraftLightboxV2";

interface PreviewLightBoxProps {
  article?: IArticle;
  concept?: IConcept;
  type: string;
  currentLanguage: string;
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const StyledGroup = styled.div`
  display: flex;
  align-items: center;
`;

const PreviewLightBox = memo(({ type, currentLanguage, article, concept }: PreviewLightBoxProps) => {
  const { t } = useTranslation();
  if ((type === "concept" || type === "gloss") && concept) {
    return (
      <PreviewDraftLightboxV2
        type="conceptCompare"
        concept={concept}
        language={currentLanguage}
        activateButton={
          <ButtonV2 size="small" colorTheme="light">
            <FileCompare /> {t("form.previewLanguageArticle.button")}
          </ButtonV2>
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
        <Launch />
      </SafeLinkButton>
    );
  } else return null;
});

interface Props {
  id: number;
  isNewLanguage: boolean;
  article?: IArticle;
  articleHistory: IArticle[] | undefined;
  concept?: IConcept;
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
  articleHistory,
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
    () => articleHistory?.find((v) => v.status.current === PUBLISHED),
    [articleHistory],
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
    <>
      <StyledWrapper>
        <HeaderSupportedLanguages
          id={id}
          editUrl={editUrl}
          language={language}
          supportedLanguages={supportedLanguages}
          isSubmitting={isSubmitting}
        />
        {isNewLanguage && (
          <HeaderLanguagePill current key={`types_${language}`}>
            <Check />
            {t(`languages.${language}`)}
          </HeaderLanguagePill>
        )}
        <StyledSplitter />
        <HeaderLanguagePicker id={id} emptyLanguages={emptyLanguages} editUrl={editUrl} />
        {translatableTypes.includes(type) &&
          language === "nb" &&
          showTranslate &&
          !supportedLanguages.includes("nn") && (
            <>
              <StyledSplitter />
              <TranslateNbToNn id={id} editUrl={editUrl} />
            </>
          )}
        {!noStatus && (
          <>
            <StyledSplitter />
            <PreviewLightBox article={article} concept={concept} type={type} currentLanguage={language} />
          </>
        )}
        <StyledGroup>
          {lastPublishedVersion && (
            <>
              <StyledSplitter />
              <PreviewDraftLightboxV2
                type="version"
                article={lastPublishedVersion}
                language={language}
                customTitle={t("form.previewProductionArticle.published")}
                activateButton={
                  <ButtonV2
                    variant="ghost"
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
                    <Eye /> {t("form.previewVersion")}
                  </ButtonV2>
                }
              />
            </>
          )}
        </StyledGroup>
      </StyledWrapper>
      {
        <DeleteLanguageVersion
          id={id}
          language={language}
          supportedLanguages={supportedLanguages}
          type={type}
          disabled={disableDelete}
        />
      }
    </>
  );
};

export default memo(HeaderActions);
