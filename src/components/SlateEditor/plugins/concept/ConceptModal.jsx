/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@ndla/modal/lib/Modal';
import { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import Tabs from '@ndla/tabs';
import { Search } from '@ndla/icons/common';
import Pager from '@ndla/pager';
import { searchConcepts } from '../../../../modules/search/searchApi';
import SearchForm from '../../../../../src/containers/SearchPage/components/form/SearchForm';
import { fetchLicenses } from '../../../../modules/draft/draftApi';
import { Portal } from '../../../Portal';
import SearchConceptResults from './SearchConceptResults';
import ConceptForm from '../../../../containers/ConceptPage/components/ConceptForm';
import { ConceptShape, SubjectShape } from '../../../../shapes';

const type = 'concept';

const ConceptModal = ({
  id,
  onClose,
  isOpen,
  tags,
  subjects,
  t,
  locale,
  handleRemove,
  selectedText,
  addConcept,
  updateConcept,
  createConcept,
  concept,
}) => {
  const [searchObject, updateSearchObject] = useState({
    page: 1,
    sort: '-relevance',
    'page-size': 10,
    language: locale,
    query: `${selectedText}`,
  });
  const [licenses, setLicenses] = useState([]);
  const [results, setConcepts] = useState({
    language: locale,
    page: 1,
    pageSize: 10,
    results: [],
    totalCount: 0,
    query: { searchObject },
  });
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [searching, setSearching] = useState(false);

  const updateSelectedTabIndex = index => {
    //Added function because of hooks second argument warning.
    setSelectedTabIndex(index);
  };
  const getAllLicenses = async () => {
    const fetchdLicenses = await fetchLicenses();
    setLicenses(fetchdLicenses);
  };

  useEffect(() => {
    if (licenses.length === 0) {
      getAllLicenses();
    }
    if (id) {
      setSelectedTabIndex(1);
    }
  }, [id]);

  const searchConcept = async searchParam => {
    if (!searching) {
      setSearching(true);
      const concepts = await searchConcepts(searchParam);
      setConcepts(concepts);
      setSearching(false);
      updateSearchObject(searchParam);
    }
  };

  const onConceptUpsert = async upsertedConcept => {
    const savedConcept = !id
      ? await createConcept(upsertedConcept)
      : await updateConcept(upsertedConcept);
    addConcept(savedConcept);
  };

  useEffect(() => {
    searchConcept(searchObject);
  }, []);
  return (
    <Portal isOpened>
      <Modal
        controllable
        isOpen={isOpen}
        onClose={onClose}
        size="large"
        backgroundColor="white"
        minHeight="90vh">
        {() => (
          <div>
            <ModalHeader>
              <ModalCloseButton title={t('dialog.close')} onClick={onClose} />
            </ModalHeader>
            <ModalBody>
              {id && (
                <Button onClick={handleRemove}>
                  {t('form.content.concept.remove')}
                </Button>
              )}
              <Tabs
                onSelect={updateSelectedTabIndex}
                selectedIndex={selectedTabIndex}
                tabs={[
                  {
                    title: t(`searchForm.types.conceptQuery`),
                    content: (
                      <div>
                        <h2>
                          <Search className="c-icon--medium" />
                          {t(`searchPage.header.concept`)}
                        </h2>
                        <SearchForm
                          type={type}
                          search={searchConcept}
                          searchObject={searchObject}
                          locale={locale}
                          location={window.location}
                          subjects={subjects}
                        />
                        <SearchConceptResults
                          searchObject={searchObject}
                          results={results.results}
                          searching={searching}
                          type={type}
                          addConcept={addConcept}
                          locale={locale}
                        />
                        <Pager
                          query={searchObject}
                          page={
                            searchObject.page
                              ? parseInt(searchObject.page, 10)
                              : 1
                          }
                          pathname=""
                          lastPage={Math.ceil(
                            results.totalCount / results.pageSize,
                          )}
                          onClick={searchConcept}
                          pageItemComponentClass="button"
                        />
                      </div>
                    ),
                  },
                  {
                    title: id
                      ? t('form.concept.edit')
                      : t('form.concept.create'),
                    content: (
                      <ConceptForm
                        inModal
                        onClose={onClose}
                        tags={tags}
                        subjects={subjects}
                        licenses={licenses}
                        onUpdate={onConceptUpsert}
                        locale={locale}
                        concept={
                          id
                            ? { ...concept, language: locale }
                            : { title: selectedText, language: locale }
                        }
                      />
                    ),
                  },
                ]}
              />
            </ModalBody>
          </div>
        )}
      </Modal>
    </Portal>
  );
};

ConceptModal.propTypes = {
  id: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  locale: PropTypes.string,
  selectedText: PropTypes.string,
  addConcept: PropTypes.func.isRequired,
  concept: ConceptShape,
  updateConcept: PropTypes.func.isRequired,
  createConcept: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleRemove: PropTypes.func.isRequired,
  subjects: PropTypes.arrayOf(SubjectShape).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default injectT(ConceptModal);
