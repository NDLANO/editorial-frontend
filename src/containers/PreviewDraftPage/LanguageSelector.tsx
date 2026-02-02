/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createListCollection } from "@ark-ui/react";
import { SelectContent, SelectLabel, SelectRoot, SelectValueText } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { GenericSelectItem, GenericSelectTrigger } from "../../components/abstractions/Select";
import { routes } from "../../util/routeHelpers";

interface Props {
  supportedLanguages: string[];
}

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: {
    width: "100%",
  },
});

const StyledSelectContent = styled(SelectContent, {
  base: {
    color: "text.default",
  },
});

const LanguageSelector = ({ supportedLanguages }: Props) => {
  const { t } = useTranslation();
  const { draftId, language } = useParams<"draftId" | "language">();
  const navigate = useNavigate();

  const collection = useMemo(() => {
    return createListCollection({
      items: supportedLanguages,
      itemToValue: (item) => item,
      itemToString: (item) => t(`languages.${item}`),
    });
  }, [supportedLanguages, t]);

  if (!collection.items.length) {
    return null;
  }

  return (
    <SelectRoot
      collection={collection}
      value={language ? [language] : undefined}
      onValueChange={(details) => navigate(routes.preview.draft(Number(draftId), details.value[0]))}
      positioning={{ sameWidth: true }}
    >
      <SelectLabel>{t("languages.prefixChangeLanguage")}</SelectLabel>
      <StyledGenericSelectTrigger>
        <SelectValueText />
      </StyledGenericSelectTrigger>
      <StyledSelectContent>
        {collection.items.map((item) => (
          <GenericSelectItem key={item} item={item}>
            {t(`languages.${item}`)}
          </GenericSelectItem>
        ))}
      </StyledSelectContent>
    </SelectRoot>
  );
};

export default LanguageSelector;
