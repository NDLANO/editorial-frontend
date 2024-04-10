/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSelected } from "slate-react";
import styled from "@emotion/styled";
import { colors } from "@ndla/core";
import { DeleteForever, Link } from "@ndla/icons/editor";
import { SafeLinkIconButton } from "@ndla/safelink";
import { BrightcoveMetaData } from "@ndla/types-embed";
import { BrightcoveEmbed } from "@ndla/ui";
import EditVideo from "./EditVideo";
import { BrightcoveEmbedElement, TYPE_EMBED_BRIGHTCOVE } from "./types";
import { useBrightcoveMeta } from "../../../../modules/embed/queries";
import Spinner from "../../../Spinner";
import { StyledDeleteEmbedButton, StyledFigureButtons } from "../embed/FigureButtons";

export const VideoWrapper = styled.div`
  position: relative;
  display: block;
  border-style: solid;
  border-width: 2px;
  border-color: transparent;

  &[data-outline="true"] {
    border-color: ${colors.brand.primary};
  }

  &[data-error="true"] {
    border-color: ${colors.support.red};
  }
`;

interface Props extends RenderElementProps {
  element: BrightcoveEmbedElement;
  editor: Editor;
}

const SlateVideo = ({ attributes, element, editor, children }: Props) => {
  const [hasError, setHasError] = useState(false);

  const {
    t,
    i18n: { language },
  } = useTranslation();

  const isSelected = useSelected();
  const brightcoveQuery = useBrightcoveMeta(element.data?.videoid.split("&t=")[0]!, language);

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

  return (
    <VideoWrapper {...attributes} data-selected={isSelected} data-error={hasError} contentEditable={false}>
      <StyledFigureButtons>
        {embed && (
          <>
            <EditVideo embed={embed} editor={editor} element={element} setHasError={setHasError} />
            <SafeLinkIconButton
              title={t("form.video.brightcove")}
              aria-label={t("form.video.brightcove")}
              colorTheme="light"
              to={`https://studio.brightcove.com/products/videocloud/media/videos/${embed.embedData.videoid}`}
            >
              <Link />
            </SafeLinkIconButton>
          </>
        )}
        <StyledDeleteEmbedButton
          aria-label={t("form.video.remove")}
          title={t("form.video.remove")}
          colorTheme="danger"
          onClick={removeVideo}
          data-testid="remove-video-element"
        >
          <DeleteForever />
        </StyledDeleteEmbedButton>
      </StyledFigureButtons>
      {!embed || brightcoveQuery.isLoading ? <Spinner /> : <BrightcoveEmbed embed={embed} />}
      {children}
    </VideoWrapper>
  );
};

export default SlateVideo;
