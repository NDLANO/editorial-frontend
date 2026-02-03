/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  FieldRoot,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
} from "@ndla/primitives";
import { useTranslation } from "react-i18next";
import { FormField } from "../../../components/FormField";

const VersionLockedField = () => {
  const { t } = useTranslation();

  const options = [
    {
      title: t("taxonomyVersions.form.locked.locked"),
      value: "true",
    },
    {
      title: t("taxonomyVersions.form.locked.unlocked"),
      value: "false",
    },
  ];
  return (
    <FormField name="locked">
      {({ field, helpers }) => (
        <FieldRoot>
          <RadioGroupRoot
            value={field.value.toString()}
            orientation="horizontal"
            onValueChange={(details) => helpers.setValue(details.value)}
          >
            <RadioGroupLabel>{t("taxonomyVersions.form.locked.subTitle")}</RadioGroupLabel>
            {options.map((option) => (
              <RadioGroupItem key={option.value} value={option.value}>
                <RadioGroupItemControl />
                <RadioGroupItemText>{option.title}</RadioGroupItemText>
                <RadioGroupItemHiddenInput />
              </RadioGroupItem>
            ))}
          </RadioGroupRoot>
        </FieldRoot>
      )}
    </FormField>
  );
};
export default VersionLockedField;
