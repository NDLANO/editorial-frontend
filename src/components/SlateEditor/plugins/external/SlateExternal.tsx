/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSelected } from "slate-react";
import { Portal } from "@ark-ui/react";
import { isElementOfType } from "@ndla/editor";
import { PencilFill, DeleteBinLine, ErrorWarningLine, ExpandUpDownLine } from "@ndla/icons";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
  MessageBox,
  Spinner,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IframeEmbedData, IframeMetaData, OembedEmbedData, OembedMetaData } from "@ndla/types-embed";
import { EmbedWrapper, ExternalEmbed, IframeEmbed } from "@ndla/ui";
import { ExternalEmbedForm } from "./ExternalEmbedForm";
import { EXTERNAL_ELEMENT_TYPE, ExternalElement, IFRAME_ELEMENT_TYPE, IframeElement } from "./types";
import { EXTERNAL_WHITELIST_PROVIDERS } from "../../../../constants";
import { WhitelistProvider } from "../../../../interfaces";
import { useExternalEmbed } from "../../../../modules/embed/queries";
import { urlDomain } from "../../../../util/htmlHelpers";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: ExternalElement | IframeElement;
  editor: Editor;
}

const MIN_EMBED_HEIGHT = 100;

const StyledEmbedWrapper = styled(EmbedWrapper, {
  base: {
    "&[data-selected='true']": {
      outline: "2px solid",
      outlineColor: "stroke.default",
      outlineOffset: "3xsmall",
    },
  },
});

const ExpandableButton = styled(IconButton, {
  base: {
    position: "absolute",
    right: "small",
    bottom: "medium",
  },
});

const TitleWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: "xsmall",
  },
});

const getAllowedProvider = (embed: OembedMetaData | IframeMetaData | undefined): WhitelistProvider | undefined => {
  const maybeProviderName =
    embed?.resource === "external" && embed?.status === "success" ? embed.data.oembed?.providerName : undefined;

  // Valid oembed provider, use name
  if (maybeProviderName !== undefined) {
    return {
      name: maybeProviderName,
      url: [],
    };
  }

  const embedUrlOrigin = embed?.embedData.url ? urlDomain(embed?.embedData.url) : undefined;
  return EXTERNAL_WHITELIST_PROVIDERS.find((whitelistProvider) => {
    return whitelistProvider.url.includes(embedUrlOrigin ?? "");
  });
};

export const SlateExternal = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const language = useArticleLanguage();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const metaQuery = useExternalEmbed(element.data!, language, {
    enabled: !!Object.keys(element.data ?? {}).length,
  });

  useEffect(() => {
    setIsEditing(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

  const selected = useSelected();

  const embed: OembedMetaData | IframeMetaData | undefined = useMemo(() => {
    if (!element.data) return;
    return {
      status: !!metaQuery.error || !metaQuery.data ? "error" : "success",
      data: {
        ...metaQuery.data,
      },
      embedData: element.data,
      resource: element.data.resource,
    } as OembedMetaData | IframeMetaData;
  }, [element.data, metaQuery.data, metaQuery.error]);

  const [provider, type] = useMemo(() => {
    if (!embed || embed.status === "error") return [undefined, undefined];
    if (embed.resource === "external") {
      return [embed.data.oembed?.providerName, embed.data.oembed?.type];
    } else {
      return [undefined, "iframe"];
    }
  }, [embed]);

  const onSave = useCallback(
    (data: OembedEmbedData | IframeEmbedData) => {
      setIsEditing(false);
      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      // Slate doesn't like us wanting to update either an oembed node or an iframe node.
      Transforms.setNodes(editor, { isFirstEdit: false, data: data as OembedEmbedData }, { at: path });
      if (Editor.hasPath(editor, Path.next(path))) {
        setTimeout(() => {
          Transforms.select(editor, Path.next(path));
        }, 0);
      }
    },
    [editor, element],
  );

  const handleRemove = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: (node) => isElementOfType(node, [EXTERNAL_ELEMENT_TYPE, IFRAME_ELEMENT_TYPE]),
      voids: true,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  }, [editor, element]);

  const onMouseDown = useCallback(() => {
    const onMouseMove = (e: MouseEvent) => {
      const iframe = wrapperRef.current?.querySelector("iframe");
      if (iframe && iframe.clientHeight + e.movementY > MIN_EMBED_HEIGHT) {
        iframe.height = `${e.movementY + iframe.clientHeight}px`;
      }
    };

    const onMouseUp = () => {
      document.body.removeEventListener("mousemove", onMouseMove);
      const newData = {
        ...element.data,
        height: `${wrapperRef.current?.querySelector("iframe")?.clientHeight}px`,
      };
      Transforms.setNodes(editor, { data: newData }, { at: ReactEditor.findPath(editor, element) });
    };

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  }, [editor, element]);

  const allowedProvider = getAllowedProvider(embed);
  const editLabel = t("form.external.edit", { type: allowedProvider?.name || t("form.external.title") });
  const deleteLabel = t("form.external.remove", { type: allowedProvider?.name || t("form.external.title") });

  return (
    <DialogRoot open={isEditing} size="large" onOpenChange={(details) => setIsEditing(details.open)}>
      {!!embed && (
        <StyledEmbedWrapper {...attributes} data-selected={selected} ref={wrapperRef}>
          <StyledFigureButtons contentEditable={false}>
            <DialogTrigger asChild>
              <IconButton aria-label={editLabel} title={editLabel} variant="secondary" size="small">
                <PencilFill />
              </IconButton>
            </DialogTrigger>
            <IconButton
              aria-label={deleteLabel}
              title={deleteLabel}
              variant="danger"
              size="small"
              onClick={handleRemove}
              data-testid="remove-element"
            >
              <DeleteBinLine />
            </IconButton>
          </StyledFigureButtons>
          {metaQuery.isLoading ? (
            <Spinner />
          ) : !allowedProvider ? (
            <MessageBox variant="error">
              <ErrorWarningLine />
              {t("displayOembed.notSupported", { type, provider: provider })}
            </MessageBox>
          ) : embed?.resource === "external" ? (
            <ExternalEmbed embed={embed} />
          ) : embed?.resource === "iframe" ? (
            <IframeEmbed embed={embed} />
          ) : undefined}
          {embed?.resource === "iframe" && embed.embedData.type !== "fullscreen" && (
            <ExpandableButton
              onMouseDown={onMouseDown}
              contentEditable={false}
              variant="tertiary"
              size="small"
              aria-label={t("form.resize")}
            >
              <ExpandUpDownLine />
            </ExpandableButton>
          )}
          {children}
        </StyledEmbedWrapper>
      )}
      <Portal>
        <DialogContent>
          <DialogHeader>
            <TitleWrapper>
              <DialogTitle>
                {element.data
                  ? t("form.content.link.changeUrlResource", { type: type })
                  : t("form.content.link.newUrlResource")}
              </DialogTitle>
              {!!provider && <Text textStyle="label.small">{provider}</Text>}
            </TitleWrapper>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <ExternalEmbedForm initialData={element.data} onSave={onSave} />
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};
