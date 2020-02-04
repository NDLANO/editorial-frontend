/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import Button from '@ndla/button';
import { Cross } from '@ndla/icons/lib/action';
import styled from '@emotion/styled';

import { Link } from 'react-router-dom';
import { AsyncDropdown } from '../../../components/Dropdown';
import { fetchDraft, searchDrafts } from '../../../modules/draft/draftApi';

import { toEditArticle } from '../../../util/routeHelpers';

import { StyledRemoveConnectionButton } from '../../../style/LearningResourceTaxonomyStyles';

import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';

const StyledFlexWrapper = styled.div`
  display: flex;
`;

const ConceptMetaDataArticle = ({ locale, t, field, articleId }) => {
  const [article, setArticle] = useState(undefined);
  const [modalOpen, setOpen] = useState(false);

  const fetchArticle = async (articleId, locale) => {
    const article = await fetchDraft(articleId, locale);
    const title = convertFieldWithFallback(article, 'title', '');
    setArticle({ ...article, title });
  };

  const searchForArticles = async inp => {
    const articles = (await searchDrafts({
      query: inp,
      language: locale,
    })).results;
    return articles ? articles.filter(article => !!article.id) : [];
  };

  const onSelect = selectedArticle => {
    if (selectedArticle) {
      setSelected(selectedArticle);
      onArticleSelectClose();
    }
  };

  const setSelected = article => {
    setArticle(article);
    field.onChange({
      target: {
        name: field.name,
        value: article?.id || null,
      },
    });
  };

  const onArticleSelectClose = () => {
    setOpen(false);
  };

  const onArticleSelectOpen = () => {
    setOpen(true);
  };

  const removeArticle = () => {
    setSelected(undefined);
  };

  useEffect(() => {
    if (articleId) {
      fetchArticle(articleId, locale);
    }
  }, []);

  return (
    <div>
      <FieldHeader title={t('form.article.label')} />
      <Modal
        controllable
        isOpen={modalOpen}
        size="regular"
        backgroundColor="white"
        minHeight="90vh"
        animationDuration={0}>
        {() => (
          <Fragment>
            <ModalHeader>
              <ModalCloseButton
                title={t('dialog.close')}
                onClick={onArticleSelectClose}
              />
            </ModalHeader>
            <ModalBody>
              <AsyncDropdown
                idField="id"
                name="relatedArticleSearch"
                labelField="title"
                placeholder={t('form.content.relatedArticle.placeholder')}
                label="label"
                apiAction={searchForArticles}
                onClick={e => e.stopPropagation()}
                onChange={onSelect}
              />
            </ModalBody>
          </Fragment>
        )}
      </Modal>
      {article ? (
        <Fragment>
          <StyledFlexWrapper>
            <Link to={toEditArticle(article.id, article.articleType)}>
              <h2 style={{ margin: '0' }}>{article.title}</h2>
            </Link>
            <StyledRemoveConnectionButton type="button" onClick={removeArticle}>
              <Cross />
            </StyledRemoveConnectionButton>
          </StyledFlexWrapper>
        </Fragment>
      ) : (
        <Button onClick={onArticleSelectOpen}>{t('form.article.add')}</Button>
      )}
    </div>
  );
};

ConceptMetaDataArticle.propTypes = {
  locale: PropTypes.string.isRequired,
  field: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
  }),
  articleId: PropTypes.number,
};

export default injectT(ConceptMetaDataArticle);
