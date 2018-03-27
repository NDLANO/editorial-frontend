/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button, RelatedArticle } from 'ndla-ui';
import { Cross } from 'ndla-icons/action';
import get from 'lodash/fp/get';
import { searchRelatedArticles } from '../../../../modules/article/articleApi';
import AsyncDropdown from '../../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import Overlay from '../../../../components/Overlay';
import { mapping } from '../utils/relatedArticleMapping';
import { toEditArticle } from '../../../../util/routeHelpers';

const classes = new BEMHelper({
  name: 'related-box',
  prefix: 'c-',
});

const EditRelated = ({
  onRemoveClick,
  removeArticle,
  items,
  resourceType,
  locale,
  onInsertBlock,
  onExit,
}) => (
  <div>
    <Overlay onExit={onExit} />
    <div {...classes()}>
      {items.map(
        (item, i) =>
          !item.id ? (
            'Invalid article'
          ) : (
            <div key={item.id} {...classes('article')}>
              <RelatedArticle
                {...mapping(resourceType(item).id)}
                title={get('title.title', item)}
                introduction={get('metaDescription.metaDescription', item)}
                to={toEditArticle(item.id, 'standard', locale)}
              />
              <Button
                stripped
                onClick={e => removeArticle(i, e)}
                {...classes('delete-button')}>
                <Cross />
              </Button>
            </div>
          ),
      )}
      <div {...classes('article')}>
        {' '}
        <AsyncDropdown
          valueField="id"
          name="relatedArticleSearch"
          textField="title"
          placeholder={'Søk på tittel'}
          label={'label'}
          apiAction={async inp => {
            const res = await searchRelatedArticles(inp, locale);
            return res
              .map(curr => ({
                id: curr.id,
                title: curr.title ? curr.title.title : '',
              }))
              .filter(it => !!it.id);
          }}
          onClick={e => e.stopPropagation()}
          messages={{
            emptyFilter: 'empty',
            emptyList: 'empty list',
          }}
          onChange={selected => selected && onInsertBlock(selected.id)}
        />
      </div>
      <Button stripped onClick={onRemoveClick} {...classes('delete-button')}>
        <Cross />
      </Button>
    </div>
  </div>
);

EditRelated.propTypes = {
  onRemoveClick: PropTypes.func,
  removeArticle: PropTypes.func,
  onExit: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.object),
  resourceType: PropTypes.func,
  onInsertBlock: PropTypes.func,
  locale: PropTypes.string,
};

export default EditRelated;
