/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ChangeEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
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
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IArticleV2 } from "@ndla/types-backend/article-api";
import { ILearningPathSummaryV2, ILearningPathV2 } from "@ndla/types-backend/learningpath-api";
import { IMultiSearchSummary } from "@ndla/types-backend/search-api";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import { FormActionsContainer, FormContent } from "../../../components/FormikForm";
import { RESOURCE_TYPE_LEARNING_PATH, RESOURCE_TYPE_SUBJECT_MATERIAL } from "../../../constants";
import { getArticle } from "../../../modules/article/articleApi";
import { fetchLearningpaths, updateLearningPathTaxonomy } from "../../../modules/learningpath/learningpathApi";
import { fetchNodes } from "../../../modules/nodes/nodeApi";
import { usePostResourceForNodeMutation } from "../../../modules/nodes/nodeMutations";
import { nodeQueryKeys, useNodes } from "../../../modules/nodes/nodeQueries";
import { useSearch } from "../../../modules/search/searchQueries";
import { resolveUrls } from "../../../modules/taxonomy/taxonomyApi";
import handleError from "../../../util/handleError";
import { getResourceIdFromPath } from "../../../util/routeHelpers";
import { usePaginatedQuery } from "../../../util/usePaginatedQuery";
import ResourceTypeSelect from "../../ArticlePage/components/ResourceTypeSelect";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

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

interface Props {
  onClose: () => void;
  resourceTypes?: {
    id: string;
    name: string;
  }[];
  nodeId: string;
  existingResourceIds: string[];
}

interface Preview extends Pick<IMultiSearchSummary, "id" | "title" | "metaDescription"> {
  metaUrl?: string;
  paths?: string[];
}

type PossibleResources = IMultiSearchSummary | ILearningPathSummaryV2 | ILearningPathV2 | IArticleV2;

const AddExistingResource = ({ onClose, resourceTypes, existingResourceIds, nodeId }: Props) => {
  const { t, i18n } = useTranslation();
  const { query, delayedQuery, setQuery, page, setPage } = usePaginatedQuery();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(RESOURCE_TYPE_SUBJECT_MATERIAL);
  const [pastedUrl, setPastedUrl] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [contentUri, setContentUri] = useState<string | undefined>();
  const [resourceId, setResourceId] = useState<string | undefined>();
  const [preview, setPreview] = useState<Preview | undefined>(undefined);
  const [articleInputId, setArticleInputId] = useState<string | undefined>();
  const qc = useQueryClient();
  const { taxonomyVersion } = useTaxonomyVersion();
  const compKey = nodeQueryKeys.resources({
    id: nodeId,
    language: i18n.language,
  });
  const { mutateAsync: createNodeResource } = usePostResourceForNodeMutation({
    onSuccess: (_) => qc.invalidateQueries({ queryKey: compKey }),
  });
  const { data: articleSearchData } = useNodes({
    contentURI: `urn:article:${articleInputId}`,
    nodeType: "RESOURCE",
    taxonomyVersion,
  });

  useEffect(() => {
    if (articleSearchData && articleSearchData.length) {
      const res = articleSearchData[0];
      setResourceId(res.id);
      setContentUri(res.contentUri);
    }
  }, [articleSearchData]);

  useEffect(() => {
    if (!contentUri || !resourceId) return;
    setPreviewLoading(true);
    const fetchData = async () => {
      setPreviewLoading(true);
      let preview;
      if (contentUri.includes("learningpath")) {
        const learningpathId = contentUri.split("learningpath:")[1];
        const res = await fetchLearningpaths([Number(learningpathId)]);
        preview = res.length && toPreview(res[0]);
      } else {
        const previewId = contentUri.split("article:")[1];
        const res = await getArticle(Number(previewId));
        preview = res && toPreview(res);
      }
      if (preview) {
        setPreview(preview);
      }
    };
    fetchData();
    setPreviewLoading(false);
  }, [contentUri, resourceId]);

  const toPreview = (resource: PossibleResources): Preview => {
    if ("metaUrl" in resource) {
      const { description, language } = resource.description;
      const url =
        "coverPhoto" in resource
          ? resource.coverPhoto?.url
          : "coverPhotoUrl" in resource
            ? resource.coverPhotoUrl
            : undefined;
      return {
        ...resource,
        title: {
          ...resource.title,
          htmlTitle: resource.title.title,
        },
        metaUrl: url,
        metaDescription: { metaDescription: description, language },
      };
    } else {
      return { ...resource, metaUrl: resource.metaImage?.url };
    }
  };

  const searchQuery = useSearch({
    query: delayedQuery,
    page,
    language: i18n.language,
    fallback: true,
    resourceTypes: [selectedType],
  });

  const resetPastedUrlStatesWithError = (error?: string) => {
    setError(error ?? "");
    setArticleInputId(undefined);
    setPreview(undefined);
    setPreviewLoading(false);
    setResourceId(undefined);
  };

  const onPaste = async (evt: ChangeEvent<HTMLInputElement>) => {
    const input = evt.target.value;
    setPastedUrl(input);

    if (!input) return;

    const pastedIsNumber = /^-?\d+$/.test(input);
    const articleIdInPathMatch = input.match(/article\/(\d+)/);
    const articleIdInInput = articleIdInPathMatch ? articleIdInPathMatch[1] : pastedIsNumber && input;

    if (articleIdInInput === articleInputId) return;
    resetPastedUrlStatesWithError();

    if (articleIdInInput) {
      setArticleInputId(articleIdInInput);
    } else {
      const inputMatch = input.match(/ndla.no\/(.+)/);
      const inputPath = inputMatch && inputMatch[1];
      if (!inputPath) {
        resetPastedUrlStatesWithError(t("errorMessage.invalidUrl"));
        return;
      }
      try {
        const resolvedUrl = await resolveUrls({
          path: inputPath,
          taxonomyVersion,
        });
        setResourceId(resolvedUrl.id);
        setContentUri(resolvedUrl.contentUri);
      } catch (e) {
        resetPastedUrlStatesWithError(t("taxonomy.noResources"));
      }
    }
  };

  const findResourceIdLearningPath = async (learningpathId: number) => {
    await updateLearningPathTaxonomy(learningpathId, true);
    try {
      const resource = await fetchNodes({
        contentURI: `urn:learningpath:${learningpathId}`,
        taxonomyVersion,
      });
      if (resource.length > 0) {
        return resource[0].id;
      } else throw Error(`Could not find resource after updating for ${learningpathId}`);
    } catch (e) {
      const err = e as Error;
      handleError(err);
      setLoading(false);
      setError(err.message);
    }
  };

  const onAddResource = async () => {
    if (!preview) return;
    let id = resourceId;
    if (!id) {
      const isLearningpath = selectedType === RESOURCE_TYPE_LEARNING_PATH && "metaUrl" in preview;
      const isArticleOrDraft = "paths" in preview;
      id = isLearningpath
        ? await findResourceIdLearningPath(preview.id)
        : isArticleOrDraft
          ? getResourceIdFromPath(preview.paths?.[0])
          : undefined;
    }

    if (!id) {
      return;
    }

    if (existingResourceIds.includes(String(resourceId))) {
      resetPastedUrlStatesWithError(t("taxonomy.resource.addResourceConflict"));
      return;
    }

    await createNodeResource({
      body: { resourceId: id, nodeId },
      taxonomyVersion,
    })
      .then((_) => onClose())
      .catch(() => resetPastedUrlStatesWithError("taxonomy.resource.creationFailed"));
    setLoading(false);
  };

  return (
    <StyledFormContent>
      {selectedType && (
        <>
          <FieldRoot>
            <FieldLabel>{t("taxonomy.urlPlaceholder")}</FieldLabel>
            <FieldInput onChange={onPaste} name="pasteUrlInput" placeholder={t("taxonomy.urlPlaceholder")} />
          </FieldRoot>
          {!pastedUrl && <StyledText>{t("taxonomy.or")}</StyledText>}
        </>
      )}
      {!pastedUrl && (
        <ResourceTypeSelect
          availableResourceTypes={resourceTypes ?? []}
          onChangeSelectedResource={(value) => {
            if (value) setSelectedType(value);
          }}
        />
      )}
      {!pastedUrl && selectedType && (
        <GenericSearchCombobox
          value={preview ? [preview.id.toString()] : undefined}
          onValueChange={(details) => setPreview(toPreview(details.items[0]))}
          items={searchQuery.data?.results ?? []}
          itemToString={(item) => item.title.title}
          itemToValue={(item) => item.id.toString()}
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
      {previewLoading ? (
        <Spinner />
      ) : (
        preview && (
          <ListItemRoot data-testid="articlePreview" nonInteractive>
            <ListItemImage src={preview.metaUrl ?? "/placeholder.png"} alt="" width={200} />
            <StyledListItemContent>
              <ListItemHeading>{preview.title.title}</ListItemHeading>
              <Text textStyle="body.small">{preview.metaDescription?.metaDescription}</Text>
            </StyledListItemContent>
          </ListItemRoot>
        )
      )}
      {error && <Text color="text.error">{t(error)}</Text>}
      <FormActionsContainer>
        <Button disabled={preview === undefined} onClick={onAddResource} loading={loading} type="submit">
          {t("taxonomy.add")}
        </Button>
      </FormActionsContainer>
    </StyledFormContent>
  );
};

export default AddExistingResource;
