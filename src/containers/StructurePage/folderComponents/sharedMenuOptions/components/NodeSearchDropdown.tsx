/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node, NodeType } from '@ndla/types-taxonomy';
import { useTaxonomyVersion } from '../../../../StructureVersion/TaxonomyVersionProvider';
import { useSearchNodes } from '../../../../../modules/nodes/nodeQueries';
import SearchDropdown from './SearchDropdown';

interface Props {
  placeholder: string;
  filter?: (node: Node) => boolean;
  onChange: (node: Node) => void;
  searchNodeType?: NodeType;
  id?: string;
}
const NodeSearchDropdown = ({
  placeholder,
  filter,
  onChange,
  searchNodeType = 'TOPIC',
  id = 'search-dropdown',
}: Props) => {
  const { taxonomyVersion } = useTaxonomyVersion();

  return (
    <SearchDropdown
      id={id}
      onChange={onChange}
      placeholder={placeholder}
      useQuery={useSearchNodes}
      params={{ taxonomyVersion, nodeType: searchNodeType }}
      transform={(res) => {
        return {
          ...res,
          results: res.results.map((r) => ({
            originalItem: r,
            id: r.id,
            name: r.name,
            description: r.breadcrumbs?.join(' > '),
            disabled: !filter?.(r),
          })),
        };
      }}
    />
  );
};

export default NodeSearchDropdown;
