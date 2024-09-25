/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { Pencil } from "@ndla/icons/action";
import { DeleteForever, Expandable } from "@ndla/icons/editor";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { IconButton } from "@ndla/primitives";
import { IframeEmbedData, IframeMetaData, OembedEmbedData, OembedMetaData } from "@ndla/types-embed";
import { Text } from "@ndla/typography";
import { EmbedWrapper, ExternalEmbed, IframeEmbed } from "@ndla/ui";
import { ExternalEmbedForm } from "./ExternalEmbedForm";
import { ExternalElement, IframeElement } from "./types";
import { EXTERNAL_WHITELIST_PROVIDERS } from "../../../../constants";
import { WhitelistProvider } from "../../../../interfaces";
import { useExternalEmbed } from "../../../../modules/embed/queries";
import { urlDomain } from "../../../../util/htmlHelpers";
import { OldSpinner } from "../../../OldSpinner";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import EditorErrorMessage from "../../EditorErrorMessage";
import { StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: ExternalElement | IframeElement;
  editor: Editor;
}

const MIN_EMBED_HEIGHT = 100;

const StyledEmbedWrapper = styled(EmbedWrapper)`
  &:active,
  &:focus-within {
    outline: 2px solid ${colors.brand.primary};
    outline-offset: ${spacing.xxsmall};
  }
`;

const ExpandableButton = styled(IconButton)`
  position: absolute;
  right: ${spacing.nsmall};
  bottom: ${spacing.normal};
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  gap: ${spacing.small};
  h1 {
    text-transform: uppercase;
  }
`;

const StyledModalHeader = styled(ModalHeader)`
  justify-content: space-between;
  padding-inline: 0px;
  padding-bottom: ${spacing.xsmall};
  margin-inline: ${spacing.normal};
  border-bottom: 2px solid ${colors.brand.tertiary};
`;

const getAllowedProvider = (embed: OembedMetaData | IframeMetaData | undefined): WhitelistProvider | undefined => {
  const maybeProviderName =
    embed?.resource === "external" && embed?.status === "success" ? embed.data.oembed.providerName : undefined;
  const embedUrlOrigin = embed?.embedData.url && urlDomain(embed?.embedData.url);

  return EXTERNAL_WHITELIST_PROVIDERS.find((whitelistProvider) => {
    if (whitelistProvider.name === maybeProviderName) return true;
    if (embed?.resource === "iframe") return embedUrlOrigin;
    return whitelistProvider.url.includes(embedUrlOrigin ?? "");
  });
};

export const SlateExternal = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const language = useArticleLanguage();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(element.isFirstEdit);
  const metaQuery = useExternalEmbed(element.data!, language, {
    enabled: !!Object.keys(element.data ?? {}).length,
  });

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
      return [embed.data.oembed.providerName, embed.data.oembed.type];
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

  const handleRemove = useCallback(
    () =>
      Transforms.removeNodes(editor, {
        at: ReactEditor.findPath(editor, element),
        voids: true,
      }),
    [editor, element],
  );

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
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      {!!embed && (
        <StyledEmbedWrapper {...attributes} ref={wrapperRef} contentEditable={false}>
          <StyledFigureButtons>
            <ModalTrigger>
              <IconButton aria-label={editLabel} title={editLabel} variant="secondary" size="small">
                <Pencil />
              </IconButton>
            </ModalTrigger>
            <IconButton
              aria-label={deleteLabel}
              title={deleteLabel}
              variant="danger"
              size="small"
              onClick={handleRemove}
              data-testid="remove-element"
            >
              <DeleteForever />
            </IconButton>
          </StyledFigureButtons>
          {metaQuery.isLoading ? (
            <OldSpinner />
          ) : !allowedProvider ? (
            <EditorErrorMessage msg={t("displayOembed.notSupported", { type, provider: provider })} />
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
              <Expandable />
            </ExpandableButton>
          )}
        </StyledEmbedWrapper>
      )}
      <ModalContent size="large">
        <StyledModalHeader>
          <TitleWrapper>
            <ModalTitle>
              {element.data
                ? t("form.content.link.changeUrlResource", { type: type })
                : t("form.content.link.newUrlResource")}
            </ModalTitle>
            {provider && (
              <Text margin="none" textStyle="meta-text-small">
                {provider}
              </Text>
            )}
          </TitleWrapper>
          <ModalCloseButton />
        </StyledModalHeader>
        <ModalBody>
          <ExternalEmbedForm initialData={element.data} onSave={onSave} />
        </ModalBody>
      </ModalContent>
      {children}
    </Modal>
  );
};
