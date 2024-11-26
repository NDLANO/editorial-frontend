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
import { DeleteBinLine } from "@ndla/icons/action";
import { IconButton, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { H5pMetaData } from "@ndla/types-embed";
import { EmbedWrapper, H5pEmbed } from "@ndla/ui";
import EditH5PModal from "./EditH5PModal";
import EditMetadataModal from "./EditMetadataModal";
import { H5pElement } from "./types";
import config from "../../../../config";
import { useH5pMeta } from "../../../../modules/embed/queries";
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

  const h5pMetaQuery = useH5pMeta(element.data?.path!, element.data?.url!, {
    enabled: !!element.data?.path,
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

  return (
    <StyledEmbedWrapper {...attributes} aria-selected={isSelected} contentEditable={false}>
      <FigureButtons>
        {config.h5pMetaEnabled === true && <EditMetadataModal embed={embed} editor={editor} element={element} />}
        <EditH5PModal embed={embed} language={language} editor={editor} element={element} />
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
      {h5pMetaQuery.isLoading || !embed ? <Spinner /> : <H5pEmbed embed={embed} />}
      {children}
    </StyledEmbedWrapper>
  );
};

export default SlateH5p;
