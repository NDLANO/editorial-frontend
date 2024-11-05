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
import { Portal } from "@ark-ui/react";
import { Pencil } from "@ndla/icons/action";
import { Link } from "@ndla/icons/common";
import { DeleteForever } from "@ndla/icons/editor";
import { DialogContent, DialogRoot, DialogTrigger, IconButton } from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { AudioEmbedData, AudioMetaData } from "@ndla/types-embed";
import { AudioEmbed, EmbedWrapper } from "@ndla/ui";
import AudioEmbedForm from "./AudioEmbedForm";
import { AudioElement } from "./types";
import { useAudioMeta } from "../../../../modules/embed/queries";
import { OldSpinner } from "../../../OldSpinner";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: AudioElement;
  editor: Editor;
}

const StyledEmbedWrapper = styled(EmbedWrapper, {
  base: {
    position: "relative",
    _selected: {
      outline: "2px solid",
      outlineColor: "stroke.default",
    },
  },
});

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
    <DialogRoot open={isEditing} onOpenChange={({ open }) => setIsEditing(open)}>
      <StyledEmbedWrapper
        {...attributes}
        contentEditable={false}
        aria-selected={isSelected}
        data-type={embed?.embedData.type}
      >
        {audioMetaQuery.isLoading ? (
          <OldSpinner />
        ) : embed ? (
          <>
            <StyledFigureButtons>
              {embed.embedData.type !== "podcast" && (
                <DialogTrigger asChild>
                  <IconButton
                    title={t("form.audio.edit")}
                    aria-label={t("form.audio.edit")}
                    variant="tertiary"
                    size="small"
                  >
                    <Pencil />
                  </IconButton>
                </DialogTrigger>
              )}
              {embed.embedData.type !== "minimal" && (
                <>
                  <SafeLinkIconButton
                    variant="secondary"
                    size="small"
                    to={`/media/${embed.embedData.type === "podcast" ? "podcast" : "audio"}-upload/${
                      embed.embedData.resourceId
                    }/edit/${language}`}
                    target="_blank"
                    title={t("form.editOriginalAudio")}
                    aria-label={t("form.editOriginalAudio")}
                  >
                    <Link />
                  </SafeLinkIconButton>
                  <IconButton
                    title={t("form.audio.remove")}
                    aria-label={t("form.audio.remove")}
                    variant="danger"
                    size="small"
                    onClick={handleRemove}
                    data-testid="remove-element"
                  >
                    <DeleteForever />
                  </IconButton>
                </>
              )}
            </StyledFigureButtons>
            <AudioEmbed embed={embed} />
          </>
        ) : null}
      </StyledEmbedWrapper>
      <Portal>
        <DialogContent>
          {!!element.data && !!audioMetaQuery.data && (
            <AudioEmbedForm audio={audioMetaQuery.data} onSave={onSave} onCancel={onClose} embed={element.data} />
          )}
        </DialogContent>
      </Portal>

      {children}
    </DialogRoot>
  );
};

export default SlateAudio;
