/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSelected } from "slate-react";
import { Portal } from "@ark-ui/react";
import { DeleteBinLine, FileCopyLine, LinkMedium } from "@ndla/icons";
import { DialogBody, DialogContent, DialogRoot, DialogTrigger, IconButton, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { H5pEmbedData, H5pMetaData } from "@ndla/types-embed";
import { EmbedWrapper, H5pEmbed } from "@ndla/ui";
import EditMetadataDialog from "./EditMetadataDialog";
import { isH5pElement } from "./queries";
import { H5pElement } from "./types";
import config from "../../../../config";
import { useMessages } from "../../../../containers/Messages/MessagesProvider";
import { useH5pMeta } from "../../../../modules/embed/queries";
import { useCopyH5pMutation } from "../../../../modules/h5p/h5pMutations";
import { getH5pLocale } from "../../../H5PElement/h5pApi";
import H5PElement, { OnSelectObject } from "../../../H5PElement/H5PElement";
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

const StyledDialogBody = styled(DialogBody, {
  base: {
    display: "flex",
    height: "100%",
    paddingInline: 0,
    paddingBlock: 0,
  },
});

const StyledDialogContent = styled(DialogContent, {
  base: {
    maxHeight: "95%",
    height: "100%",
    width: "100%",
  },
});

const SlateH5p = ({ element, editor, attributes, children }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { t } = useTranslation();
  const isSelected = useSelected();
  const language = useArticleLanguage();
  const { createMessage } = useMessages();

  useEffect(() => {
    setOpen(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

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

  useEffect(() => {
    if (isCopied && embed) {
      setOpen(true);
      setIsCopied(false);
    }
  }, [embed, isCopied]);

  const handleRemove = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      voids: true,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const onSave = useCallback(
    (params: OnSelectObject) => {
      if (!params.path) {
        return;
      }
      setOpen(false);
      const cssUrl = encodeURIComponent(`${config.ndlaFrontendDomain}/static/h5p-custom-css.css`);
      const url = `${config.h5pApiUrl}${params.path}?locale=${getH5pLocale(language)}&cssUrl=${cssUrl}`;
      const embedData: H5pEmbedData = {
        resource: "h5p",
        path: params.path,
        title: params.title,
        alt: embed?.embedData.alt,
        url,
      };
      const properties = { data: embedData };
      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, properties, { at: path });
      if (Editor.hasPath(editor, Path.next(path))) {
        setTimeout(() => {
          Transforms.select(editor, Path.next(path));
        }, 0);
      }
    },
    [language, embed?.embedData.alt, editor, element],
  );

  const onClose = () => {
    setOpen(false);
    ReactEditor.focus(editor);
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
    if (!element.data) {
      Transforms.removeNodes(editor, { at: path, match: isH5pElement });
    }
  };

  const handleCopy = async () => {
    if (!element.data?.url) return;
    const newCopy = await h5pCopyMutation.mutateAsync(element.data.url);
    if (newCopy) {
      Transforms.setNodes<H5pElement>(
        editor,
        { data: { ...element.data, url: newCopy.url, path: newCopy.url.replace(config.h5pApiUrl ?? "", "") } },
        { at: ReactEditor.findPath(editor, element) },
      );
      setIsCopied(true);
    }
  };

  return (
    <StyledEmbedWrapper {...attributes} aria-selected={isSelected} contentEditable={false}>
      <FigureButtons>
        {config.h5pMetaEnabled === true && <EditMetadataDialog embed={embed} editor={editor} element={element} />}
        <DialogRoot size="large" open={isOpen} onOpenChange={(details) => setOpen(details.open)}>
          <DialogTrigger asChild>
            <IconButton variant="secondary" size="small" title={t("form.editH5p")} aria-label={t("form.editH5p")}>
              <LinkMedium />
            </IconButton>
          </DialogTrigger>
          <Portal>
            <StyledDialogContent>
              <StyledDialogBody>
                <H5PElement
                  canReturnResources
                  h5pUrl={embed?.embedData.url}
                  onClose={onClose}
                  locale={language}
                  onSelect={onSave}
                />
              </StyledDialogBody>
            </StyledDialogContent>
          </Portal>
        </DialogRoot>
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
