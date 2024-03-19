/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import debounce from "lodash/debounce";
import queryString from "query-string";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ButtonV2, CloseButton } from "@ndla/button";
import { Search } from "@ndla/icons/common";
import { ModalHeader, ModalBody } from "@ndla/modal";
import { Pager } from "@ndla/pager";
import { Tabs } from "@ndla/tabs";
import {
  IConcept,
  IConceptSearchResult,
  INewConcept,
  IUpdatedConcept,
  ITagsSearchResult,
  IConceptSummary,
} from "@ndla/types-backend/concept-api";
import { IArticle } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import SearchConceptResults from "./SearchConceptResults";
import ConceptForm from "../../../../containers/ConceptPage/ConceptForm/ConceptForm";
import { ConceptType } from "../../../../containers/ConceptPage/conceptInterfaces";
import { GlossForm } from "../../../../containers/GlossPage/components/GlossForm";
import SearchForm, {
  SearchParams,
  parseSearchParams,
} from "../../../../containers/SearchPage/components/form/SearchForm";
import { postSearchConcepts } from "../../../../modules/concept/conceptApi";

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
  conceptType: ConceptType;
}

const ConceptModalContent = ({
  onClose,
  subjects,
  locale,
  handleRemove,
  selectedText = "",
  addConcept,
  updateConcept,
  createConcept,
  concept,
  fetchSearchTags,
  conceptArticles,
  conceptType,
}: Props) => {
  const { t } = useTranslation();
  const [searchObject, updateSearchObject] = useState<SearchParams>({
    page: 1,
    sort: "-relevance",
    "page-size": 10,
    language: locale,
    query: `${selectedText}`,
    "concept-type": conceptType,
  });
  const [results, setConcepts] = useState<IConceptSearchResult>({
    language: locale,
    page: 1,
    pageSize: 10,
    results: [],
    totalCount: 0,
    aggregations: [],
  });
  const [searching, setSearching] = useState(false);

  const conceptTypeTabs: ConceptType[] = [conceptType];

  const searchConcept = useCallback(async (searchParam: SearchParams) => {
    if (!searching) {
      setSearching(true);
      const searchBody = parseSearchParams(queryString.stringify(searchParam), true);
      const concepts = await postSearchConcepts(searchBody);
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
    () => debounce((params: SearchParams) => searchConcept(params), 400),
    [searchConcept],
  );

  return (
    <div>
      <ModalHeader>
        <CloseButton title={t("dialog.close")} onClick={onClose} />
      </ModalHeader>
      <ModalBody>
        {concept?.id && <ButtonV2 onClick={handleRemove}>{t(`form.content.${concept.conceptType}.remove`)}</ButtonV2>}
        <Tabs
          tabs={[
            {
              title: t(`searchForm.types.${conceptType}Query`),
              id: "concepts",
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
            ...conceptTypeTabs.map((conceptType) => ({
              title: t(`form.${conceptType}.create`),
              id: `new_${conceptType}`,
              content:
                conceptType === "gloss" ? (
                  <GlossForm
                    onUpserted={addConcept}
                    inModal
                    onClose={onClose}
                    subjects={subjects}
                    upsertProps={upsertProps}
                    language={locale}
                    concept={concept}
                    conceptArticles={conceptArticles}
                    initialTitle={selectedText}
                    supportedLanguages={concept?.supportedLanguages ?? [locale]}
                  />
                ) : (
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
            })),
          ]}
        />
      </ModalBody>
    </div>
  );
};

export default ConceptModalContent;
