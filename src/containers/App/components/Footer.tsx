/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { Footer, LanguageSelector, FooterText, EditorName } from "@ndla/ui";
import { supportedLanguages } from "../../../i18n2";

interface Props {
  showLocaleSelector?: boolean;
}

const LanguageSelectorWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const FooterWrapper = ({ showLocaleSelector }: Props) => {
  const { t, i18n } = useTranslation();

  return (
    <Footer lang={i18n.language}>
      {showLocaleSelector && (
        <LanguageSelectorWrapper>
          <LanguageSelector locales={supportedLanguages} onSelect={i18n.changeLanguage} inverted />
        </LanguageSelectorWrapper>
      )}
      <FooterText>
        <EditorName title={t("footer.editorInChief")} name="Sigurd Trageton" />
        {t("footer.info")}
      </FooterText>
    </Footer>
  );
};

export default FooterWrapper;
