/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { DeleteBinLine, PencilFill, LinkMedium } from "@ndla/icons";
import { DialogContent, DialogRoot, DialogTrigger, IconButton, Spinner } from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { BrightcoveMetaData } from "@ndla/types-embed";
import { BrightcoveEmbed } from "@ndla/ui";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps, useSelected } from "slate-react";
import { brightcoveMetaQueryOptions } from "../../../../modules/embed/queries";
import { inlineContentToHTML } from "../../../../util/articleContentConverter";
import { addBrightCoveTimeStampVideoid } from "../../../../util/videoUtil";
import { useEditableElement } from "../../utils/useEditableElement";
import { StyledFigureButtons } from "../embed/FigureButtons";
import EditVideo, { FormValues } from "./EditVideo";
import { BrightcoveEmbedElement } from "./types";
import { VideoWrapper } from "./VideoWrapper";

interface Props extends RenderElementProps {
  element: BrightcoveEmbedElement;
  editor: Editor;
}

const SlateVideo = ({ attributes, element, editor, children }: Props) => {
  const [hasError, setHasError] = useState(false);
  const { handleEditingChange, handleRemove, handleSave, dialogProps } = useEditableElement(element, editor);

  const { t, i18n } = useTranslation();

  const isSelected = useSelected();
  const brightcoveQuery = useQuery(
    brightcoveMetaQueryOptions(element.data?.videoid.split("&t=")[0] ?? "", i18n.language),
  );

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

  const onSave = (values: FormValues) => {
    if (!embed?.embedData) return;
    handleSave({
      data: {
        ...embed?.embedData,
        alt: values.alttext,
        caption: inlineContentToHTML(values.caption),
        videoid: addBrightCoveTimeStampVideoid(values.videoid, values.startTime),
      },
    });
  };

  return (
    <DialogRoot {...dialogProps}>
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
              to={`https://studio.brightcove.com/products/videocloud/media/videos/${embed.embedData.videoid.split("&t=")[0]}`}
              size="small"
            >
              <LinkMedium />
            </SafeLinkIconButton>
            <IconButton
              aria-label={t("form.video.remove")}
              title={t("form.video.remove")}
              variant="danger"
              onClick={handleRemove}
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
              <EditVideo
                onClose={() => handleEditingChange(false)}
                onSave={onSave}
                embed={element.data}
                setHasError={setHasError}
              />
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
