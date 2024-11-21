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
import emotionStyled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { SelectContent, SelectLabel, SelectRoot, SelectValueText, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GenericSelectItem, GenericSelectTrigger } from "../../../components/abstractions/Select";
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

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
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
      <FooterBlock lang={i18n.language}>
        {showLocaleSelector && (
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
