/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComboboxLabel } from "@ndla/primitives";
import { Node, NodeType } from "@ndla/types-backend/taxonomy-api";
import { useQuery } from "@tanstack/react-query";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../../../components/abstractions/Combobox";
import { GenericSearchCombobox } from "../../../../../components/Form/GenericSearchCombobox";
import { searchNodesQueryOptions } from "../../../../../modules/nodes/nodeQueries";
import { usePaginatedQuery } from "../../../../../util/usePaginatedQuery";
import { useTaxonomyVersion } from "../../../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  placeholder: string;
  filter?: (node: Node) => boolean;
  onChange: (node: Node) => void;
  searchNodeType?: NodeType;
  label: string;
  labelHidden?: boolean;
}
const NodeSearchDropdown = ({ placeholder, filter, onChange, searchNodeType = "TOPIC", label, labelHidden }: Props) => {
  const { taxonomyVersion } = useTaxonomyVersion();
  const { query, delayedQuery, setQuery, page, setPage } = usePaginatedQuery();

  const searchQuery = useQuery(
    searchNodesQueryOptions({
      taxonomyVersion,
      nodeType: [searchNodeType],
      page,
      query: delayedQuery,
    }),
  );

  return (
    <GenericSearchCombobox
      items={searchQuery.data?.results ?? []}
      itemToString={(item) => item.name}
      itemToValue={(item) => item.id}
      isItemDisabled={(item) => !filter?.(item)}
      paginationData={searchQuery.data}
      onValueChange={(details) => onChange(details.items[0])}
      inputValue={query}
      onInputValueChange={(details) => setQuery(details.inputValue)}
      isSuccess={searchQuery.isSuccess}
      onPageChange={(details) => setPage(details.page)}
      css={{ width: "100%" }}
      renderItem={(item) => (
        <GenericComboboxItemContent title={item.name} description={item.breadcrumbs?.join(" > ")} />
      )}
    >
      <ComboboxLabel srOnly={labelHidden}>{label}</ComboboxLabel>
      <GenericComboboxInput placeholder={placeholder} isFetching={searchQuery.isFetching} />
    </GenericSearchCombobox>
  );
};

export default NodeSearchDropdown;
