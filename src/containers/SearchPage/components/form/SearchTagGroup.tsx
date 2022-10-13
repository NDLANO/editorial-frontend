/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SearchTag from './SearchTag';
import { SearchParams } from './SearchForm';
import { SearchFormSelector } from './GenericSearchForm';

export interface TagType {
  type: keyof SearchParams;
  name?: string;
  formElementType: SearchFormSelector['formElementType'];
}

interface Props {
  tagTypes: TagType[];
  onRemoveItem: (tag: TagType) => void;
}

const SearchTagGroup = ({ tagTypes, onRemoveItem }: Props) => {
  return (
    <>
      {tagTypes.map((tag: TagType) => {
        if (!tag.name) return null;
        return <SearchTag key={`searchtag_${tag.type}`} onRemoveItem={onRemoveItem} tag={tag} />;
      })}
    </>
  );
};

export default SearchTagGroup;
