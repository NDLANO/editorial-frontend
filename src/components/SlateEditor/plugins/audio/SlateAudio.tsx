/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSelected } from "slate-react";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { spacing, colors, stackOrder } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { Pencil } from "@ndla/icons/action";
import { Link } from "@ndla/icons/common";
import { DeleteForever } from "@ndla/icons/editor";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { SafeLinkIconButton } from "@ndla/safelink";
import { AudioEmbedData, AudioMetaData } from "@ndla/types-embed";
import { AudioEmbed } from "@ndla/ui";
import AudioEmbedForm from "./AudioEmbedForm";
import { AudioElement } from "./types";
import { useAudioMeta } from "../../../../modules/embed/queries";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { StyledDeleteEmbedButton, StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: AudioElement;
  editor: Editor;
}

const AudioWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  &[data-type="minimal"] {
    justify-content: flex-end;
    flex-direction: row-reverse;
    gap: ${spacing.xsmall};
  }
  &[data-selected="true"] {
    figure {
      outline: 2px solid ${colors.brand.primary};
    }
  }
`;

const FigureButtons = styled(StyledFigureButtons)`
  right: ${spacing.small};
  top: ${spacing.medium};
  z-index: ${stackOrder.offsetSingle};
  &[data-type="minimal"] {
    position: static;
    top: unset;
    right: unset;
  }
`;

const SlateAudio = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const isSelected = useSelected();
  const language = useArticleLanguage();

  const audioMetaQuery = useAudioMeta(element.data?.resourceId!, language, {
    enabled: !!parseInt(element.data?.resourceId ?? ""),
  });
  const embed: AudioMetaData | undefined = useMemo(
    () =>
      element.data
        ? {
            status: !!audioMetaQuery.error || !audioMetaQuery.data ? "error" : "success",
            data: {
              ...audioMetaQuery.data!,
              manuscript: audioMetaQuery.data?.manuscript
                ? {
                    ...audioMetaQuery.data.manuscript,
                    manuscript: audioMetaQuery.data.manuscript.manuscript,
                  }
                : undefined,
            },
            embedData: element.data,
            resource: "audio",
          }
        : undefined,
    [audioMetaQuery.data, audioMetaQuery.error, element.data],
  );

  const handleRemove = () => {
    Transforms.removeNodes(editor, {
      at: ReactEditor.findPath(editor, element),
      voids: true,
    });
  };

  const onClose = () => {
    setIsEditing(false);
    ReactEditor.focus(editor);
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  };

  const onSave = useCallback(
    (data: AudioEmbedData) => {
      setIsEditing(false);
      const properties = {
        data,
      };
      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, properties, { at: path });
      if (Editor.hasPath(editor, Path.next(path))) {
        setTimeout(() => {
          Transforms.select(editor, Path.next(path));
        }, 0);
      }
    },
    [editor, element],
  );

  return (
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      <AudioWrapper
        {...attributes}
        contentEditable={false}
        data-selected={isSelected}
        data-type={embed?.embedData.type}
      >
        {audioMetaQuery.isLoading ? (
          <Spinner />
        ) : embed ? (
          <>
            <FigureButtons data-type={embed.embedData.type}>
              {embed.embedData.type !== "podcast" && (
                <ModalTrigger>
                  <IconButtonV2 title={t("form.audio.edit")} aria-label={t("form.audio.edit")} variant="ghost">
                    <Pencil />
                  </IconButtonV2>
                </ModalTrigger>
              )}
              {embed.embedData.type !== "minimal" && (
                <>
                  <SafeLinkIconButton
                    colorTheme="light"
                    to={`/media/${embed.embedData.type === "podcast" ? "podcast" : "audio"}-upload/${
                      embed.embedData.resourceId
                    }/edit/${language}`}
                    target="_blank"
                    title={t("form.editOriginalAudio")}
                    aria-label={t("form.editOriginalAudio")}
                  >
                    <Link />
                  </SafeLinkIconButton>
                  <StyledDeleteEmbedButton
                    title={t("form.audio.remove")}
                    aria-label={t("form.audio.remove")}
                    colorTheme="danger"
                    onClick={handleRemove}
                    data-testid="remove-element"
                  >
                    <DeleteForever />
                  </StyledDeleteEmbedButton>
                </>
              )}
            </FigureButtons>
            <AudioEmbed embed={embed} />
          </>
        ) : null}
      </AudioWrapper>
      <ModalContent>
        {!!element.data && !!audioMetaQuery.data && (
          <AudioEmbedForm audio={audioMetaQuery.data} onSave={onSave} onCancel={onClose} embed={element.data} />
        )}
      </ModalContent>
      {children}
    </Modal>
  );
};

export default SlateAudio;
