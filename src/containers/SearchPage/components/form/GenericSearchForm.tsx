/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CSSProperties, FormEvent, Fragment, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { Button, Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IUserData } from "@ndla/types-backend/draft-api";
import { SearchParams } from "./SearchForm";
import SearchTagGroup from "./SearchTagGroup";
import Selector, { SearchFormSelector, TextInputSelectorType } from "./Selector";
import { SearchType } from "../../../../interfaces";
import { DateChangedEvent } from "../../../FormikForm/components/InlineDatePicker";
import SearchSaveButton from "../../SearchSaveButton";

const ButtonContainer = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    gridColumn: "-1/1",
  },
});

const StyledForm = styled("form", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(var(--column-count), 1fr)",
    gridGap: "3xsmall",
    alignItems: "center",
    tabletDown: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
});

const StyledSearchHeader = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});

const StyledTagLine = styled("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
  },
});

const StyledButton = styled(Button, {
  base: {
    minWidth: "surface.4xsmall",
  },
});

type FormEvents = FormEvent<HTMLInputElement> | FormEvent<HTMLSelectElement>;
type FieldChangedEvent = FormEvents | DateChangedEvent;

export type OnFieldChangeFunction = <T extends keyof SearchParams>(
  name: T,
  value: SearchParams[T],
  event?: FieldChangedEvent,
) => void;

interface Props {
  type: SearchType;
  selectors: SearchFormSelector[];
  query: string;
  searchObject: SearchParams;
  onSubmit: () => void;
  onFieldChange: OnFieldChangeFunction;
  emptySearch: (evt: MouseEvent<HTMLButtonElement>) => void;
  removeTag: (tag: SearchFormSelector) => void;
  userData: IUserData | undefined;
  disableSavedSearch?: boolean;
  columnCount?: number;
}

const GenericSearchForm = ({
  type,
  selectors: baseSelectors,
  query,
  onSubmit,
  searchObject,
  onFieldChange,
  emptySearch,
  removeTag,
  userData,
  disableSavedSearch,
  columnCount = 2,
}: Props) => {
  const { t } = useTranslation();

  const baseQuery: TextInputSelectorType = {
    parameterName: "query",
    formElementType: "text-input",
  };

  const selectors: SearchFormSelector[] = [{ ...baseQuery, value: query }, ...baseSelectors];

  const tags: SearchFormSelector[] = [
    {
      ...baseQuery,
      value: searchObject.query,
    },
    ...baseSelectors,
  ];

  return (
    <>
      {!disableSavedSearch && (
        <StyledSearchHeader>
          <Heading textStyle="title.large">{t(`searchPage.header.${type}`)}</Heading>
          <SearchSaveButton userData={userData} selectors={selectors} searchContentType={type} />
        </StyledSearchHeader>
      )}
      <StyledForm
        style={
          {
            "--column-count": columnCount,
          } as CSSProperties
        }
        onSubmit={(e) => {
          onSubmit();
          e.preventDefault();
        }}
      >
        {selectors.map((selector) => {
          return (
            <Fragment key={`search-form-field-${selector.parameterName}`}>
              <Selector searchObject={searchObject} selector={selector} onFieldChange={onFieldChange} formType={type} />
            </Fragment>
          );
        })}
        <ButtonContainer>
          <StyledButton onClick={emptySearch} variant="secondary" size="small">
            {t("searchForm.empty")}
          </StyledButton>
          <StyledButton type="submit" size="small">
            {t("searchForm.btn")}
          </StyledButton>
        </ButtonContainer>
      </StyledForm>
      <StyledTagLine>
        <SearchTagGroup onRemoveTag={removeTag} tagTypes={tags} />
      </StyledTagLine>
    </>
  );
};

export default GenericSearchForm;
