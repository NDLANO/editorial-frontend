/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { PageContent, SelectContent, SelectLabel, SelectRoot, SelectValueText, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { supportedLanguages } from "../i18n";
import { LocaleType } from "../interfaces";
import { GenericSelectItem, GenericSelectTrigger } from "./abstractions/Select";

export const FooterBlock = styled("footer", {
  base: {
    position: "relative",
    background: "primary",
    paddingBlock: "medium",
  },
});

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: {
    width: "unset",
  },
});

const FooterContainer = styled("div", {
  base: {
    marginBlockStart: "medium",
  },
});

const LanguageSelectorWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "center",
  },
});

const FooterTextWrapper = styled("div", {
  base: {
    alignSelf: "flex-end",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
});

const FooterContent = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
});

export const Footer = () => {
  const { t, i18n } = useTranslation();

  const supportedLanguagesCollection = useMemo(
    () =>
      createListCollection({
        items: supportedLanguages,
        itemToString: (item) => t(`languages.${item}`),
      }),
    [t],
  );

  return (
    <FooterContainer>
      <FooterBlock lang={i18n.language} id="footer">
        <PageContent variant="page">
          <FooterContent>
            <LanguageSelectorWrapper>
              <SelectRoot
                collection={supportedLanguagesCollection}
                onValueChange={(details) => i18n.changeLanguage(details.value[0] as LocaleType)}
                value={[i18n.language]}
              >
                <SelectLabel srOnly>{t("languages.prefixChangeLanguage")}</SelectLabel>
                <StyledGenericSelectTrigger>
                  <SelectValueText>{t("languages.prefixChangeLanguage")}</SelectValueText>
                </StyledGenericSelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <GenericSelectItem key={lang} item={lang}>
                      {t(`languages.${lang}`)}
                    </GenericSelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </LanguageSelectorWrapper>
            <FooterTextWrapper>
              <Text color="text.onAction">{t("footer.info")}</Text>
              <Text color="text.onAction">
                <strong>{t("footer.editorInChief")}</strong> Sigurd Trageton
              </Text>
            </FooterTextWrapper>
          </FooterContent>
        </PageContent>
      </FooterBlock>
    </FooterContainer>
  );
};
