/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { FieldArray, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { FieldErrorMessage, Fieldset, InputV3, Label, Legend, Select } from "@ndla/forms";
import { contributorGroups, contributorTypes } from "@ndla/licenses";
import { IAuthor } from "@ndla/types-backend/draft-api";
import FieldRemoveButton from "../../../components/Field/FieldRemoveButton";
import { FormControl, FormField } from "../../../components/FormField";

type ContributorType = keyof typeof contributorGroups;

interface Props {
  contributorTypes: readonly ContributorType[];
  width?: number;
}

interface ContributorTypeItem {
  translation: string;
  type: string;
}

interface ContributorTypes {
  creators: IAuthor[];
  processors: IAuthor[];
  rightsholders: IAuthor[];
}

const RootFieldset = styled(Fieldset)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${spacing.small};
`;

const StyledFieldset = styled(Fieldset)`
  display: flex;
  gap: ${spacing.small};
  align-items: flex-start;
  width: 100%;
  div {
    width: 100%;
  }
  button {
    align-self: center;
  }
`;

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

  const contributorTypeItems = contributorGroups[type].map((item: string) => ({
    type: item,
    translation: contributorTypes[i18n.language] ? contributorTypes[i18n.language][item] : contributorTypes.nb[item],
  }));

  return (
    <RootFieldset data-testid={`contributor-fieldset`}>
      <Legend>{t(`form.${type}.label`)}</Legend>
      {values[type].map((_: IAuthor, contributorIndex: number) => (
        <StyledFieldset key={`${type}.${contributorIndex}`}>
          <Legend visuallyHidden>
            {t(`form.${type}.label`)} {contributorIndex + 1}
          </Legend>
          <FormField name={`${type}.${contributorIndex}.name`}>
            {({ field, meta }) => (
              <FormControl isRequired isInvalid={!!meta.error}>
                <Label margin="none" textStyle="label-small">
                  {t("form.name.name")}
                </Label>
                <InputV3
                  {...field}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus={!meta.touched}
                />
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FormControl>
            )}
          </FormField>
          <FormField name={`${type}.${contributorIndex}.type`}>
            {({ field, meta }) => (
              <FormControl isRequired isInvalid={!!meta.error}>
                <Label margin="none" textStyle="label-small">
                  {t("form.name.type")}
                </Label>
                <Select {...field} value={field.value.toLowerCase()} data-testid="contributor-selector">
                  <option value="" />
                  {contributorTypeItems.map((item: ContributorTypeItem) => (
                    <option value={item.type} key={item.type}>
                      {item.translation}
                    </option>
                  ))}
                </Select>
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FormControl>
            )}
          </FormField>
          <FieldRemoveButton onClick={() => onRemove(contributorIndex)}>{t("remove")}</FieldRemoveButton>
        </StyledFieldset>
      ))}
      <ButtonV2 variant="outline" onClick={() => onAddNew({ name: "", type: "" })} data-testid="addContributor">
        {t("form.contributor.add")}
      </ButtonV2>
    </RootFieldset>
  );
};

export default ContributorsField;
