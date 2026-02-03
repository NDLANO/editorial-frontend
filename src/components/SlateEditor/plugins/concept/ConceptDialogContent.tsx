/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
  ConceptDTO,
  NewConceptDTO,
  UpdatedConceptDTO,
  ConceptSummaryDTO,
  DraftConceptSearchParamsDTO,
} from "@ndla/types-backend/concept-api";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import ConceptForm from "../../../../containers/ConceptPage/ConceptForm/ConceptForm";
import { ConceptType } from "../../../../containers/ConceptPage/conceptInterfaces";
import { GlossForm } from "../../../../containers/GlossPage/components/GlossForm";
import { GenericSearchList } from "../../../../containers/SearchPage/components/GenericSearchList";
import { useSearchConcepts } from "../../../../modules/concept/conceptQueries";
import Pagination from "../../../abstractions/Pagination";
import { DialogCloseButton } from "../../../DialogCloseButton";
import FormWrapper from "../../../FormWrapper";
import SearchConceptFormContent, { ConceptSearchParams, UpdateSearchParamFn } from "./SearchConceptFormContent";
import SearchConceptResult from "./SearchConceptResult";

interface Props {
  addConcept: (concept: ConceptSummaryDTO | ConceptDTO) => void;
  concept?: ConceptDTO;
  createConcept: (createdConcept: NewConceptDTO) => Promise<ConceptDTO>;
  handleRemove: () => void;
  locale: string;
  selectedText?: string;
  updateConcept: (id: number, updatedConcept: UpdatedConceptDTO) => Promise<ConceptDTO>;
  updateConceptStatus: (id: number, status: string) => Promise<ConceptDTO>;
  conceptType: ConceptType;
}

const DEFAULT_PARAMS: ConceptSearchParams = {
  page: 1,
  "page-size": 10,
  sort: "-relevance",
};

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
  const [searchObject, setSearchObject] = useState<ConceptSearchParams>({
    "concept-type": conceptType,
    query: selectedText,
    language: locale,
  });

  const parsedSearchParams: DraftConceptSearchParamsDTO = useMemo(() => {
    return {
      page: searchObject.page ?? DEFAULT_PARAMS.page,
      sort: searchObject.sort ?? DEFAULT_PARAMS.sort,
      pageSize: searchObject["page-size"] ?? DEFAULT_PARAMS["page-size"],
      language: searchObject.language,
      query: searchObject.query,
      conceptType: searchObject["concept-type"],
      responsibleIds: searchObject["responsible-ids"],
      status: searchObject.status,
      users: searchObject.users,
    };
  }, [searchObject]);

  const conceptsQuery = useSearchConcepts(parsedSearchParams);

  const conceptTypeTabs: ConceptType[] = [conceptType];

  const upsertProps = concept
    ? {
        onUpdate: (updatedConcept: UpdatedConceptDTO) => updateConcept(concept.id, updatedConcept),
      }
    : {
        onCreate: createConcept,
        onUpdateStatus: updateConceptStatus,
      };

  const onUpdateSearchParam: UpdateSearchParamFn = (param, value) => {
    setSearchObject((prev) => {
      return {
        ...prev,
        [param]: value == null && DEFAULT_PARAMS[param] ? DEFAULT_PARAMS[param] : value,
      };
    });
  };

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
              <SearchConceptFormContent
                onUpdateSearchParam={onUpdateSearchParam}
                searchObject={searchObject}
                onClearSearch={() => setSearchObject(DEFAULT_PARAMS)}
                locale={locale}
                userData={undefined}
              />
              <GenericSearchList
                type="concept"
                loading={conceptsQuery.isLoading}
                error={conceptsQuery.error}
                query={searchObject.query}
                resultLength={conceptsQuery.data?.totalCount ?? 0}
              >
                {conceptsQuery.data?.results.map((concept) => (
                  <SearchConceptResult key={concept.id} result={concept} addConcept={addConcept} />
                ))}
              </GenericSearchList>
              <Pagination
                page={conceptsQuery.data?.page}
                onPageChange={(details) => setSearchObject({ ...searchObject, page: details.page })}
                count={conceptsQuery.data?.totalCount ?? 0}
                pageSize={conceptsQuery.data?.pageSize}
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
                  translatedFieldsToNN={[]}
                />
              ) : (
                <ConceptForm
                  onUpserted={addConcept}
                  inDialog
                  upsertProps={upsertProps}
                  language={locale}
                  concept={concept}
                  initialTitle={selectedText}
                  translatedFieldsToNN={[]}
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
