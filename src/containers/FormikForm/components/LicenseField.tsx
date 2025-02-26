/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection, SelectValueChangeDetails } from "@ark-ui/react";
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

const positioning = { sameWidth: true };

const LicenseField = ({ name = "license", enableLicenseNA }: Props) => {
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const { t, i18n } = useTranslation();
  const [field, meta, helpers] = useField<string>(name);

  const collection = useMemo(
    () =>
      createListCollection({
        items: getLicensesWithTranslations(licenses!, i18n.language, enableLicenseNA),
        itemToString: (item) => item.title,
        itemToValue: (item) => item.license,
      }),
    [enableLicenseNA, licenses, i18n.language],
  );

  const value = useMemo(() => [field.value], [field.value]);

  const onValueChange = useCallback(
    (details: SelectValueChangeDetails) => {
      helpers.setValue(details.value[0]);
    },
    [helpers],
  );

  return (
    <FieldRoot invalid={!!meta.error}>
      <SelectRoot value={value} onValueChange={onValueChange} collection={collection} positioning={positioning}>
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
  );
};

export default LicenseField;
