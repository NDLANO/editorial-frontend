/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import Modal from '@ndla/modal/lib/Modal';
import { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import Tabs from '@ndla/tabs';
import { Search } from '@ndla/icons/common';
import Pager from '@ndla/pager';

import { searchConcepts } from '../../../../modules/concept/conceptApi';
import SearchForm from '../../../../containers/SearchPage/components/form/SearchForm';
import { Portal } from '../../../Portal';
import SearchConceptResults from './SearchConceptResults';
import ConceptForm from '../../../../containers/ConceptPage/ConceptForm/ConceptForm';
import { ConceptShape, SubjectShape } from '../../../../shapes';
import {
  ConceptApiType,
  ConceptPatchType,
  ConceptPostType,
  ConceptQuery,
  ConceptSearchResult,
  ConceptTagsSearchResult,
} from '../../../../modules/concept/conceptApiInterfaces';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { createGuard } from '../../../../util/guards';
import { DraftApiType } from '../../../../modules/draft/draftApiInterfaces';

const type = 'concept';

interface Props {
  addConcept: (concept: ConceptApiType) => void;
  concept?: ConceptApiType;
  createConcept: (createdConcept: ConceptPostType) => Promise<ConceptApiType>;
  fetchSearchTags: (input: string, language: string) => Promise<ConceptTagsSearchResult>;
  handleRemove: () => void;
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  selectedText: string;
  subjects: SubjectType[];
  updateConcept: (updatedConcept: ConceptPatchType) => Promise<ConceptApiType>;
  conceptArticles: DraftApiType[];
}

const isConceptPatchType = createGuard<ConceptPatchType>('id');

const ConceptModal = ({
  onClose,
  isOpen,
  subjects,
  locale,
  handleRemove,
  selectedText,
  addConcept,
  updateConcept,
  createConcept,
  concept,
  fetchSearchTags,
  conceptArticles,
}: Props) => {
  const { t } = useTranslation();
  const [searchObject, updateSearchObject] = useState<ConceptQuery>({
    page: 1,
    sort: '-relevance',
    'page-size': 10,
    language: locale,
    query: `${selectedText}`,
  });
  const [results, setConcepts] = useState<ConceptSearchResult>({
    language: locale,
    page: 1,
    pageSize: 10,
    results: [],
    totalCount: 0,
  });
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [searching, setSearching] = useState(false);

  const updateSelectedTabIndex = (index: number) => {
    //Added function because of hooks second argument warning.
    setSelectedTabIndex(index);
  };

  const searchConcept = async (searchParam: ConceptQuery) => {
    if (!searching) {
      setSearching(true);
      const concepts = await searchConcepts(searchParam);
      setConcepts(concepts);
      setSearching(false);
      updateSearchObject(searchParam);
    }
  };

  const onConceptUpsert = async (upsertedConcept: ConceptPostType | ConceptPatchType) => {
    const savedConcept = isConceptPatchType(upsertedConcept)
      ? await updateConcept(upsertedConcept)
      : await createConcept(upsertedConcept);
    addConcept(savedConcept);
    return savedConcept;
  };

  useEffect(() => {
    searchConcept(searchObject);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
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
              {concept?.id && (
                <Button onClick={handleRemove}>{t('form.content.concept.remove')}</Button>
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
                          search={debounce(searchConcept, 400)}
                          searchObject={searchObject}
                          locale={locale}
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
                          page={searchObject.page ?? 1}
                          pathname=""
                          lastPage={Math.ceil(results.totalCount / results.pageSize)}
                          onClick={searchConcept}
                          pageItemComponentClass="button"
                        />
                      </div>
                    ),
                  },
                  {
                    title: t('form.concept.create'),
                    content: (
                      <ConceptForm
                        inModal
                        onClose={onClose}
                        subjects={subjects}
                        onUpdate={onConceptUpsert}
                        language={locale}
                        fetchConceptTags={fetchSearchTags}
                        concept={concept}
                        conceptArticles={conceptArticles}
                        initialTitle={selectedText}
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
  addConcept: PropTypes.func.isRequired,
  concept: ConceptShape,
  createConcept: PropTypes.func.isRequired,
  fetchSearchTags: PropTypes.func,
  fetchStatusStateMachine: PropTypes.func,
  handleRemove: PropTypes.func.isRequired,
  id: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  locale: PropTypes.string,
  selectedText: PropTypes.string,
  updateConcept: PropTypes.func.isRequired,
  subjects: PropTypes.arrayOf(SubjectShape).isRequired,
};

export default ConceptModal;
