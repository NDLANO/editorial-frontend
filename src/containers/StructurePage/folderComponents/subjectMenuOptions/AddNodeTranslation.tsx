/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import {
  Button,
  SelectContent,
  SelectHiddenSelect,
  SelectLabel,
  SelectRoot,
  SelectValueText,
  Heading,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Translation } from "@ndla/types-taxonomy";
import { GenericSelectItem, GenericSelectTrigger } from "../../../../components/abstractions/Select";
import { FormContent } from "../../../../components/FormikForm";
import { LocaleType } from "../../../../interfaces";

interface Props {
  onAddTranslation: (translation: Translation) => void;
  availableLanguages: LocaleType[];
  defaultName: string;
}

const FieldWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    alignItems: "flex-end",
  },
});

const StyledSelectRoot = styled(SelectRoot, {
  base: {
    flex: "1",
  },
});

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: {
    width: "100%",
  },
});

const AddNodeTranslation = ({ onAddTranslation, availableLanguages, defaultName }: Props) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

  const collection = useMemo(() => {
    return createListCollection({
      items: availableLanguages,
      itemToString: (item) => t(`languages.${item}`),
      itemToValue: (item) => item,
    });
  }, [availableLanguages, t]);

  useEffect(() => {
    setSelectedLanguage(availableLanguages[0]);
  }, [availableLanguages]);

  const handleAddTranslation = () => {
    if (!selectedLanguage) return;
    onAddTranslation({ language: selectedLanguage, name: defaultName });
    setSelectedLanguage(undefined);
  };

  if (availableLanguages.length === 0) {
    return null;
  }

  return (
    <FormContent>
      <Heading consumeCss asChild textStyle="label.medium" fontWeight="bold">
        <h2>{t("taxonomy.changeName.addNewTranslation")}</h2>
      </Heading>
      <FieldWrapper>
        <StyledSelectRoot
          collection={collection}
          value={selectedLanguage ? [selectedLanguage] : undefined}
          onValueChange={(details) => setSelectedLanguage(details.value[0])}
          positioning={{ sameWidth: true }}
        >
          <SelectLabel>{t("taxonomy.changeName.language")}</SelectLabel>
          <StyledGenericSelectTrigger size="small">
            <SelectValueText />
          </StyledGenericSelectTrigger>
          <SelectContent>
            {availableLanguages.map((lang) => (
              <GenericSelectItem key={lang} item={lang}>
                {t(`languages.${lang}`)}
              </GenericSelectItem>
            ))}
          </SelectContent>
          <SelectHiddenSelect />
        </StyledSelectRoot>
        <Button onClick={handleAddTranslation} disabled={!selectedLanguage} size="small">
          {t("taxonomy.changeName.add")}
        </Button>
      </FieldWrapper>
    </FormContent>
  );
};

export default AddNodeTranslation;
