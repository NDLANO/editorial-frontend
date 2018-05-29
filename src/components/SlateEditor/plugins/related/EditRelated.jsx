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
import { Portal } from '../../../../components/Portal';
import LightBox from '../../../../components/Lightbox';

const classes = new BEMHelper({
  name: 'related-box',
  prefix: 'c-',
});

class EditRelated extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      showAddExternal: false,
      url: '',
      title: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleInputChange(e) {
    e.preventDefault();
    console.log('onChange', e.target.value);
    this.setState({ [e.target.id]: e.target.value });
  }

  handleKeyPress(e) {
    if (e) {
      e.preventDefault();
      console.log('onKeyPress', e.target.value);
      if (e.key === 'Escape') {
        this.setState({ showAddExternal: false });
      }
      if (e.key === 'Enter') {
        this.props.insertExternal(this.state.url, this.state.title);
      } else this.setState({ [e.target.id]: e.target.value });
    }
  }

  render() {
    const {
      onRemoveClick,
      removeArticle,
      insertExternal,
      items,
      locale,
      onInsertBlock,
      onExit,
      t,
      ...rest
    } = this.props;
    const { title, url } = this.state;
    return (
      <div>
        <Overlay onExit={onExit} />
        <div {...classes()} {...rest}>
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
            <div>{t('taxonomy.or')}</div>
            <Button onClick={() => this.setState({ showAddExternal: true })}>
              Legg til ekstern artikkel
            </Button>
          </div>
          <Button
            stripped
            onClick={onRemoveClick}
            {...classes('delete-button')}>
            <Cross />
          </Button>
        </div>
        <Portal isOpened={this.state.showAddExternal}>
          <LightBox onClose={onExit}>
            <input
              type="text"
              id="url"
              data-testid="addResourceUrlInput"
              onChange={this.handleInputChange}
              value={url}
              placeholder={t('form.content.relatedArticle.urlPlaceholder')}
            />
            <input
              type="text"
              id="title"
              value={title}
              onChange={this.handleInputChange}
              placeholder={t('form.content.relatedArticle.titlePlaceholder')}
            />
            <Button onClick={() => insertExternal(url, title)}>Legg til</Button>
          </LightBox>
        </Portal>
      </div>
    );
  }
}

EditRelated.propTypes = {
  onRemoveClick: PropTypes.func,
  removeArticle: PropTypes.func,
  onExit: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.object),
  onInsertBlock: PropTypes.func,
  locale: PropTypes.string,
  insertExternal: PropTypes.func,
};

export default injectT(EditRelated);
