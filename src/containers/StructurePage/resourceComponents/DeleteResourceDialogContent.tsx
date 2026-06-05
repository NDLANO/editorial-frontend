/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useDialogContext } from "@ark-ui/react";
import { Button, DialogBody, DialogFooter, DialogHeader, DialogTitle, Text } from "@ndla/primitives";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { NodeChild } from "@ndla/types-backend/taxonomy-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { ARCHIVED, PUBLISHED, UNPUBLISHED } from "../../../constants";
import { updateDraftStatusMutationOptions } from "../../../modules/draft/draftMutations";
import { learningpathsWithArticleQueryOptions } from "../../../modules/learningpath/learningpathQueries";
import { useDeleteNodeConnectionMutation } from "../../../modules/nodes/nodeMutations";
import { getContentUriInfo } from "../../../util/taxonomyHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  resource: NodeChild;
  contentMeta: MultiSearchSummaryDTO | undefined;
  invalidate: () => void;
  isMultidisciplinary: boolean;
}

export const DeleteResourceDialogContent = ({ resource, contentMeta, invalidate, isMultidisciplinary }: Props) => {
  const { t } = useTranslation();
  const { setOpen } = useDialogContext();
  const deleteNodeConnectionMutation = useDeleteNodeConnectionMutation();
  const updateArticleMutation = useMutation(updateDraftStatusMutationOptions());
  const { taxonomyVersion } = useTaxonomyVersion();

  const articleId = useMemo(() => {
    const uriInfo = getContentUriInfo(resource.contentUri);
    return uriInfo?.type === "article" ? uriInfo.id : undefined;
  }, [resource.contentUri]);

  const lpsWithArticleQuery = useQuery({
    ...learningpathsWithArticleQueryOptions(articleId!),
    enabled: !!articleId,
  });

  const deletionType = useMemo(() => {
    if (isMultidisciplinary) return "deleteConnection";
    if (resource.contexts.length === 1) {
      return contentMeta?.status?.current === PUBLISHED || contentMeta?.status?.other?.includes(PUBLISHED)
        ? "unpublish"
        : "delete";
    }
    return "deleteConnection";
  }, [contentMeta?.status, resource.contexts.length, isMultidisciplinary]);

  const onDelete = useCallback(async () => {
    updateArticleMutation.reset();
    if (!isMultidisciplinary) {
      if (deletionType === "unpublish" && articleId) {
        await updateArticleMutation.mutateAsync({ id: articleId, status: UNPUBLISHED });
      } else if (deletionType === "delete" && articleId) {
        await updateArticleMutation.mutateAsync({ id: articleId, status: ARCHIVED });
      }
    }

    if (updateArticleMutation.isError) return;

    await deleteNodeConnectionMutation.mutateAsync(
      { id: resource.connectionId, taxonomyVersion },
      { onSuccess: () => invalidate() },
    );
    setOpen(false);
  }, [
    articleId,
    deleteNodeConnectionMutation,
    deletionType,
    invalidate,
    isMultidisciplinary,
    resource.connectionId,
    setOpen,
    taxonomyVersion,
    updateArticleMutation,
  ]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("taxonomy.delete.deleteResource")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <Text>{t("taxonomy.resource.confirmDelete")}</Text>
        <Text fontWeight="bold">
          {articleId
            ? t(`taxonomy.delete.deletionType.${deletionType}`)
            : t("taxonomy.delete.deletionType.deleteConnection")}
        </Text>
        {!!deleteNodeConnectionMutation.isError && (
          <Text color="text.error">{t("taxonomy.delete.deletionError.connectionError")}</Text>
        )}
        {!!updateArticleMutation.isError && (
          <Text color="text.error">{t("taxonomy.delete.deletionError.articleError")}</Text>
        )}
        <Text color="text.error">{}</Text>
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => setOpen(false)} variant="secondary">
          {t("form.abort")}
        </Button>
        <Button
          loading={
            lpsWithArticleQuery.isLoading || deleteNodeConnectionMutation.isPending || updateArticleMutation.isPending
          }
          onClick={onDelete}
          variant="danger"
        >
          {t("alertDialog.delete")}
        </Button>
      </DialogFooter>
    </>
  );
};
