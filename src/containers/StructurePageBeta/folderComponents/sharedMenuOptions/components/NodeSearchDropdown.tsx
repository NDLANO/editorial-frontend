/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import Downshift, { GetItemPropsOptions } from 'downshift';
import { useState } from 'react';
//@ts-ignore
import { Input, DropdownMenu } from '@ndla/forms';
import { Spinner } from '@ndla/editor';
import { Search } from '@ndla/icons/common';
import { NodeType, NodeTypeValue } from '../../../../../modules/nodes/nodeApiTypes';
import { useTaxonomyVersion } from '../../../../StructureVersion/TaxonomyVersionProvider';
import useDebounce from '../../../../../util/useDebounce';
import { useSearchNodes } from '../../../../../modules/nodes/nodeQueries';

const DropdownWrapper = styled.div`
  position: relative;
  width: 90%;
`;

interface Props {
  placeholder: string;
  filter?: (node: NodeType) => boolean;
  onChange: (node: NodeType) => void;
  searchNodeType?: NodeTypeValue;
}
const NodeSearchDropdown = ({ placeholder, filter, onChange, searchNodeType = 'TOPIC' }: Props) => {
  const { taxonomyVersion } = useTaxonomyVersion();
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const debouncedQuery = useDebounce(query);

  const searchNodeOptions: Parameters<typeof useSearchNodes>['1'] = {
    enabled: debouncedQuery?.length > 1,
    select: res => {
      const nodes = res.results;
      const transformedNodes = nodes.map(node => ({
        ...node,
        description: node.breadcrumbs?.join(' > '),
      }));

      return { ...res, results: transformedNodes, disabled: true };
    },
  };

  const nodesQuery = useSearchNodes(
    { taxonomyVersion, query: debouncedQuery, page, nodeType: searchNodeType },
    searchNodeOptions,
  );
  useSearchNodes(
    { taxonomyVersion, query: debouncedQuery, page: page + 1, nodeType: searchNodeType },
    { ...searchNodeOptions, enabled: searchNodeOptions.enabled },
  );

  return (
    <Downshift
      onInputValueChange={query => setQuery(query)}
      itemToString={(e: NodeType) => e?.name}
      onChange={onChange}>
      {({ getInputProps, getRootProps, getItemProps, ...downShiftProps }) => {
        return (
          <DropdownWrapper {...getRootProps()}>
            <Input
              {...getInputProps({ placeholder })}
              white
              data-testid="inlineDropdownInput"
              iconRight={nodesQuery.isLoading ? <Spinner size="normal" margin="0" /> : <Search />}
            />
            <DropdownMenu
              items={nodesQuery.data?.results ?? []}
              idField="id"
              labelField="name"
              getItemProps={(props: GetItemPropsOptions<NodeType>) =>
                // Hack to disable filtered items
                // eslint-disable-next-line react/prop-types
                getItemProps({ ...props, disabled: !filter?.(props.item) })
              }
              {...downShiftProps}
              positionAbsolute
              totalCount={nodesQuery.data?.totalCount ?? 0}
              page={page}
              handlePageChange={(page: { page: number }) => setPage(page.page)}
              wide
            />
          </DropdownWrapper>
        );
      }}
    </Downshift>
  );
};

export default NodeSearchDropdown;
