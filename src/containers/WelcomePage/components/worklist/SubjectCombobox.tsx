/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import sortBy from "lodash/sortBy";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Combobox, createListCollection } from "@ark-ui/react";
import { CloseLine } from "@ndla/icons/action";
import { ArrowDownShortLine } from "@ndla/icons/common";
import { CheckLine } from "@ndla/icons/editor";
import {
  Text,
  ComboboxClearTrigger,
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxTrigger,
  IconButton,
  Input,
  InputContainer,
  Spinner,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useComboboxTranslations } from "@ndla/ui";
import { SUBJECT_NODE } from "../../../../modules/nodes/nodeApiTypes";
import { useSearchNodes } from "../../../../modules/nodes/nodeQueries";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { SelectItem as SelectItemType } from "../../types";

const SpinnerWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "center",
  },
});

const StyledInputContainer = styled(InputContainer, {
  base: {
    boxShadowColor: "stroke.default",
  },
});

interface Props {
  subjectIds: string[];
  filterSubject: SelectItemType | undefined;
  setFilterSubject: (fs: SelectItemType) => void;
  removeArchived?: boolean;
  placeholder?: string;
}

const SubjectCombobox = ({
  subjectIds,
  filterSubject,
  setFilterSubject,
  removeArchived = false,
  placeholder,
}: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<string[] | undefined>(undefined);
  const [enableSearch, setEnableSearch] = useState(false);
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const translations = useComboboxTranslations();

  useEffect(() => {
    setValue(filterSubject ? [filterSubject.value] : undefined);
    setInputValue(filterSubject ? filterSubject.label : "");
  }, [filterSubject]);

  const { data: subjects, isLoading } = useSearchNodes(
    {
      ids: subjectIds,
      taxonomyVersion,
      nodeType: SUBJECT_NODE,
      pageSize: subjectIds.length,
      language: i18n.language,
    },
    {
      select: (res) => ({
        ...res,
        results: sortBy(res.results, (r) => r.name),
      }),
      enabled: !!subjectIds.length && enableSearch,
    },
  );
  const initialData = useMemo(() => {
    if (subjects?.results.length) {
      let updatedArchived;
      if (removeArchived) {
        updatedArchived = subjects.results.filter((s) => s.metadata.customFields.subjectCategory !== "archive");
      } else {
        updatedArchived = sortBy(subjects.results, (r) => r.metadata.customFields.subjectCategory === "archive");
      }
      return updatedArchived.map((r) => ({ value: r.id, label: r.name }));
    } else return [];
  }, [removeArchived, subjects]);

  const [items, setItems] = useState(initialData);

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  const collection = useMemo(() => {
    return createListCollection({
      items,
    });
  }, [items]);

  const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
    setInputValue(details.inputValue);
    setItems(initialData.filter((item) => item.label.toLowerCase().includes(details.inputValue.toLowerCase())));
  };

  return (
    <ComboboxRoot
      key={value?.[0]}
      collection={collection}
      inputValue={inputValue}
      onInputValueChange={handleInputChange}
      translations={translations}
      onFocus={() => {
        if (!enableSearch) setEnableSearch(true);
      }}
      value={value}
      onValueChange={(details) => {
        setValue(details.value);
        setFilterSubject(details.items[0]);
      }}
      selectionBehavior="preserve"
    >
      <ComboboxLabel srOnly>{placeholder ?? t("welcomePage.chooseSubject")}</ComboboxLabel>
      <ComboboxControl>
        <StyledInputContainer>
          <ComboboxInput asChild>
            <Input placeholder={placeholder ?? t("welcomePage.chooseSubject")} componentSize="small" />
          </ComboboxInput>
          <ComboboxClearTrigger asChild>
            <IconButton variant="clear" size="small">
              <CloseLine />
            </IconButton>
          </ComboboxClearTrigger>
        </StyledInputContainer>
        <ComboboxTrigger asChild>
          <IconButton variant="secondary" size="small">
            <ArrowDownShortLine />
          </IconButton>
        </ComboboxTrigger>
      </ComboboxControl>
      <ComboboxContent>
        {/*TODO: Evaluate if this needs to be made accessible (?) */}
        {isLoading ? (
          <SpinnerWrapper>
            <Spinner />
          </SpinnerWrapper>
        ) : !collection.items.length ? (
          <Text>{t("form.responsible.noResults")}</Text>
        ) : (
          collection.items.map((item) => (
            <ComboboxItem key={item.value} item={item}>
              <ComboboxItemText>{item.label}</ComboboxItemText>
              <ComboboxItemIndicator>
                <CheckLine />
              </ComboboxItemIndicator>
            </ComboboxItem>
          ))
        )}
      </ComboboxContent>
    </ComboboxRoot>
  );
};

export default SubjectCombobox;
