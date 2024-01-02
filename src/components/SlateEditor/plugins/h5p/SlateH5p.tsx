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
import styled from "@emotion/styled";
import { spacing, colors } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { DeleteForever } from "@ndla/icons/editor";
import { H5pMetaData } from "@ndla/types-embed";
import { H5pEmbed } from "@ndla/ui";
import EditH5PModal from "./EditH5PModal";
import EditMetadataModal from "./EditMetadataModal";
import { H5pElement } from "./types";
import config from "../../../../config";
import { useH5pMeta } from "../../../../modules/embed/queries";
import { StyledDeleteEmbedButton, StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: H5pElement;
  editor: Editor;
  language: string;
}

const H5pWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  > div {
    width: 100%;
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
  z-index: 1;
`;

const SlateH5p = ({ element, editor, attributes, language, children }: Props) => {
  const { t } = useTranslation();
  const isSelected = useSelected();

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
    <H5pWrapper {...attributes} data-selected={isSelected}>
      <div contentEditable={false}>
        <FigureButtons>
          {config.h5pMetaEnabled && <EditMetadataModal embed={embed} editor={editor} element={element} />}
          <EditH5PModal embed={embed} language={language} editor={editor} element={element} />
          <StyledDeleteEmbedButton
            title={t("form.h5p.remove")}
            aria-label={t("form.h5p.remove")}
            colorTheme="danger"
            onClick={handleRemove}
            data-testid="remove-h5p-element"
          >
            <DeleteForever />
          </StyledDeleteEmbedButton>
        </FigureButtons>
        {h5pMetaQuery.isLoading || !embed ? <Spinner /> : <H5pEmbed embed={embed} />}
      </div>
      {children}
    </H5pWrapper>
  );
};

export default SlateH5p;
