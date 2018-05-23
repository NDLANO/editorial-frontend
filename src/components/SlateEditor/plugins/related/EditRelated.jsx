/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import { Cross } from 'ndla-icons/action';
import { searchRelatedArticles } from '../../../../modules/article/articleApi';
import AsyncDropdown from '../../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import Overlay from '../../../../components/Overlay';
import RelatedArticle from './RelatedArticle';

const classes = new BEMHelper({
  name: 'related-box',
  prefix: 'c-',
});

const EditRelated = ({
  onRemoveClick,
  removeArticle,
  items,
  locale,
  onInsertBlock,
  onExit,
  t,
}) => (
  <div>
    <Overlay onExit={onExit} />
    <div {...classes()}>
      {items.map(
        (item, i) =>
          !item.id ? (
            t('orm.content.relatedArticle.invalidArticle')
          ) : (
            <div key={item.id} {...classes('article')}>
              <RelatedArticle locale={locale} item={item} />
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
          placeholder={t('form.content.relatedArticle.placeholder')}
          label="label"
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
            emptyFilter: t('form.content.relatedArticle.emptyFilter'),
            emptyList: t('form.content.relatedArticle.emptyList'),
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
  onInsertBlock: PropTypes.func,
  locale: PropTypes.string,
};

export default injectT(EditRelated);
