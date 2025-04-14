/**
 * Copyright (c) 2017-present, NDLA.
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
import { DeleteBinLine, PencilFill, LinkMedium } from "@ndla/icons";
import { DialogContent, DialogRoot, DialogTrigger, IconButton, Spinner } from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { BrightcoveMetaData } from "@ndla/types-embed";
import { BrightcoveEmbed, EmbedWrapper } from "@ndla/ui";
import EditVideo, { FormValues } from "./EditVideo";
import { isBrightcoveElement } from "./queries";
import { BrightcoveEmbedElement } from "./types";
import { useBrightcoveMeta } from "../../../../modules/embed/queries";
import { inlineContentToHTML } from "../../../../util/articleContentConverter";
import { addBrightCoveTimeStampVideoid } from "../../../../util/videoUtil";
import { StyledFigureButtons } from "../embed/FigureButtons";

export const VideoWrapper = styled(EmbedWrapper, {
  base: {
    display: "block",
    _selected: {
      outline: "2px solid",
      outlineColor: "stroke.default",
    },
    "&[data-error='true']": {
      outlineColor: "stroke.error",
    },
  },
});

interface Props extends RenderElementProps {
  element: BrightcoveEmbedElement;
  editor: Editor;
}

const SlateVideo = ({ attributes, element, editor, children }: Props) => {
  const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(false);

  const { t, i18n } = useTranslation();

  const isSelected = useSelected();
  const brightcoveQuery = useBrightcoveMeta(element.data?.videoid.split("&t=")[0] ?? "", i18n.language);

  const removeVideo = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, { at: path, match: isBrightcoveElement });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  }, [editor, element]);

  const embed: BrightcoveMetaData | undefined = useMemo(
    () =>
      element.data
        ? {
            status: !!brightcoveQuery.error || !brightcoveQuery.data ? "error" : "success",
            embedData: element.data,
            data: brightcoveQuery.data!,
            resource: "brightcove",
          }
        : undefined,
    [brightcoveQuery.data, brightcoveQuery.error, element.data],
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
  };

  const onSave = (values: FormValues) => {
    if (!embed?.embedData) return;
    Transforms.setNodes(
      editor,
      {
        data: {
          ...embed?.embedData,
          alt: values.alttext,
          caption: inlineContentToHTML(values.caption),
          videoid: addBrightCoveTimeStampVideoid(values.videoid, values.startTime),
        },
      },
      { match: isBrightcoveElement, at: ReactEditor.findPath(editor, element) },
    );
    onClose();
  };

  return (
    <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
      <VideoWrapper {...attributes} aria-selected={isSelected} data-error={hasError} contentEditable={false}>
        {!embed ? (
          <Spinner />
        ) : (
          <StyledFigureButtons>
            <DialogTrigger asChild>
              <IconButton
                aria-label={t("form.video.editVideo")}
                title={t("form.video.editVideo")}
                variant="secondary"
                size="small"
              >
                <PencilFill />
              </IconButton>
            </DialogTrigger>
            <SafeLinkIconButton
              variant="secondary"
              title={t("form.video.brightcove")}
              aria-label={t("form.video.brightcove")}
              to={`https://studio.brightcove.com/products/videocloud/media/videos/${
                embed.embedData.videoid.split("&t=")[0]
              }`}
              size="small"
            >
              <LinkMedium />
            </SafeLinkIconButton>
            <IconButton
              aria-label={t("form.video.remove")}
              title={t("form.video.remove")}
              variant="danger"
              onClick={removeVideo}
              data-testid="remove-video-element"
              size="small"
            >
              <DeleteBinLine />
            </IconButton>
          </StyledFigureButtons>
        )}
        <Portal>
          <DialogContent>
            {!!element.data && (
              <EditVideo onClose={onClose} onSave={onSave} embed={element.data} setHasError={setHasError} />
            )}
          </DialogContent>
        </Portal>
        {!embed || brightcoveQuery.isLoading ? <Spinner /> : <BrightcoveEmbed embed={embed} />}
        {children}
      </VideoWrapper>
    </DialogRoot>
  );
};

export default SlateVideo;
