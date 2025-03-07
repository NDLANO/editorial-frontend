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
import { constants } from "@ndla/ui";
import GrepCodesForm from "./GrepCodesForm";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { useUpdateDraftMutation } from "../../../modules/draft/draftMutations";
import { draftQueryKeys } from "../../../modules/draft/draftQueries";
import { NodeResourceMeta, nodeQueryKeys } from "../../../modules/nodes/nodeQueries";
import { getIdFromUrn } from "../../../util/taxonomyHelpers";

const { contentTypes } = constants;

interface Props {
  codes: string[];
  contentType: string;
  contentUri?: string;
  revision?: number;
  currentNodeId: string;
}

const GrepCodesDialog = ({ codes, contentType, contentUri, revision, currentNodeId }: Props) => {
  const [open, setOpen] = useState(false);
  const draftId = Number(getIdFromUrn(contentUri));
  if (contentType === contentTypes.LEARNING_PATH || !draftId || !revision) return null;

  return (
    <DialogRoot size="large" position="top" open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>
        <Button size="small" variant="secondary">{`GREP (${codes.length})`}</Button>
      </DialogTrigger>
      <Portal>
        <GrepCodeDialogContent
          codes={codes}
          revision={revision}
          draftId={draftId}
          currentNodeId={currentNodeId}
          contentUri={contentUri!}
          close={() => setOpen(false)}
        />
      </Portal>
    </DialogRoot>
  );
};

interface DialogContentProps {
  codes: string[];
  draftId: number;
  revision: number;
  currentNodeId: string;
  contentUri: string;
  close: () => void;
}

const GrepCodeDialogContent = ({ codes, draftId, revision, currentNodeId, contentUri, close }: DialogContentProps) => {
  const updateDraft = useUpdateDraftMutation();
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const key = useMemo(() => draftQueryKeys.draft({ id: draftId, language: i18n.language }), [i18n.language, draftId]);
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
      const updatedRevision = updateDraft.data?.revision ?? revision;
      await updateDraft.mutateAsync(
        { id: draftId, body: { grepCodes, revision: updatedRevision, metaImage: undefined, responsibleId: undefined } },
        {
          onSuccess: (data) => {
            qc.cancelQueries({ queryKey: key });
            qc.setQueryData<IArticleDTO>(key, data);
            qc.invalidateQueries({ queryKey: key });
            qc.setQueriesData<NodeResourceMeta[]>({ queryKey: nodeKey }, (data) =>
              data?.map((meta) => (meta.contentUri === contentUri ? { ...meta, grepCodes } : meta)),
            );
          },
        },
      );
    },
    [updateDraft, draftId, revision, qc, key, nodeKey, contentUri],
  );
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("form.name.grepCodes")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        <GrepCodesForm codes={codes} onUpdate={onUpdateGrepCodes} close={close} prefixFilter={["KE", "KM", "TT"]} />
      </DialogBody>
    </DialogContent>
  );
};

export default GrepCodesDialog;
