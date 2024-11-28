/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSelected } from "slate-react";
import { DeleteBinLine, FileCopyLine } from "@ndla/icons/action";
import { IconButton, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { H5pMetaData } from "@ndla/types-embed";
import { EmbedWrapper, H5pEmbed } from "@ndla/ui";
import EditH5PModal from "./EditH5PModal";
import EditMetadataModal from "./EditMetadataModal";
import { H5pElement } from "./types";
import config from "../../../../config";
import { useMessages } from "../../../../containers/Messages/MessagesProvider";
import { useH5pMeta } from "../../../../modules/embed/queries";
import { useCopyH5pMutation } from "../../../../modules/h5p/h5pMutations";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: H5pElement;
  editor: Editor;
}

const StyledEmbedWrapper = styled(EmbedWrapper, {
  base: {
    _selected: {
      outline: "2px solid",
      outlineColor: "stroke.default",
    },
  },
});

const FigureButtons = styled(StyledFigureButtons, {
  base: {
    right: "xsmall",
    top: "medium",
  },
});

const SlateH5p = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const isSelected = useSelected();
  const language = useArticleLanguage();
  const { createMessage } = useMessages();

  const h5pMetaQuery = useH5pMeta(element.data?.path ?? "", element.data?.url ?? "", {
    enabled: !!element.data?.path,
  });
  const h5pCopyMutation = useCopyH5pMutation({
    onError: () => {
      createMessage({
        message: t("form.h5p.copyError"),
        timeToLive: 0,
      });
    },
  });

  const embed: H5pMetaData | undefined = useMemo(
    () =>
      element.data
        ? {
            status: !!h5pMetaQuery.error || !h5pMetaQuery.data ? "error" : "success",
            data: h5pMetaQuery.data!,
            embedData: element.data,
            resource: "h5p",
          }
        : undefined,
    [h5pMetaQuery.data, h5pMetaQuery.error, element.data],
  );

  const handleRemove = () => {
    Transforms.removeNodes(editor, {
      at: ReactEditor.findPath(editor, element),
      voids: true,
    });
  };

  const handleCopy = async () => {
    if (!element.data?.url) return;
    const newCopy = await h5pCopyMutation.mutateAsync(element.data.url);
    Transforms.setNodes<H5pElement>(
      editor,
      { data: { ...element.data, url: newCopy.url, path: newCopy.url.replace(config.h5pApiUrl ?? "", "") } },
      { at: ReactEditor.findPath(editor, element) },
    );
  };

  return (
    <StyledEmbedWrapper {...attributes} aria-selected={isSelected} contentEditable={false}>
      <FigureButtons>
        {config.h5pMetaEnabled === true && <EditMetadataModal embed={embed} editor={editor} element={element} />}
        <EditH5PModal embed={embed} language={language} editor={editor} element={element} />
        {!!config.enableH5pCopy && (
          <IconButton
            variant="secondary"
            size="small"
            onClick={handleCopy}
            title={t("form.h5p.copy")}
            aria-label={t("form.h5p.copy")}
          >
            <FileCopyLine />
          </IconButton>
        )}
        <IconButton
          title={t("form.h5p.remove")}
          aria-label={t("form.h5p.remove")}
          variant="danger"
          size="small"
          onClick={handleRemove}
          data-testid="remove-h5p-element"
        >
          <DeleteBinLine />
        </IconButton>
      </FigureButtons>
      {h5pMetaQuery.isLoading || h5pCopyMutation.isPending || !embed ? <Spinner /> : <H5pEmbed embed={embed} />}
      {children}
    </StyledEmbedWrapper>
  );
};

export default SlateH5p;
