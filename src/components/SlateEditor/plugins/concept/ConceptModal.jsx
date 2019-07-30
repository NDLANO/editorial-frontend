/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import Button from '@ndla/button';
import Modal from '@ndla/modal/lib/Modal';
import { ModalHeader, ModalBody } from '@ndla/modal';
import ModalCloseButton from '@ndla/modal/lib/ModalCloseButton';
import { injectT } from '@ndla/i18n';
import { Search } from '@ndla/icons/common';
import Pager from '@ndla/pager';
//import { toConcept } from '../../../../util/routeHelpers';
import { toSearch } from '../../../../util/routeHelpers';
import SearchList from '../../../../../src/containers/SearchPage/components/results/SearchList';
import SearchListOptions from '../../../../../src/containers/SearchPage/components/results/SearchListOptions';
import SearchForm from '../../../../../src/containers/SearchPage/components/form/SearchForm';
import SearchSort from '../../../../../src/containers/SearchPage/components/sort/SearchSort';

const ConceptModal = ({ accessToken, id, onClose, t, name, handleMessage , locale, searching, totalCount, lastPage, type}) => {
  useEffect(() => {
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  });

  const [mode, setMode] = useState(id ? 'edit' : 'search');

  /*const {
    searching,
    results,
    lastPage,
    totalCount,
    } = this.props;*/

  //const type = 'concept'
  //const locale = 'nb'

  const searchObject = toSearch(
    { page: '1', sort: '-relevance', 'page-size': 10, 'query': 'vi' },
    'concept',
  )

  return (
    <Modal
      controllable
      isOpen={true}
      size="large"
      backgroundColor="white"
      minHeight="90vh">
      {() => (
        <div css={modalStyles}>
          <ModalHeader>
            <StyledHeader>
              {t('form.concept.addConcept')}
            </StyledHeader>
            <ModalCloseButton title={t('dialog.close')} onClick={onClose} />
          </ModalHeader>
          <ModalBody>
            {mode === 'search' && (
              <StyledModalButtons>
                <span>{t('form.concept.addText')}</span>
                <Button
                  onClick={() => {
                    setMode('create');
                  }}>
                  {t('form.concept.create')}
                </Button>
              </StyledModalButtons>
            )}
            
            <h2>
              <Search className="c-icon--medium" />
              {t(`searchPage.header.${type}`)}
            </h2>
            <SearchForm
              type={type}
              //search={this.onQueryPush}
              searchObject={searchObject}
              locale={locale}
            />
            {/*type === 'content' && (
              <SearchSort
                onSortOrderChange={this.onSortOrderChange}
              />
            )*/}
            <SearchListOptions
              type={type}
              searchObject={searchObject}
              totalCount={totalCount}
              //search={this.onQueryPush}
            />
            <SearchList
              searchObject={searchObject}
              results={[]}
              searching={searching}
              type={type}
              locale={locale}
            />
            <Pager
              page={searchObject.page ? parseInt(searchObject.page, 10) : 1}
              lastPage={lastPage}
              query={searchObject}
              //onClick={this.onQueryPush}
            />

          </ModalBody>
        </div>
      )}
    </Modal>
  );
};


const StyledModalButtons = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  & > span {
    margin: 0 20px;
  }
`;

const StyledHeader = styled.h1`
  align-self: flex-start;
`;

const modalStyles = css`
  height: 90vh;

  & > .modal-body {
    height: 84vh;
  }

  & > .modal-header {
    height: 6vh;
  }
`;

ConceptModal.propTypes = {
  accessToken: PropTypes.string,
  id: PropTypes.number,
  onClose: PropTypes.func,
  handleMessage: PropTypes.func,
  name: PropTypes.string,
};

export default injectT(ConceptModal);
