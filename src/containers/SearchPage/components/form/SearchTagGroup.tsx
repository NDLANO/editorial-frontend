/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import SearchTag from "./SearchTag";
import { SearchFormSelector } from "./Selector";

interface Props {
  tagTypes: SearchFormSelector[];
  onRemoveItem: (tag: SearchFormSelector) => void;
}

const SearchTagGroup = ({ tagTypes, onRemoveItem }: Props) => {
  return (
    <>
      {tagTypes.map((tag) => {
        if (!tag.value) return null;
        return <SearchTag key={`searchtag_${tag.parameterName}`} onRemoveItem={onRemoveItem} tag={tag} />;
      })}
    </>
  );
};

export default SearchTagGroup;
