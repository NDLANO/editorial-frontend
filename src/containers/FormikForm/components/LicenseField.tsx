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
import {
  FieldErrorMessage,
  FieldRoot,
  SelectContent,
  SelectHiddenSelect,
  SelectLabel,
  SelectRoot,
  SelectValueText,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GenericSelectItem, GenericSelectTrigger } from "../../../components/abstractions/Select";
import { FormField } from "../../../components/FormField";
import { useLicenses } from "../../../modules/draft/draftQueries";
import { getLicensesWithTranslations } from "../../../util/licenseHelpers";

interface Props {
  name?: string;
  enableLicenseNA?: boolean;
}

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: {
    width: "100%",
  },
});

const LicenseField = ({ name = "license", enableLicenseNA }: Props) => {
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const { t, i18n } = useTranslation();

  const collection = useMemo(
    () =>
      createListCollection({
        items: getLicensesWithTranslations(licenses!, i18n.language, enableLicenseNA),
        itemToString: (item) => item.title,
        itemToValue: (item) => item.license,
      }),
    [enableLicenseNA, licenses, i18n.language],
  );

  return (
    <FormField name={name}>
      {({ field, meta, helpers }) => (
        <FieldRoot invalid={!!meta.error}>
          <SelectRoot
            value={[field.value]}
            onValueChange={(details) => helpers.setValue(details.value[0])}
            collection={collection}
            positioning={{ sameWidth: true }}
          >
            <SelectLabel>{t("form.license.label")}</SelectLabel>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <StyledGenericSelectTrigger>
              <SelectValueText placeholder={t("form.license.choose")} />
            </StyledGenericSelectTrigger>
            <SelectContent>
              {collection.items.map((item) => (
                <GenericSelectItem key={item.license} item={item}>
                  {item.title}
                </GenericSelectItem>
              ))}
            </SelectContent>
            <SelectHiddenSelect />
          </SelectRoot>
        </FieldRoot>
      )}
    </FormField>
  );
};

export default LicenseField;
