/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import Button from '@ndla/button';
import { Cross } from '@ndla/icons/lib/action';
import styled from '@emotion/styled';

import { Link } from 'react-router-dom';
import { AsyncDropdown } from '../../../components/Dropdown';
import { searchDrafts } from '../../../modules/draft/draftApi';

import { toEditArticle } from '../../../util/routeHelpers';

import { StyledRemoveConnectionButton } from '../../../style/LearningResourceTaxonomyStyles';

import { convertFieldWithFallback } from '../../../util/convertFieldWithFallback';

const StyledFlexWrapper = styled.div`
  display: flex;
`;

const ConceptMetaDataArticle = ({ locale, t, field }) => {
  const [article, setArticle] = useState(undefined);
  const [modalOpen, setOpen] = useState(false);
  const [title, setTitle] = useState('');

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
      setTitle(convertFieldWithFallback(selectedArticle, 'title', ''));
      onArticleSelectClose();
    }
  };

  const setSelected = article => {
    setArticle(article);
    field.onChange({
      target: {
        name: field.name,
        value: article.id,
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

  return (
    <div>
      <FieldHeader title={t('form.article.label')} />
      <Modal
        controllable
        isOpen={modalOpen}
        onClose={onArticleSelectClose}
        size="regular"
        backgroundColor="white"
        minHeight="90vh">
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
                positionAbsolute
              />
            </ModalBody>
          </Fragment>
        )}
      </Modal>
      {article ? (
        <Fragment>
          <StyledFlexWrapper>
            <Link to={toEditArticle(article.id, article.articleType, locale)}>
              {' '}
              <h2 style={{ margin: '0' }}>{title}</h2>{' '}
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
};

export default injectT(ConceptMetaDataArticle);
