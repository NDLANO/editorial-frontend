/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Portal } from "@ark-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DialogBody,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@ndla/primitives";
import { ArticleDTO } from "@ndla/types-backend/draft-api";
import { LearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import GrepCodesForm from "./GrepCodesForm";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { useUpdateDraftMutation } from "../../../modules/draft/draftMutations";
import { draftQueryKeys } from "../../../modules/draft/draftQueries";
import { usePatchLearningpathMutation } from "../../../modules/learningpath/learningpathMutations";
import { learningpathQueryKeys } from "../../../modules/learningpath/learningpathQueries";
import { nodeQueryKeys, useNode } from "../../../modules/nodes/nodeQueries";
import { useSearchGrepCodes } from "../../../modules/search/searchQueries";
import { getContentUriFromSearchSummary } from "../../../util/searchHelpers";
import { getContentUriInfo } from "../../../util/taxonomyHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import { useCurrentNode } from "../CurrentNodeProvider";

interface Props {
  codes: string[];
  contentUri?: string;
  revision?: number;
  currentNodeId: string;
}

const GrepCodesDialog = ({ codes, contentUri, revision, currentNodeId }: Props) => {
  const [open, setOpen] = useState(false);
  const uriInfo = getContentUriInfo(contentUri);
  if (!uriInfo || !revision) return null;

  return (
    <DialogRoot size="large" position="top" open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>
        <Button size="small" variant="secondary">{`GREP (${codes.length})`}</Button>
      </DialogTrigger>
      <Portal>
        <DialogContent>
          <GrepCodeDialogContent
            codes={codes}
            revision={revision}
            resourceId={uriInfo.id}
            currentNodeId={currentNodeId}
            contentUri={contentUri!}
            close={() => setOpen(false)}
          />
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

interface DialogContentProps {
  codes: string[];
  resourceId: number;
  revision: number;
  currentNodeId: string;
  contentUri: string;
  close: () => void;
}

const GrepCodeDialogContent = ({
  codes,
  resourceId,
  revision,
  currentNodeId,
  contentUri,
  close,
}: DialogContentProps) => {
  const updateDraft = useUpdateDraftMutation();
  const updateLearningpath = usePatchLearningpathMutation();
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { currentNode } = useCurrentNode();

  const rootNodeQuery = useNode(
    { id: currentNode?.context?.rootId ?? "", language: "nb", taxonomyVersion },
    { enabled: !!currentNode?.context },
  );

  const rootGrepCodes = rootNodeQuery.data?.metadata.grepCodes.filter((code) => code.startsWith("KV"));

  const rootGrepCodesQuery = useSearchGrepCodes({ codes: rootGrepCodes ?? [] }, { enabled: !!rootGrepCodes?.length });

  const rootGrepCodesString = rootGrepCodesQuery.data?.results?.map((c) => `${c.code} - ${c.title.title}`).join(", ");
  const nodeKey = useMemo(
    () =>
      nodeQueryKeys.resourceMetas({
        nodeId: currentNodeId,
        language: i18n.language,
      }),
    [i18n.language, currentNodeId],
  );

  const onUpdateGrepCodes = useCallback(
    async (grepCodes: string[]) => {
      if (contentUri.includes("learningpath")) {
        const queryKey = learningpathQueryKeys.learningpath({ id: resourceId, language: i18n.language });
        const data = await updateLearningpath.mutateAsync({
          id: resourceId,
          learningpath: { revision: updateLearningpath.data?.revision ?? revision, grepCodes, language: i18n.language },
        });
        qc.cancelQueries({ queryKey });
        qc.setQueryData<LearningPathV2DTO>(queryKey, data);
        qc.invalidateQueries({ queryKey });
        qc.setQueriesData<MultiSearchSummaryDTO[]>({ queryKey: nodeKey }, (data) =>
          data?.map((meta) => (getContentUriFromSearchSummary(meta) === contentUri ? { ...meta, grepCodes } : meta)),
        );
      } else {
        const queryKey = draftQueryKeys.draftWithLanguage(resourceId, i18n.language);
        const data = await updateDraft.mutateAsync({
          id: resourceId,
          body: { grepCodes, revision: updateDraft.data?.revision ?? revision },
        });
        qc.cancelQueries({ queryKey });
        qc.setQueryData<ArticleDTO>(queryKey, data);
        qc.invalidateQueries({ queryKey });
        qc.setQueriesData<MultiSearchSummaryDTO[]>({ queryKey: nodeKey }, (data) =>
          data?.map((meta) => (getContentUriFromSearchSummary(meta) === contentUri ? { ...meta, grepCodes } : meta)),
        );
      }
    },
    [contentUri, resourceId, i18n.language, updateLearningpath, revision, qc, nodeKey, updateDraft],
  );
  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("form.name.grepCodes")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        {rootGrepCodesString}
        <GrepCodesForm codes={codes} onUpdate={onUpdateGrepCodes} close={close} prefixFilter={["KE", "KM", "TT"]} />
      </DialogBody>
    </>
  );
};

export default GrepCodesDialog;
