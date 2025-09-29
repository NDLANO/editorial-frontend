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
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import GrepCodesForm from "./GrepCodesForm";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { useUpdateDraftMutation } from "../../../modules/draft/draftMutations";
import { draftQueryKeys } from "../../../modules/draft/draftQueries";
import { usePatchLearningpathMutation } from "../../../modules/learningpath/learningpathMutations";
import { learningpathQueryKeys } from "../../../modules/learningpath/learningpathQueries";
import { NodeResourceMeta } from "../../../modules/nodes/nodeApiTypes";
import { nodeQueryKeys } from "../../../modules/nodes/nodeQueries";
import { getIdFromUrn } from "../../../util/taxonomyHelpers";

interface Props {
  codes: string[];
  contentUri?: string;
  revision?: number;
  currentNodeId: string;
  rootGrepCodesString: string | undefined;
}

const GrepCodesDialog = ({ codes, contentUri, revision, currentNodeId, rootGrepCodesString }: Props) => {
  const [open, setOpen] = useState(false);
  const resourceId = Number(getIdFromUrn(contentUri));
  if (!resourceId || !revision) return null;

  return (
    <DialogRoot size="large" position="top" open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>
        <Button size="small" variant="secondary">{`GREP (${codes.length})`}</Button>
      </DialogTrigger>
      <Portal>
        <GrepCodeDialogContent
          codes={codes}
          revision={revision}
          resourceId={resourceId}
          currentNodeId={currentNodeId}
          contentUri={contentUri!}
          rootGrepCodesString={rootGrepCodesString}
          close={() => setOpen(false)}
        />
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
  rootGrepCodesString: string | undefined;
}

const GrepCodeDialogContent = ({
  codes,
  resourceId,
  revision,
  currentNodeId,
  contentUri,
  close,
  rootGrepCodesString,
}: DialogContentProps) => {
  const updateDraft = useUpdateDraftMutation();
  const updateLearningpath = usePatchLearningpathMutation();
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
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
        qc.setQueryData<ILearningPathV2DTO>(queryKey, data);
        qc.invalidateQueries({ queryKey });
        qc.setQueriesData<NodeResourceMeta[]>({ queryKey: nodeKey }, (data) =>
          data?.map((meta) => (meta.contentUri === contentUri ? { ...meta, grepCodes } : meta)),
        );
      } else {
        const queryKey = draftQueryKeys.draftWithLanguage(resourceId, i18n.language);
        const data = await updateDraft.mutateAsync({
          id: resourceId,
          body: { grepCodes, revision: updateDraft.data?.revision ?? revision },
        });
        qc.cancelQueries({ queryKey });
        qc.setQueryData<IArticleDTO>(queryKey, data);
        qc.invalidateQueries({ queryKey });
        qc.setQueriesData<NodeResourceMeta[]>({ queryKey: nodeKey }, (data) =>
          data?.map((meta) => (meta.contentUri === contentUri ? { ...meta, grepCodes } : meta)),
        );
      }
    },
    [contentUri, resourceId, i18n.language, updateLearningpath, revision, qc, nodeKey, updateDraft],
  );
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("form.name.grepCodes")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        {rootGrepCodesString}
        <GrepCodesForm codes={codes} onUpdate={onUpdateGrepCodes} close={close} prefixFilter={["KE", "KM", "TT"]} />
      </DialogBody>
    </DialogContent>
  );
};

export default GrepCodesDialog;
