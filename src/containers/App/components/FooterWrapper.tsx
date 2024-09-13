/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import emotionStyled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { ArrowDownShortLine } from "@ndla/icons/common";
import { CheckLine } from "@ndla/icons/editor";
import {
  Button,
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPositioner,
  SelectRoot,
  SelectTrigger,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { supportedLanguages } from "../../../i18n2";
import { LocaleType } from "../../../interfaces";

export const FooterBlock = styled("footer", {
  base: {
    position: "relative",
    background: "primary",
    paddingBlock: "medium",
    paddingInline: "4xlarge",
  },
});

const LanguageSelectTrigger = styled(SelectTrigger, {
  base: {
    width: "unset",
  },
});

interface Props {
  showLocaleSelector?: boolean;
}

const FooterContainer = emotionStyled.div`
  margin-top: ${spacing.medium};
`;

const LanguageSelectorWrapper = emotionStyled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const FooterTextWrapper = emotionStyled.div`
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
            <SelectRoot
              items={supportedLanguages}
              onValueChange={(details) => i18n.changeLanguage(details.value[0] as LocaleType)}
              value={[i18n.language]}
              itemToString={(item) => t(`languages.${item}`)}
            >
              <SelectLabel srOnly>{t("languages.prefixChangeLanguage")}</SelectLabel>
              <LanguageSelectTrigger asChild>
                <Button variant="secondary">
                  {t("languages.prefixChangeLanguage")} <ArrowDownShortLine />
                </Button>
              </LanguageSelectTrigger>
              <SelectPositioner>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang} item={lang}>
                      <SelectItemText>{t(`languages.${lang}`)}</SelectItemText>
                      <SelectItemIndicator>
                        <CheckLine />
                      </SelectItemIndicator>
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectPositioner>
            </SelectRoot>
          </LanguageSelectorWrapper>
        )}
        <FooterTextWrapper>
          <Text color="text.onAction">{t("footer.info")}</Text>
          <Text color="text.onAction">
            <strong>{t("footer.editorInChief")}</strong> Sigurd Trageton
          </Text>
        </FooterTextWrapper>
      </FooterBlock>
    </FooterContainer>
  );
};

export default FooterWrapper;
