/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { AddLine } from "@ndla/icons";
import {
  Button,
  ComboboxLabel,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  ListItemContent,
  ListItemHeading,
  ListItemImage,
  ListItemRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { Node } from "@ndla/types-taxonomy";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import { MULTIDISCIPLINARY_SUBJECT_ID, VALID_CONTEXT_ID_REGEXP } from "../../../constants";
import { fetchNodes } from "../../../modules/nodes/nodeApi";
import { usePostNodeConnectionMutation } from "../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../modules/nodes/nodeQueries";
import { postSearch } from "../../../modules/search/searchApi";
import { useSearch } from "../../../modules/search/searchQueries";
import { isNDLAFrontendUrl } from "../../../util/htmlHelpers";
import useDebounce from "../../../util/useDebounce";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  currentNode: Node;
}

const InputWrapper = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "xsmall",
  },
});

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    flex: "1",
  },
});

const StyledButton = styled(Button, {
  base: {
    whiteSpace: "nowrap",
  },
});

const StyledText = styled(Text, {
  base: {
    textAlign: "center",
  },
});

const StyledListItemContent = styled(ListItemContent, {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

const getMultidisciplinaryContext = (item: MultiSearchSummaryDTO) => {
  if (item.context?.rootId === MULTIDISCIPLINARY_SUBJECT_ID) {
    return item.context;
  }
  const ctx = item.contexts.find((ctx) => ctx.rootId === MULTIDISCIPLINARY_SUBJECT_ID);
  return ctx?.breadcrumbs.length === 3 ? ctx : undefined;
};

export const MultidisciplinaryDialog = ({ currentNode }: Props) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [pasteUrl, setPasteUrl] = useState("");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [previewNode, setPreviewNode] = useState<MultiSearchSummaryDTO | undefined>(undefined);
  const debouncedSearchQuery = useDebounce(query);
  const postNodeConnectionMutation = usePostNodeConnectionMutation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();

  const isValidPasteUrl = useMemo(() => isNDLAFrontendUrl(pasteUrl), [pasteUrl]);

  const onSearchUrl = async (url: string) => {
    let urlObj: URL;
    setError(undefined);
    try {
      urlObj = new URL(url);
    } catch (e) {
      setError(t("taxonomy.multidisciplinary.errors.invalidUrl"));
      return;
    }
    try {
      const parts = urlObj.pathname.split("/");
      const lastPart = parts.at(-1) ?? "";
      let articleId = Number(lastPart);
      if (!articleId && VALID_CONTEXT_ID_REGEXP.test(lastPart)) {
        const taxNodes = await fetchNodes({
          contextId: lastPart,
          taxonomyVersion,
          language: i18n.language,
          filterProgrammes: true,
        });
        articleId = parseInt(taxNodes[0]?.contentUri?.split(":").at(-1) ?? "");
      }
      if (articleId) {
        const searchRes = await postSearch({
          resultTypes: ["draft"],
          ids: [articleId],
          subjects: [MULTIDISCIPLINARY_SUBJECT_ID],
          contextTypes: ["topic-article"],
          filterInactive: true,
        });
        const correctContext = searchRes.results[0] ? getMultidisciplinaryContext(searchRes.results[0]) : undefined;
        if (correctContext && correctContext.breadcrumbs.length !== 3) {
          setError(t("taxonomy.multidisciplinary.errors.notCase"));
        } else if (correctContext && searchRes.results[0]) {
          setError(undefined);
          setPreviewNode(searchRes.results[0]);
        } else {
          setError(t("taxonomy.multidisciplinary.errors.notMultidisciplinary"));
        }
      }
    } catch (e) {
      setError(t("taxonomy.multidisciplinary.errors.failedToFetch"));
    }
  };

  const onSave = async () => {
    if (!previewNode) return;
    const correctContext = getMultidisciplinaryContext(previewNode);
    if (!correctContext) return;
    await postNodeConnectionMutation.mutateAsync({
      taxonomyVersion,
      body: { parentId: currentNode.id, childId: correctContext.publicId, connectionType: "LINK" },
    });
    await qc.invalidateQueries({
      queryKey: nodeQueryKeys.childNodes({
        connectionTypes: ["LINK"],
        id: currentNode.id,
        language: i18n.language,
        taxonomyVersion,
        recursive: false,
      }),
    });

    setOpen(false);
  };

  const searchQuery = useSearch({
    resultTypes: ["draft"],
    subjects: [MULTIDISCIPLINARY_SUBJECT_ID],
    contextTypes: ["topic-article"],
    filterInactive: true,
    query: debouncedSearchQuery,
    page: page,
    pageSize: 10,
  });

  return (
    <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>
        <Button size="small" variant="secondary">
          <AddLine />
          {t("taxonomy.multidisciplinary.dialogTrigger")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("taxonomy.multidisciplinary.dialogTitle")}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <InputWrapper>
            <StyledFieldRoot invalid={!!error}>
              <FieldLabel>{t("taxonomy.urlPlaceholder")}</FieldLabel>
              <FieldInput onChange={(e) => setPasteUrl(e.target.value)} placeholder={t("taxonomy.urlPlaceholder")} />
              <FieldErrorMessage>{error}</FieldErrorMessage>
            </StyledFieldRoot>
            <StyledButton disabled={!isValidPasteUrl} onClick={() => onSearchUrl(pasteUrl)}>
              {t("taxonomy.add")}
            </StyledButton>
          </InputWrapper>
          {!pasteUrl && <StyledText>{t("taxonomy.or")}</StyledText>}
          {!pasteUrl.length && (
            <GenericSearchCombobox
              value={previewNode ? [previewNode.id.toString()] : undefined}
              onValueChange={(details) => setPreviewNode(details.items[0])}
              items={searchQuery.data?.results ?? []}
              itemToString={(item) => item.title.title}
              itemToValue={(item) => item.id.toString()}
              inputValue={query}
              onInputValueChange={(details) => setQuery(details.inputValue)}
              isSuccess={searchQuery.isSuccess}
              paginationData={searchQuery.data}
              onPageChange={(details) => setPage(details.page)}
              isItemDisabled={(item) => !getMultidisciplinaryContext(item)}
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

          {!!previewNode && (
            <ListItemRoot nonInteractive>
              <ListItemImage src={previewNode.metaImage?.url ?? "/placeholder.png"} alt="" width={200} />
              <StyledListItemContent>
                <ListItemHeading>{previewNode.title?.title}</ListItemHeading>
                <Text textStyle="body.small">{previewNode.metaDescription?.metaDescription}</Text>
              </StyledListItemContent>
            </ListItemRoot>
          )}
        </DialogBody>
        <DialogFooter>
          <DialogCloseTrigger asChild>
            <Button variant="secondary">{t("cancel")}</Button>
          </DialogCloseTrigger>
          <Button disabled={!previewNode} onClick={onSave} loading={postNodeConnectionMutation.isPending}>
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
