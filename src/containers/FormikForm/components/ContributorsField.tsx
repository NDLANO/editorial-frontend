/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { FieldArray, useFormikContext } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { CloseLine } from "@ndla/icons/action";
import { contributorGroups, contributorTypes } from "@ndla/licenses";
import {
  Button,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  FieldsetLegend,
  FieldsetRoot,
  SelectContent,
  SelectHiddenSelect,
  SelectLabel,
  SelectPositioner,
  SelectRoot,
  SelectValueText,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IAuthor } from "@ndla/types-backend/draft-api";
import { GenericSelectItem, GenericSelectTrigger } from "../../../components/abstractions/Select";
import { FormField } from "../../../components/FormField";

type ContributorType = keyof typeof contributorGroups;

interface Props {
  contributorTypes: readonly ContributorType[];
  width?: number;
}

interface ContributorTypes {
  creators: IAuthor[];
  processors: IAuthor[];
  rightsholders: IAuthor[];
}

const StyledFieldsetRoot = styled(FieldsetRoot, {
  base: {
    alignItems: "flex-start",
  },
});

const StyledInnerFieldsetRoot = styled(FieldsetRoot, {
  base: {
    display: "grid",
    gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) auto",
    gap: "xsmall",
    alignItems: "flex-end",
  },
});

const ContributorsField = ({ contributorTypes }: Props) => {
  return (
    <>
      {contributorTypes.map((contributorType) => (
        <FieldArray
          name={contributorType}
          key={contributorType}
          render={(arrayHelpers) => (
            <Contributor type={contributorType} onAddNew={arrayHelpers.push} onRemove={arrayHelpers.remove} />
          )}
        />
      ))}
    </>
  );
};

interface ContributorProps {
  type: ContributorType;
  onAddNew: (val: IAuthor) => void;
  onRemove: (index: number) => void;
}

const Contributor = ({ type, onAddNew, onRemove }: ContributorProps) => {
  const { t, i18n } = useTranslation();
  const { values } = useFormikContext<ContributorTypes>();

  const collection = useMemo(() => {
    const contributorTypeItems = contributorGroups[type].map((item: string) => ({
      type: item,
      translation: contributorTypes[i18n.language] ? contributorTypes[i18n.language][item] : contributorTypes.nb[item],
    }));

    return createListCollection({
      items: contributorTypeItems,
      itemToValue: (item) => item.type,
      itemToString: (item) => item.translation,
    });
  }, [i18n.language, type]);

  return (
    <StyledFieldsetRoot data-testid={`contributor-fieldset`}>
      <FieldsetLegend>{t(`form.${type}.label`)}</FieldsetLegend>
      {values[type].map((_: IAuthor, contributorIndex: number) => (
        <StyledInnerFieldsetRoot key={`${type}.${contributorIndex}`}>
          <FieldsetLegend srOnly>
            {t(`form.${type}.label`)} {contributorIndex + 1}
          </FieldsetLegend>
          <FormField name={`${type}.${contributorIndex}.name`}>
            {({ field, meta }) => (
              <FieldRoot required invalid={!!meta.error}>
                <FieldLabel>{t("form.name.name")}</FieldLabel>
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                <FieldInput
                  {...field}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={!meta.touched}
                />
              </FieldRoot>
            )}
          </FormField>
          <FormField name={`${type}.${contributorIndex}.type`}>
            {({ field, meta, helpers }) => (
              <FieldRoot required invalid={!!meta.error}>
                <SelectRoot
                  value={field.value.length ? [field.value.toLowerCase()] : undefined}
                  onValueChange={(details) => helpers.setValue(details.value[0])}
                  collection={collection}
                  positioning={{ sameWidth: true }}
                >
                  <SelectLabel>{t("form.name.type")}</SelectLabel>
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                  <GenericSelectTrigger>
                    <SelectValueText placeholder={t("form.name.type")} />
                  </GenericSelectTrigger>
                  <SelectPositioner>
                    <SelectContent>
                      {collection.items.map((item) => (
                        <GenericSelectItem key={item.type} item={item}>
                          {item.translation}
                        </GenericSelectItem>
                      ))}
                    </SelectContent>
                  </SelectPositioner>
                  <SelectHiddenSelect data-testid="contributor-selector" />
                </SelectRoot>
              </FieldRoot>
            )}
          </FormField>
          <Button variant="tertiary" onClick={() => onRemove(contributorIndex)}>
            {t("remove")}
            <CloseLine />
          </Button>
        </StyledInnerFieldsetRoot>
      ))}
      <Button variant="secondary" onClick={() => onAddNew({ name: "", type: "" })} data-testid="addContributor">
        {t("form.contributor.add")}
      </Button>
    </StyledFieldsetRoot>
  );
};

export default ContributorsField;
