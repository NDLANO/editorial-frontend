/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { debounce } from "lodash-es";
import queryString from "query-string";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  DialogBody,
  DialogCloseTrigger,
  DialogHeader,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@ndla/primitives";
import {
  IConceptDTO,
  IConceptSearchResultDTO,
  INewConceptDTO,
  IUpdatedConceptDTO,
  IConceptSummaryDTO,
} from "@ndla/types-backend/concept-api";
import SearchConceptForm from "./SearchConceptForm";
import SearchConceptResults from "./SearchConceptResults";
import ConceptForm from "../../../../containers/ConceptPage/ConceptForm/ConceptForm";
import { ConceptType } from "../../../../containers/ConceptPage/conceptInterfaces";
import { GlossForm } from "../../../../containers/GlossPage/components/GlossForm";
import { parseSearchParams } from "../../../../containers/SearchPage/components/form/SearchForm";
import { SearchParams } from "../../../../interfaces";
import { postSearchConcepts } from "../../../../modules/concept/conceptApi";
import Pagination from "../../../abstractions/Pagination";
import { DialogCloseButton } from "../../../DialogCloseButton";
import FormWrapper from "../../../FormWrapper";

interface Props {
  addConcept: (concept: IConceptSummaryDTO | IConceptDTO) => void;
  concept?: IConceptDTO;
  createConcept: (createdConcept: INewConceptDTO) => Promise<IConceptDTO>;
  handleRemove: () => void;
  locale: string;
  selectedText?: string;
  updateConcept: (id: number, updatedConcept: IUpdatedConceptDTO) => Promise<IConceptDTO>;
  updateConceptStatus: (id: number, status: string) => Promise<IConceptDTO>;
  conceptType: ConceptType;
}

const ConceptDialogContent = ({
  locale,
  handleRemove,
  selectedText = "",
  addConcept,
  createConcept,
  updateConcept,
  updateConceptStatus,
  concept,
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
  const [results, setConcepts] = useState<IConceptSearchResultDTO>({
    language: locale,
    page: 1,
    pageSize: 10,
    results: [],
    totalCount: 0,
    aggregations: [],
  });
  const [searching, setSearching] = useState(false);

  const conceptTypeTabs: ConceptType[] = [conceptType];

  const searchConcept = useCallback(async (newSearchObject: SearchParams) => {
    if (!searching) {
      setSearching(true);

      const searchQuery = {
        ...searchObject,
        ...newSearchObject,
      };
      // Remove unused/empty query params
      const newQuery = Object.entries(searchQuery).reduce((prev, [currKey, currVal]) => {
        const validValue = currVal !== "" && currVal !== undefined;
        return validValue ? { ...prev, [currKey]: currVal } : prev;
      }, {});
      const searchBody = parseSearchParams(queryString.stringify(newQuery), true);
      const concepts = await postSearchConcepts(searchBody);
      setConcepts(concepts);
      setSearching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upsertProps = concept
    ? {
        onUpdate: (updatedConcept: IUpdatedConceptDTO) => updateConcept(concept.id, updatedConcept),
      }
    : {
        onCreate: createConcept,
        onUpdateStatus: updateConceptStatus,
      };

  useEffect(() => {
    searchConcept(searchObject);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const debouncedSearchConcept = useMemo(
    () => debounce((params: SearchParams) => searchConcept(params), 400),
    [searchConcept],
  );

  return (
    <div>
      <DialogHeader>
        <DialogCloseTrigger asChild>
          <DialogCloseButton />
        </DialogCloseTrigger>
      </DialogHeader>
      <DialogBody>
        {!!concept?.id && <Button onClick={handleRemove}>{t(`form.content.${concept.conceptType}.remove`)}</Button>}
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
            <FormWrapper inDialog>
              <SearchConceptForm
                search={(params: SearchParams) => {
                  updateSearchObject(params);
                  debouncedSearchConcept(params);
                }}
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
            </FormWrapper>
          </TabsContent>
          {conceptTypeTabs.map((conceptType) => (
            <TabsContent value={`new_${conceptType}`} key={conceptType}>
              {conceptType === "gloss" ? (
                <GlossForm
                  onUpserted={addConcept}
                  inDialog
                  upsertProps={upsertProps}
                  language={locale}
                  concept={concept}
                  initialTitle={selectedText}
                  supportedLanguages={concept?.supportedLanguages ?? [locale]}
                />
              ) : (
                <ConceptForm
                  onUpserted={addConcept}
                  inDialog
                  upsertProps={upsertProps}
                  language={locale}
                  concept={concept}
                  initialTitle={selectedText}
                  supportedLanguages={concept?.supportedLanguages ?? [locale]}
                />
              )}
            </TabsContent>
          ))}
        </TabsRoot>
      </DialogBody>
    </div>
  );
};

export default ConceptDialogContent;
