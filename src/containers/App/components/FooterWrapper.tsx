/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { Text } from "@ndla/typography";
import { FooterBlock, LanguageSelector } from "@ndla/ui";
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

const FooterTextWrapper = styled.div`
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const FooterWrapper = ({ showLocaleSelector }: Props) => {
  const { t, i18n } = useTranslation();

  return (
    <FooterContainer>
      <FooterBlock lang={i18n.language}>
        {showLocaleSelector && (
          <LanguageSelectorWrapper>
            <LanguageSelector locales={supportedLanguages} onSelect={i18n.changeLanguage} inverted />
          </LanguageSelectorWrapper>
        )}
        <FooterTextWrapper>
          <Text textStyle="meta-text-medium" margin="none">
            {t("footer.info")}
          </Text>
          <Text textStyle="meta-text-medium" margin="none">
            <strong>{t("footer.editorInChief")}</strong> Sigurd Trageton
          </Text>
        </FooterTextWrapper>
      </FooterBlock>
    </FooterContainer>
  );
};

export default FooterWrapper;
