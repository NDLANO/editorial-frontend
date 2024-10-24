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
import { Cross } from "@ndla/icons/action";
import { Search } from "@ndla/icons/common";
import { ModalHeader, ModalBody } from "@ndla/modal";
import { Button, IconButton, TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from "@ndla/primitives";
import {
  IConcept,
  IConceptSearchResult,
  INewConcept,
  IUpdatedConcept,
  IConceptSummary,
} from "@ndla/types-backend/concept-api";
import { IArticle } from "@ndla/types-backend/draft-api";
import { Node } from "@ndla/types-taxonomy";
import { usePaginationTranslations } from "@ndla/ui";
import SearchConceptForm from "./SearchConceptForm";
import SearchConceptResults from "./SearchConceptResults";
import ConceptForm from "../../../../containers/ConceptPage/ConceptForm/ConceptForm";
import { ConceptType } from "../../../../containers/ConceptPage/conceptInterfaces";
import { GlossForm } from "../../../../containers/GlossPage/components/GlossForm";
import { SearchParams, parseSearchParams } from "../../../../containers/SearchPage/components/form/SearchForm";
import { postSearchConcepts } from "../../../../modules/concept/conceptApi";
import Pagination from "../../../abstractions/Pagination";

interface Props {
  addConcept: (concept: IConceptSummary | IConcept) => void;
  concept?: IConcept;
  createConcept: (createdConcept: INewConcept) => Promise<IConcept>;
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
  conceptArticles,
  conceptType,
}: Props) => {
  const { t } = useTranslation();
  const paginationTranslations = usePaginationTranslations();
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
        <IconButton variant="tertiary" title={t("dialog.close")} aria-label={t("dialog.close")} onClick={onClose}>
          <Cross />
        </IconButton>
      </ModalHeader>
      <ModalBody>
        {concept?.id && <Button onClick={handleRemove}>{t(`form.content.${concept.conceptType}.remove`)}</Button>}
        <TabsRoot
          defaultValue="concepts"
          translations={{
            listLabel: t("conceptSearch.listLabel"),
          }}
        >
          <TabsList>
            <TabsTrigger value="concepts">{t(`searchForm.types.${conceptType}Query`)}</TabsTrigger>
            {conceptTypeTabs.map((conceptType) => (
              <TabsTrigger key={conceptType} value={`new_${conceptType}`}>
                {t(`form.${conceptType}.create`)}
              </TabsTrigger>
            ))}
            <TabsIndicator />
          </TabsList>
          <TabsContent value="concepts">
            <div>
              <h2>
                <Search />
                {t(`searchPage.header.concept`)}
              </h2>
              <SearchConceptForm
                search={(params: SearchParams) => {
                  updateSearchObject(params);
                  debouncedSearchConcept(params);
                }}
                subjects={subjects}
                searchObject={searchObject}
                locale={locale}
                userData={undefined}
              />
              <SearchConceptResults
                searchObject={searchObject}
                results={results.results}
                searching={searching}
                addConcept={addConcept}
              />
              <Pagination
                page={results.page}
                onPageChange={(details) => searchConcept({ ...searchObject, page: details.page })}
                count={results?.totalCount ?? 0}
                pageSize={results?.pageSize}
                siblingCount={1}
              />
            </div>
          </TabsContent>
          {conceptTypeTabs.map((conceptType) => (
            <TabsContent value={`new_${conceptType}`} key={conceptType}>
              {conceptType === "gloss" ? (
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
                  concept={concept}
                  conceptArticles={conceptArticles}
                  initialTitle={selectedText}
                  supportedLanguages={concept?.supportedLanguages ?? [locale]}
                />
              )}
            </TabsContent>
          ))}
        </TabsRoot>
      </ModalBody>
    </div>
  );
};

export default ConceptModalContent;
