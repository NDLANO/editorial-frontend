/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import {
  Button,
  DialogBody,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@ndla/primitives";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { GREP_CODE_FORMATS } from "../../../constants";
import { updateDraftMutationOptions } from "../../../modules/draft/draftMutations";
import { patchLearningpathMutationOptions } from "../../../modules/learningpath/learningpathMutations";
import { nodeQueryOptions } from "../../../modules/nodes/nodeQueries";
import { searchGrepCodesQueryOptions, searchQueryKeys } from "../../../modules/search/searchQueries";
import { getContentUriInfo } from "../../../util/taxonomyHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import { useCurrentNode } from "../CurrentNodeProvider";
import GrepCodesForm from "./GrepCodesForm";

interface Props {
  codes: string[];
  contentUri?: string;
  revision?: number;
}

const GrepCodesDialog = ({ codes, contentUri, revision }: Props) => {
  const [open, setOpen] = useState(false);
  const uriInfo = getContentUriInfo(contentUri);
  if (!uriInfo || !revision) return null;

  return (
    <DialogRoot size="large" position="top" open={open} onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>
        <Button size="small" variant="tertiary">{`GREP (${codes.length})`}</Button>
      </DialogTrigger>
      <Portal>
        <DialogContent>
          <GrepCodeDialogContent
            codes={codes}
            revision={revision}
            resourceId={uriInfo.id}
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
  contentUri: string;
  close: () => void;
}

const GrepCodeDialogContent = ({ codes, resourceId, revision, contentUri, close }: DialogContentProps) => {
  const updateDraft = useMutation({
    ...updateDraftMutationOptions(),
    onSuccess: (_, __, ___, ctx) => ctx.client.invalidateQueries({ queryKey: searchQueryKeys.search() }),
  });
  const updateLearningpath = useMutation({
    ...patchLearningpathMutationOptions(),
    onSuccess: (_, __, ___, ctx) => ctx.client.invalidateQueries({ queryKey: searchQueryKeys.search() }),
  });
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { currentNode } = useCurrentNode();

  const rootNodeQuery = useQuery({
    ...nodeQueryOptions({ id: currentNode?.context?.rootId ?? "", language: "nb", taxonomyVersion }),
    enabled: !!currentNode?.context,
  });

  const rootGrepCodes = rootNodeQuery.data?.metadata.grepCodes.filter((code) => code.startsWith("KV"));

  const rootGrepCodesQuery = useQuery({
    ...searchGrepCodesQueryOptions({ codes: rootGrepCodes ?? [] }),
    enabled: !!rootGrepCodes?.length,
  });

  const rootGrepCodesString = rootGrepCodesQuery.data?.results?.map((c) => `${c.code} - ${c.title.title}`).join(", ");

  const onUpdateGrepCodes = useCallback(
    async (grepCodes: string[]) => {
      if (contentUri.includes("learningpath")) {
        await updateLearningpath.mutateAsync({
          id: resourceId,
          learningpath: { revision: updateLearningpath.data?.revision ?? revision, grepCodes, language: i18n.language },
        });
      } else {
        await updateDraft.mutateAsync({
          id: resourceId,
          body: { grepCodes, revision: updateDraft.data?.revision ?? revision },
        });
      }
    },
    [contentUri, resourceId, i18n.language, updateLearningpath, revision, updateDraft],
  );
  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("form.name.grepCodes")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
        {rootGrepCodesString}
        <GrepCodesForm
          codes={codes}
          onUpdate={onUpdateGrepCodes}
          close={close}
          prefixFilter={[
            GREP_CODE_FORMATS.KJERNEELEMENT,
            GREP_CODE_FORMATS.KOMPETANSEMAL,
            GREP_CODE_FORMATS.TVERRFAGLIGTEMA,
          ]}
        />
      </DialogBody>
    </>
  );
};

export default GrepCodesDialog;
