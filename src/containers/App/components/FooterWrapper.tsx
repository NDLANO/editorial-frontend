/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Footer, LanguageSelector, FooterText, EditorName } from "@ndla/ui";
import { constructNewPath } from "../../../i18n";
import { supportedLanguages } from "../../../i18n2";

interface Props {
  showLocaleSelector?: boolean;
}

const FooterContainer = styled.div`
  margin-top: ${spacing.medium};
`;

const LanguageSelectorWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const FooterWrapper = ({ showLocaleSelector }: Props) => {
  const { t, i18n } = useTranslation();

  const onChangeLanguage = useCallback((lang: string) => {
    window.location.href = constructNewPath(window.location.pathname, lang);
  }, []);

  return (
    <FooterContainer>
      <Footer lang={i18n.language}>
        {showLocaleSelector && (
          <LanguageSelectorWrapper>
            <LanguageSelector locales={supportedLanguages} onSelect={onChangeLanguage} inverted />
          </LanguageSelectorWrapper>
        )}
        <FooterText>
          <EditorName title={t("footer.editorInChief")} name="Sigurd Trageton" />
          {t("footer.info")}
        </FooterText>
      </Footer>
    </FooterContainer>
  );
};

export default FooterWrapper;
