/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash/debounce';
import { ModalHeader, ModalBody } from '@ndla/modal';
import {
  IConcept,
  IConceptSearchResult,
  INewConcept,
  IUpdatedConcept,
  ITagsSearchResult,
  IConceptSummary,
} from '@ndla/types-backend/concept-api';
import { IArticle } from '@ndla/types-backend/draft-api';
import { useTranslation } from 'react-i18next';
import { ButtonV2, CloseButton } from '@ndla/button';
import Tabs from '@ndla/tabs';
import { Search } from '@ndla/icons/common';
import Pager from '@ndla/pager';

import { searchConcepts } from '../../../../modules/concept/conceptApi';
import SearchForm from '../../../../containers/SearchPage/components/form/SearchForm';
import SearchConceptResults from './SearchConceptResults';
import ConceptForm from '../../../../containers/ConceptPage/ConceptForm/ConceptForm';
import { ConceptQuery } from '../../../../modules/concept/conceptApiInterfaces';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';

const type = 'concept';

interface Props {
  addConcept: (concept: IConceptSummary | IConcept) => void;
  concept?: IConcept;
  createConcept: (createdConcept: INewConcept) => Promise<IConcept>;
  fetchSearchTags: (input: string, language: string) => Promise<ITagsSearchResult>;
  handleRemove: () => void;
  onClose: () => void;
  locale: string;
  selectedText?: string;
  subjects: SubjectType[];
  updateConcept: (id: number, updatedConcept: IUpdatedConcept) => Promise<IConcept>;
  conceptArticles: IArticle[];
}

const ConceptModalContent = ({
  onClose,
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
  const [results, setConcepts] = useState<IConceptSearchResult>({
    language: locale,
    page: 1,
    pageSize: 10,
    results: [],
    totalCount: 0,
  });
  const [searching, setSearching] = useState(false);

  const searchConcept = useCallback(async (searchParam: ConceptQuery) => {
    if (!searching) {
      setSearching(true);
      const concepts = await searchConcepts(searchParam);
      setConcepts(concepts);
      setSearching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upsertProps = concept
    ? {
        onUpdate: (updatedConcept: IUpdatedConcept) => updateConcept(concept.id, updatedConcept),
      }
    : { onCreate: createConcept };

  useEffect(() => {
    searchConcept(searchObject);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const debouncedSearchConcept = useMemo(
    () => debounce((params: ConceptQuery) => searchConcept(params), 400),
    [searchConcept],
  );
  return (
    <div>
      <ModalHeader>
        <CloseButton title={t('dialog.close')} onClick={onClose} />
      </ModalHeader>
      <ModalBody>
        {concept?.id && (
          <ButtonV2 onClick={handleRemove}>{t('form.content.concept.remove')}</ButtonV2>
        )}
        <Tabs
          tabs={[
            {
              title: t(`searchForm.types.conceptQuery`),
              id: 'concepts',
              content: (
                <div>
                  <h2>
                    <Search className="c-icon--medium" />
                    {t(`searchPage.header.concept`)}
                  </h2>
                  <SearchForm
                    type={type}
                    search={(params) => {
                      updateSearchObject(params);
                      debouncedSearchConcept(params);
                    }}
                    searchObject={searchObject}
                    locale={locale}
                    subjects={subjects}
                  />
                  <SearchConceptResults
                    searchObject={searchObject}
                    results={results.results}
                    searching={searching}
                    addConcept={addConcept}
                  />
                  <Pager
                    query={searchObject}
                    page={results.page ?? 1}
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
              id: 'newConcept',
              content: (
                <ConceptForm
                  onUpserted={addConcept}
                  inModal
                  onClose={onClose}
                  subjects={subjects}
                  upsertProps={upsertProps}
                  language={locale}
                  fetchConceptTags={fetchSearchTags}
                  concept={concept}
                  conceptArticles={conceptArticles}
                  initialTitle={selectedText}
                  supportedLanguages={concept?.supportedLanguages ?? [locale]}
                />
              ),
            },
          ]}
        />
      </ModalBody>
    </div>
  );
};

export default ConceptModalContent;