/**
 * Copyright (c) 2024-present, NDLA.
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
import { misc, spacing, stackOrder } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { Pencil } from "@ndla/icons/action";
import { Link } from "@ndla/icons/common";
import { DeleteForever } from "@ndla/icons/editor";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { SafeLinkIconButton } from "@ndla/safelink";
import { ImageEmbedData, ImageMetaData } from "@ndla/types-embed";
import { ImageEmbed } from "@ndla/ui";
import ImageEmbedForm from "./ImageEmbedForm";
import { ImageElement } from "./types";
import { useImageMeta } from "../../../../modules/embed/queries";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { StyledDeleteEmbedButton, StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: ImageElement;
  editor: Editor;
  allowDecorative?: boolean;
}

const StyledImageWrapper = styled.div`
  width: 100%;
  &:has(figure[data-sizetype="full"]) {
    display: inline-block;
  }

  &[data-invalid="true"] {
    figure {
      outline: 2px solid rgba(209, 55, 46, 0.3);
      border-bottom-right-radius: ${misc.borderRadius};
      border-bottom-left-radius: ${misc.borderRadius};
    }
  }
  &[data-selected="true"] {
    figure {
      outline: 2px solid rgb(32, 88, 143);
      border-bottom-right-radius: ${misc.borderRadius};
      border-bottom-left-radius: ${misc.borderRadius};
    }
  }
`;

const FigureButtons = styled(StyledFigureButtons)`
  right: ${spacing.small};
  top: ${spacing.small};
  z-index: ${stackOrder.offsetSingle};
`;

const SlateImage = ({ element, editor, attributes, children, allowDecorative = true }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const { t } = useTranslation();
  const language = useArticleLanguage();
  const isSelected = useSelected();

  const imageEmbedQuery = useImageMeta(element.data?.resourceId!, language, {
    enabled: !!parseInt(element.data?.resourceId ?? ""),
  });

  const embed: ImageMetaData | undefined = useMemo(() => {
    if (!element.data || imageEmbedQuery.isLoading) return undefined;
    return {
      status: !!imageEmbedQuery.error || !imageEmbedQuery.data ? "error" : "success",
      data: imageEmbedQuery.data!,
      embedData: element.data,
      resource: "image",
    };
  }, [element.data, imageEmbedQuery.data, imageEmbedQuery.error, imageEmbedQuery.isLoading]);

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
    (data: ImageEmbedData) => {
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

  if (imageEmbedQuery.isLoading || !embed) {
    return <Spinner />;
  }

  return (
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      <StyledImageWrapper
        {...attributes}
        contentEditable={false}
        draggable
        data-invalid={embed.embedData.isDecorative === "false" && !embed.embedData.alt}
        data-selected={isSelected}
      >
        <ImageEmbed embed={embed}>
          <FigureButtons>
            <ModalTrigger>
              <IconButtonV2 title={t("form.image.editImage")} aria-label={t("form.image.editImage")} colorTheme="light">
                <Pencil />
              </IconButtonV2>
            </ModalTrigger>
            <SafeLinkIconButton
              colorTheme="light"
              to={`/media/image-upload/${embed.embedData.resourceId}/edit/${language}`}
              target="_blank"
              title={t("form.editOriginalImage")}
              aria-label={t("form.editOriginalImage")}
            >
              <Link />
            </SafeLinkIconButton>
            <StyledDeleteEmbedButton
              title={t("form.image.removeImage")}
              aria-label={t("form.image.removeImage")}
              colorTheme="danger"
              onClick={handleRemove}
              data-testid="remove-element"
            >
              <DeleteForever />
            </StyledDeleteEmbedButton>
          </FigureButtons>
        </ImageEmbed>
        {children}
        <ModalContent>
          <ImageEmbedForm
            embed={embed.embedData}
            image={embed.status === "success" ? embed.data : undefined}
            onSave={onSave}
            onClose={onClose}
            language={language}
            allowDecorative={allowDecorative}
          />
        </ModalContent>
      </StyledImageWrapper>
    </Modal>
  );
};
export default SlateImage;
