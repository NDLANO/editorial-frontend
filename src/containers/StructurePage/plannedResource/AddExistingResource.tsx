/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createListCollection } from "@ark-ui/react";
import { CloseLine, DeleteBinLine, SearchLine } from "@ndla/icons";
import {
  Button,
  ComboboxLabel,
  FieldInput,
  FieldLabel,
  FieldRoot,
  ListItemContent,
  ListItemHeading,
  ListItemImage,
  ListItemRoot,
  Text,
  Spinner,
  SelectRoot,
  SelectLabel,
  SelectValueText,
  SelectContent,
  Badge,
  InputContainer,
  IconButton,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { ResourceType } from "@ndla/types-taxonomy";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TFunction } from "i18next";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import { GenericSelectItem, GenericSelectTrigger } from "../../../components/abstractions/Select";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import { FormActionsContainer, FormContent } from "../../../components/FormikForm";
import { RESOURCE_FILTER_CORE, RESOURCE_FILTER_SUPPLEMENTARY, RESOURCE_TYPE_LEARNING_PATH } from "../../../constants";
import { fetchNodes, postNode, postNodeConnection } from "../../../modules/nodes/nodeApi";
import { nodeQueryKeys } from "../../../modules/nodes/nodeQueries";
import { postSearch } from "../../../modules/search/searchApi";
import { useSearch } from "../../../modules/search/searchQueries";
import { createResourceResourceType } from "../../../modules/taxonomy";
import { resolveUrls } from "../../../modules/taxonomy/taxonomyApi";
import handleError from "../../../util/handleError";
import { isValidContextId } from "../../../util/urlHelpers";
import { usePaginatedQuery } from "../../../util/usePaginatedQuery";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import { ResourceGroup } from "../utils";

const StyledText = styled(Text, {
  base: {
    textAlign: "center",
  },
});

const StyledFormContent = styled(FormContent, {
  base: {
    width: "100%",
  },
});

const StyledListItemContent = styled(ListItemContent, {
  base: {
    flexDirection: "column",
    gap: "4xsmall",
    alignItems: "flex-start",
  },
});

const InputWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    alignItems: "flex-end",
  },
});

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    flex: "1",
  },
});

interface Props {
  onClose: () => void;
  resourceTypes?: ResourceType[];
  nodeId: string;
  existingResourceIds: string[];
  type: Exclude<ResourceGroup, "link">;
}

const NUMBER_REGEX = /^-?\d+$/;

interface AddResourceParams {
  preview: MultiSearchSummaryDTO;
  type: Exclude<ResourceGroup, "link">;
  taxonomyVersion: string;
  nodeId: string;
  language: string;
}

const addResource = async ({ preview, type, taxonomyVersion, nodeId, language }: AddResourceParams) => {
  let id: string | undefined = preview.contexts?.[0]?.publicId;
  // The resource isn't connected to a node.
  if (!id) {
    const nodeLocation = await postNode({
      body: {
        contentUri: `urn:${type === "learningpath" ? "learningpath" : "article"}:${preview.id}`,
        language,
        name: preview.title.title,
        nodeType: "RESOURCE",
      },
      taxonomyVersion,
    });
    const resourceId = nodeLocation.replace("/v1/nodes/", "");
    id = resourceId;
    if (type === "learningpath") {
      await createResourceResourceType({
        body: { resourceId, resourceTypeId: RESOURCE_TYPE_LEARNING_PATH },
        taxonomyVersion,
      });
    }
  }

  if (!id) {
    throw new Error("Failed to resolve resource ID from preview data");
  }

  return await postNodeConnection({
    body: {
      childId: id,
      parentId: nodeId,
      relevanceId:
        type === "core" ? RESOURCE_FILTER_CORE : type === "supplementary" ? RESOURCE_FILTER_SUPPLEMENTARY : undefined,
    },
    taxonomyVersion,
  });
};

interface PastedSearchParams {
  input: string;
  type: "article" | "learningpath";
  taxonomyVersion: string;
  language: string;
  t: TFunction;
}

const doPastedSearch = async ({ input, type, t, taxonomyVersion, language }: PastedSearchParams) => {
  let searchId: number | undefined = undefined;

  const urlId = input.split("/").pop();

  if (NUMBER_REGEX.test(input)) {
    searchId = Number(input);
  } else if (urlId && NUMBER_REGEX.test(urlId)) {
    if (!input.includes(type)) {
      throw new Error(t("taxonomy.conflictError"));
    }
    searchId = Number(urlId);
  } else if (urlId && isValidContextId(urlId)) {
    const res = await fetchNodes({
      contextId: urlId,
      nodeType: ["RESOURCE"],
      taxonomyVersion,
    });

    if (!res.length) {
      throw new Error(t("taxonomy.noResources"));
    }

    const resource = res[0];

    if (!resource.contentUri?.includes(type)) {
      throw new Error(t("taxonomy.conflictError"));
    }

    searchId = Number(resource.contentUri.split(":").at(-1) ?? "");
  } else if (input.includes("/resource:")) {
    const [_, ...paths] = input.split("ndla.no/");
    const resolvedUrl = await resolveUrls({
      path: paths.join(""),
      taxonomyVersion,
    });

    if (!resolvedUrl.contentUri.includes(type)) {
      throw new Error(t("taxonomy.conflictError"));
    }

    searchId = Number(resolvedUrl.contentUri.split(":").at(-1) ?? "");
  } else {
    throw new Error(t("taxonomy.invalidUrl"));
  }

  if (!searchId) {
    throw new Error(t("taxonomy.noResources"));
  }

  const res = await postSearch({
    ids: [searchId],
    language: language,
    fallback: true,
    contextTypes: type === "learningpath" ? ["learningpath"] : ["standard"],
    resultTypes: type === "learningpath" ? ["learningpath"] : ["draft", "concept"],
  });

  if (!res.results.length) {
    throw new Error(t("taxonomy.noResources"));
  }

  return res.results[0];
};

const AddExistingResource = ({ onClose, resourceTypes, existingResourceIds, nodeId, type }: Props) => {
  const { t, i18n } = useTranslation();
  const { query, delayedQuery, setQuery, page, setPage } = usePaginatedQuery();
  const [error, setError] = useState("");
  const [selectedType, setSelectedType] = useState<string>();
  const [pastedUrl, setPastedUrl] = useState("");
  const [preview, setPreview] = useState<MultiSearchSummaryDTO | undefined>(undefined);
  const qc = useQueryClient();
  const { taxonomyVersion } = useTaxonomyVersion();
  const typeTocheckFor = type === "learningpath" ? "learningpath" : "article";
  const compKey = nodeQueryKeys.childNodes({ id: nodeId, language: i18n.language });

  const alreadyExists = useMemo(() => {
    if (!preview) return false;
    return existingResourceIds.includes(preview.context?.publicId ?? "");
  }, [existingResourceIds, preview]);

  const addResourceMutation = useMutation({
    mutationFn: (params: AddResourceParams) => addResource(params),
    onSuccess: () => qc.invalidateQueries({ queryKey: compKey }),
  });

  const pastedSearchMutation = useMutation({
    mutationFn: (params: PastedSearchParams) => doPastedSearch(params),
  });

  const collection = useMemo(() => {
    return createListCollection({
      items: resourceTypes?.filter((rt) => rt.id !== RESOURCE_TYPE_LEARNING_PATH) ?? [],
      itemToValue: (item) => item.id,
      itemToString: (item) => item.name,
    });
  }, [resourceTypes]);

  const searchQuery = useSearch({
    query: delayedQuery,
    page,
    language: i18n.language,
    fallback: true,
    resourceTypes: type !== "learningpath" && selectedType ? [selectedType] : undefined,
    contextTypes: type === "learningpath" ? ["learningpath"] : ["standard"],
    resultTypes: type === "learningpath" ? ["learningpath"] : ["draft", "concept"],
  });

  const onSearch = async (input: string) => {
    setPreview(undefined);

    try {
      const res = await pastedSearchMutation.mutateAsync({
        input,
        type: typeTocheckFor,
        taxonomyVersion,
        language: i18n.language,
        t,
      });

      setPreview(res);
    } catch (e) {
      const err = e as Error;
      setError(err.message);
    }
  };

  const onAddResource = async () => {
    if (!preview) return;
    await addResourceMutation
      .mutateAsync({ preview, type, taxonomyVersion, nodeId, language: i18n.language })
      .then(() => {
        onClose();
        setError("");
      })
      .catch((e) => {
        const err = e as Error;
        handleError(err);
        setError(err.message);
      });
  };

  return (
    <StyledFormContent>
      <InputWrapper>
        <StyledFieldRoot>
          <FieldLabel>{t("taxonomy.urlPlaceholder")}</FieldLabel>
          <InputContainer>
            <FieldInput
              onChange={(evt) => {
                setPastedUrl(evt.target.value);
                setError("");
              }}
              value={pastedUrl}
              name="pasteUrlInput"
              placeholder={t("taxonomy.urlPlaceholder")}
            />
            {!!pastedUrl && (
              <IconButton
                onClick={() => {
                  setPastedUrl("");
                  setError("");
                }}
                aria-label={t("remove")}
                size="small"
                variant="tertiary"
              >
                <CloseLine />
              </IconButton>
            )}
          </InputContainer>
        </StyledFieldRoot>
        <IconButton
          aria-label={t("search")}
          disabled={!pastedUrl}
          onClick={() => onSearch(pastedUrl)}
          loading={pastedSearchMutation.isPending}
        >
          <SearchLine />
        </IconButton>
      </InputWrapper>
      {!pastedUrl && <StyledText>{t("taxonomy.or")}</StyledText>}
      {!pastedUrl && type !== "learningpath" && (
        <SelectRoot
          collection={collection}
          value={selectedType ? [selectedType] : []}
          onValueChange={(details) => setSelectedType(details.items[0].id)}
        >
          <SelectLabel>{t("taxonomy.contentType")}</SelectLabel>
          <GenericSelectTrigger clearable>
            <SelectValueText placeholder={t("taxonomy.resourceTypes.placeholder")} />
          </GenericSelectTrigger>
          <SelectContent>
            {collection.items.map((item) => (
              <GenericSelectItem item={item} key={item.id}>
                {item.name}
              </GenericSelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      )}
      {!pastedUrl && (
        <GenericSearchCombobox
          value={preview ? [`${preview.learningResourceType}_${preview.id.toString()}`] : undefined}
          onValueChange={(details) => setPreview(details.items[0])}
          items={searchQuery.data?.results ?? []}
          itemToString={(item) => item.title.title}
          itemToValue={(item) => `${item.learningResourceType}_${item.id.toString()}`}
          inputValue={query}
          onInputValueChange={(details) => setQuery(details.inputValue)}
          isSuccess={searchQuery.isSuccess}
          paginationData={searchQuery.data}
          onPageChange={(details) => setPage(details.page)}
          renderItem={(item) => (
            <GenericComboboxItemContent
              title={item.title.title}
              description={item.metaDescription.metaDescription}
              image={item.metaImage}
              child={
                item.learningResourceType === "learningpath" ? (
                  <Badge>{t("contentTypes.learningpath")}</Badge>
                ) : undefined
              }
              useFallbackImage
            />
          )}
        >
          <ComboboxLabel>{t("form.content.relatedArticle.placeholder")}</ComboboxLabel>
          <GenericComboboxInput
            placeholder={t("form.content.relatedArticle.placeholder")}
            isFetching={searchQuery.isFetching}
          />
        </GenericSearchCombobox>
      )}
      {pastedSearchMutation.isPending ? (
        <Spinner />
      ) : (
        preview && (
          <ListItemRoot data-testid="articlePreview" nonInteractive>
            <ListItemImage src={preview.metaImage?.url ?? "/static/placeholder.png"} alt="" width={200} />
            <StyledListItemContent>
              <ListItemHeading>{preview.title.title}</ListItemHeading>
              <Text textStyle="body.small">{preview.metaDescription?.metaDescription}</Text>
            </StyledListItemContent>
            {preview.learningResourceType === "learningpath" && <Badge>{t("contentTypes.learningpath")}</Badge>}
            <IconButton variant="danger" onClick={() => setPreview(undefined)} aria-label={t("remove")} size="small">
              <DeleteBinLine />
            </IconButton>
          </ListItemRoot>
        )
      )}
      {!!error && <Text color="text.error">{t(error)}</Text>}
      {!!alreadyExists && <Text color="text.error">{t("taxonomy.resource.addResourceConflict")}</Text>}
      <FormActionsContainer>
        <Button
          disabled={preview === undefined || alreadyExists}
          onClick={onAddResource}
          loading={addResourceMutation.isPending}
          type="submit"
        >
          {t("taxonomy.add")}
        </Button>
      </FormActionsContainer>
    </StyledFormContent>
  );
};

export default AddExistingResource;
