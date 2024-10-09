/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSelected } from "slate-react";
import styled from "@emotion/styled";
import { colors } from "@ndla/core";
import { Pencil } from "@ndla/icons/action";
import { DeleteForever, Link } from "@ndla/icons/editor";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { IconButton } from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { BrightcoveMetaData } from "@ndla/types-embed";
import { BrightcoveEmbed, EmbedWrapper } from "@ndla/ui";
import EditVideo, { FormValues } from "./EditVideo";
import { BrightcoveEmbedElement, TYPE_EMBED_BRIGHTCOVE } from "./types";
import { useBrightcoveMeta } from "../../../../modules/embed/queries";
import { inlineContentToHTML } from "../../../../util/articleContentConverter";
import { addBrightCoveTimeStampVideoid } from "../../../../util/videoUtil";
import Spinner from "../../../Spinner";
import { StyledFigureButtons } from "../embed/FigureButtons";

export const VideoWrapper = styled(EmbedWrapper)`
  display: block;
  outline: 2px solid transparent;

  &[data-selected="true"] {
    outline-color: ${colors.brand.primary};
  }

  &[data-error="true"] {
    outline-color: ${colors.support.red};
  }
`;

interface Props extends RenderElementProps {
  element: BrightcoveEmbedElement;
  editor: Editor;
}

const SlateVideo = ({ attributes, element, editor, children }: Props) => {
  const [hasError, setHasError] = useState(false);
  const [open, setOpen] = useState(false);

  const { t, i18n } = useTranslation();

  const isSelected = useSelected();
  const brightcoveQuery = useBrightcoveMeta(element.data?.videoid.split("&t=")[0]!, i18n.language);

  const removeVideo = useCallback(() => {
    ReactEditor.focus(editor);
    Transforms.removeNodes(editor, {
      at: ReactEditor.findPath(editor, element),
      match: (n) => Element.isElement(n) && n.type === TYPE_EMBED_BRIGHTCOVE,
    });
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
      {
        match: (node) => Element.isElement(node) && node.type === TYPE_EMBED_BRIGHTCOVE,
        at: ReactEditor.findPath(editor, element),
      },
    );
    onClose();
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <VideoWrapper {...attributes} data-selected={isSelected} data-error={hasError} contentEditable={false}>
        {!embed ? (
          <Spinner />
        ) : (
          <StyledFigureButtons>
            <ModalTrigger>
              <IconButton
                aria-label={t("form.video.editVideo")}
                title={t("form.video.editVideo")}
                variant="secondary"
                size="small"
              >
                <Pencil />
              </IconButton>
            </ModalTrigger>
            <SafeLinkIconButton
              variant="secondary"
              title={t("form.video.brightcove")}
              aria-label={t("form.video.brightcove")}
              to={`https://studio.brightcove.com/products/videocloud/media/videos/${embed.embedData.videoid.split("&t=")[0]}`}
              size="small"
            >
              <Link />
            </SafeLinkIconButton>
            <IconButton
              aria-label={t("form.video.remove")}
              title={t("form.video.remove")}
              variant="danger"
              onClick={removeVideo}
              data-testid="remove-video-element"
              size="small"
            >
              <DeleteForever />
            </IconButton>
          </StyledFigureButtons>
        )}
        <ModalContent>
          {element.data && (
            <EditVideo onClose={onClose} onSave={onSave} embed={element.data} setHasError={setHasError} />
          )}
        </ModalContent>
        {!embed || brightcoveQuery.isLoading ? <Spinner /> : <BrightcoveEmbed embed={embed} />}
        {children}
      </VideoWrapper>
    </Modal>
  );
};

export default SlateVideo;
