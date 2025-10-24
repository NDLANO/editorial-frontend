/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Badge } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { constants } from "@ndla/ui";
import DeleteLanguageVersion from "./DeleteLanguageVersion";
import { HeaderCurrentLanguagePill } from "./HeaderCurrentLanguagePill";
import { StyledSplitter } from "./HeaderInformation";
import HeaderLanguagePicker from "./HeaderLanguagePicker";
import HeaderSupportedLanguages from "./HeaderSupportedLanguages";
import {
  FormHeaderHeading,
  FormHeaderHeadingContainer,
  FormHeaderSegment,
} from "../../containers/FormHeader/FormHeader";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "3xsmall",
  },
});

const DeleteLanguageVersionWrapper = styled("div", {
  base: {
    marginLeft: "auto",
  },
});

interface Props {
  articleType: string | undefined;
  editUrl: (id: number, lang: string) => string;
  id: number;
  isSubmitting: boolean;
  language: string;
  supportedLanguages: string[];
  title: string;
  availableLanguages?: string[];
}

const AVAILABLE_LANGUAGES = ["nn", "en", "nb", "sma", "se", "de", "es"];
const { contentTypes } = constants;

const contentTypeMapping: Record<string, string> = {
  subjectpage: contentTypes.SUBJECT,
  filmfrontpage: contentTypes.SUBJECT,
  programme: "programme",
};

const SimpleLanguageHeader = ({
  articleType = constants.contentTypes.SUBJECT_MATERIAL,
  editUrl,
  id,
  isSubmitting,
  language,
  supportedLanguages,
  title,
  availableLanguages = AVAILABLE_LANGUAGES,
}: Props) => {
  const { t } = useTranslation();
  const isNewLanguage = !!id && !supportedLanguages.includes(language);

  const contentType = contentTypeMapping[articleType];

  const emptyLanguages = availableLanguages
    .filter((lang) => lang !== language && !supportedLanguages.includes(lang))
    .map((lang) => ({ key: lang, title: t(`languages.${lang}`) }));

  return (
    <div>
      <FormHeaderSegment>
        <FormHeaderHeadingContainer>
          {!!contentType && <Badge>{t("contentTypes.contentType")}</Badge>}
          <FormHeaderHeading contentType={contentType}>{title}</FormHeaderHeading>
        </FormHeaderHeadingContainer>
      </FormHeaderSegment>
      {id ? (
        <Wrapper>
          <HeaderSupportedLanguages
            id={id}
            editUrl={editUrl}
            language={language}
            supportedLanguages={supportedLanguages}
            isSubmitting={isSubmitting}
          />
          {!!isNewLanguage && (
            <HeaderCurrentLanguagePill key={`types_${language}`}>
              {t(`languages.${language}`)}
            </HeaderCurrentLanguagePill>
          )}
          {emptyLanguages.length > 0 && (
            <>
              <StyledSplitter />
              <HeaderLanguagePicker id={id} emptyLanguages={emptyLanguages} editUrl={editUrl} />
            </>
          )}
          <DeleteLanguageVersionWrapper>
            <DeleteLanguageVersion
              language={language}
              supportedLanguages={supportedLanguages}
              id={id}
              disabled={supportedLanguages.length === 1}
              type={articleType}
            />
          </DeleteLanguageVersionWrapper>
        </Wrapper>
      ) : (
        <HeaderCurrentLanguagePill>{t(`languages.${language}`)}</HeaderCurrentLanguagePill>
      )}
    </div>
  );
};

export default SimpleLanguageHeader;
