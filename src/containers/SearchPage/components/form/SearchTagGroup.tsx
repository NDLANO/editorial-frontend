/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import SearchTag, { MinimalTagType } from './SearchTag';

interface TagType {
  type: string;
  id: string;
  name?: string;
}

interface Props {
  tagTypes: TagType[];
  onRemoveItem: (tag: MinimalTagType) => void;
}

const SearchTagGroup = ({ tagTypes, onRemoveItem }: Props) => {
  return (
    <Fragment>
      {tagTypes.map((tag: TagType) => {
        if (!tag.name) return null;
        return (
          <SearchTag
            key={`searchtag_${tag.type}`}
            onRemoveItem={onRemoveItem}
            tag={tag}
          />
        );
      })}
    </Fragment>
  );
};

export default SearchTagGroup;
