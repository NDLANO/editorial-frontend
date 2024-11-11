/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { CheckboxCircleFill } from "@ndla/icons/editor";
import HeaderInformation, { StyledSplitter } from "./HeaderInformation";
import HeaderLanguagePicker from "./HeaderLanguagePicker";
import HeaderLanguagePill from "./HeaderLanguagePill";
import HeaderSupportedLanguages from "./HeaderSupportedLanguages";
import { StyledLanguageWrapper } from "./HeaderWithLanguage";

interface Props {
  articleType: string;
  editUrl: (id: number, lang: string) => string;
  id: number;
  isSubmitting: boolean;
  language: string;
  supportedLanguages: string[];
  title: string;
}

const SimpleLanguageHeader = ({
  articleType,
  editUrl,
  id,
  isSubmitting,
  language,
  supportedLanguages,
  title,
}: Props) => {
  const { t } = useTranslation();
  const isNewLanguage = !!id && !supportedLanguages.includes(language);

  const languages = [
    { key: "nn", title: t("languages.nn"), include: true },
    { key: "en", title: t("languages.en"), include: true },
    { key: "nb", title: t("languages.nb"), include: true },
    { key: "sma", title: t("languages.sma"), include: true },
    { key: "se", title: t("languages.se"), include: true },
    { key: "und", title: t("languages.und"), include: false },
    { key: "de", title: t("languages.de"), include: true },
    { key: "es", title: t("languages.es"), include: true },
    { key: "ukr", title: t("languages.ukr"), include: false },
  ];
  const emptyLanguages = languages.filter(
    (lang) => lang.key !== language && !supportedLanguages.includes(lang.key) && lang.include,
  );

  return (
    <div>
      <HeaderInformation
        type={articleType}
        noStatus
        title={title}
        isNewLanguage={isNewLanguage}
        id={id}
        language={language}
      />
      <StyledLanguageWrapper>
        {id ? (
          <>
            <HeaderSupportedLanguages
              id={id}
              editUrl={editUrl}
              language={language}
              supportedLanguages={supportedLanguages}
              isSubmitting={isSubmitting}
            />
            {isNewLanguage && (
              <HeaderLanguagePill current key={`types_${language}`}>
                <CheckboxCircleFill />
                {t(`languages.${language}`)}
              </HeaderLanguagePill>
            )}
            <StyledSplitter />
            <HeaderLanguagePicker id={id} emptyLanguages={emptyLanguages} editUrl={editUrl} />
          </>
        ) : (
          <>
            <HeaderLanguagePill current>
              <CheckboxCircleFill />
              {t(`languages.${language}`)}
            </HeaderLanguagePill>
          </>
        )}
      </StyledLanguageWrapper>
    </div>
  );
};

export default SimpleLanguageHeader;
