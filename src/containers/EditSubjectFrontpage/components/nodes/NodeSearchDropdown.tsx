/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { ComboboxLabel } from "@ndla/primitives";
import { Node } from "@ndla/types-taxonomy";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../../components/abstractions/Combobox";
import { GenericSearchCombobox } from "../../../../components/Form/GenericSearchCombobox";
import { useSearchNodes } from "../../../../modules/nodes/nodeQueries";
import { usePaginatedQuery } from "../../../../util/usePaginatedQuery";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  onChange: (t: Node) => void;
  selectedItems: Node[];
  label: string;
}

export const NodeSearchDropdown = ({ onChange, selectedItems, label }: Props) => {
  const { query, delayedQuery, setQuery, page, setPage } = usePaginatedQuery();
  const { t } = useTranslation();

  const { taxonomyVersion } = useTaxonomyVersion();

  const searchQuery = useSearchNodes(
    {
      taxonomyVersion,
      query: delayedQuery,
      page,
      nodeType: ["SUBJECT"],
    },
    { placeholderData: (prev) => prev },
  );

  return (
    <GenericSearchCombobox
      items={searchQuery.data?.results ?? []}
      itemToString={(item) => item.name}
      itemToValue={(item) => item.id}
      onValueChange={(details) => {
        const newItem = details.items[0];
        if (!newItem) return;
        onChange(newItem);
      }}
      paginationData={searchQuery.data}
      isSuccess={searchQuery.isSuccess}
      inputValue={query}
      onInputValueChange={(details) => setQuery(details.inputValue)}
      onPageChange={(details) => setPage(details.page)}
      value={selectedItems.map((item) => item.id)}
      selectionBehavior="preserve"
      closeOnSelect={false}
      css={{ width: "100%" }}
      renderItem={(item) => (
        <GenericComboboxItemContent title={item.name} description={item.breadcrumbs?.join(" > ")} />
      )}
    >
      <ComboboxLabel>{label}</ComboboxLabel>
      <GenericComboboxInput placeholder={t("subjectpageForm.addSubject")} isFetching={searchQuery.isFetching} />
    </GenericSearchCombobox>
  );
};
