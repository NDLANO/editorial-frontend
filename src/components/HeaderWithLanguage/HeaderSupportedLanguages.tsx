/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { CheckboxCircleFill } from "@ndla/icons/editor";
import { SafeLinkButton } from "@ndla/safelink";
import HeaderLanguagePill from "./HeaderLanguagePill";

interface Props {
  id: number;
  language: string;
  editUrl: (id: number, url: string) => string;
  supportedLanguages?: string[];
  isSubmitting?: boolean;
  replace?: boolean;
}

const HeaderSupportedLanguages = ({ supportedLanguages = [], id, editUrl, isSubmitting, language, replace }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      {supportedLanguages.map((supportedLanguage) =>
        language === supportedLanguage ? (
          <HeaderLanguagePill current key={`types_${supportedLanguage}`}>
            <CheckboxCircleFill />
            {t(`languages.${supportedLanguage}`)}
          </HeaderLanguagePill>
        ) : (
          <SafeLinkButton
            aria-label={t("languages.change", {
              language: t(`languages.${supportedLanguage}`),
            })}
            title={t("languages.change", {
              language: t(`languages.${supportedLanguage}`),
            })}
            size="small"
            variant="tertiary"
            to={editUrl(id, supportedLanguage)}
            replace={replace}
            disabled={isSubmitting}
            key={`types_${supportedLanguage}`}
          >
            {t(`languages.${supportedLanguage}`)}
          </SafeLinkButton>
        ),
      )}
    </>
  );
};

export default HeaderSupportedLanguages;
