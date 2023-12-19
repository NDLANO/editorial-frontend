/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonV2, CloseButton } from '@ndla/button';
import { Search } from '@ndla/icons/common';
import { ModalHeader, ModalBody } from '@ndla/modal';
import Pager from '@ndla/pager';
import Tabs from '@ndla/tabs';
import {
  IConcept,
  IConceptSearchResult,
  INewConcept,
  IUpdatedConcept,
  ITagsSearchResult,
  IConceptSummary,
} from '@ndla/types-backend/concept-api';
import { IArticle } from '@ndla/types-backend/draft-api';

import { Node } from '@ndla/types-taxonomy';
import SearchConceptResults from './SearchConceptResults';
import ConceptForm from '../../../../containers/ConceptPage/ConceptForm/ConceptForm';
import { ConceptType } from '../../../../containers/ConceptPage/conceptInterfaces';
import SearchForm from '../../../../containers/SearchPage/components/form/SearchForm';
import { searchConcepts } from '../../../../modules/concept/conceptApi';
import { ConceptQuery } from '../../../../modules/concept/conceptApiInterfaces';

interface Props {
  addConcept: (concept: IConceptSummary | IConcept) => void;
  concept?: IConcept;
  createConcept: (createdConcept: INewConcept) => Promise<IConcept>;
  fetchSearchTags: (input: string, language: string) => Promise<ITagsSearchResult>;
  handleRemove: () => void;
  onClose: () => void;
  locale: string;
  selectedText?: string;
  subjects: Node[];
  updateConcept: (id: number, updatedConcept: IUpdatedConcept) => Promise<IConcept>;
  conceptArticles: IArticle[];
  conceptType?: ConceptType;
}

const ConceptModalContent = ({
  onClose,
  subjects,
  locale,
  handleRemove,
  selectedText = '',
  addConcept,
  updateConcept,
  createConcept,
  concept,
  fetchSearchTags,
  conceptArticles,
  conceptType,
}: Props) => {
  const { t } = useTranslation();
  const [searchObject, updateSearchObject] = useState<ConceptQuery>({
    page: 1,
    sort: '-relevance',
    'page-size': 10,
    language: locale,
    query: `${selectedText}`,
    'concept-type': conceptType,
  });
  const [results, setConcepts] = useState<IConceptSearchResult>({
    language: locale,
    page: 1,
    pageSize: 10,
    results: [],
    totalCount: 0,
  });
  const [searching, setSearching] = useState(false);

  const conceptTypeTabs: ConceptType[] = conceptType ? [conceptType] : ['concept', 'gloss'];

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
          <ButtonV2 onClick={handleRemove}>
            {t(`form.content.${concept.conceptType}.remove`)}
          </ButtonV2>
        )}
        <Tabs
          tabs={[
            {
              title: t(`searchForm.types.conceptQuery`),
              id: 'concepts',
              content: (
                <div>
                  <h2>
                    <Search size="normal" />
                    {t(`searchPage.header.concept`)}
                  </h2>
                  <SearchForm
                    type="concept"
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
            ...conceptTypeTabs.map((ct) => ({
              title: t(`form.${ct}.create`),
              id: `new_${ct}`,
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
                  conceptType={ct}
                />
              ),
            })),
          ]}
        />
      </ModalBody>
    </div>
  );
};

export default ConceptModalContent;
