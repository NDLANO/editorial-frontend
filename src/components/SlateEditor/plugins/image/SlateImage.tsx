/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from "query-string";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSelected } from "slate-react";
import styled from "@emotion/styled";
import { misc, spacing, stackOrder } from "@ndla/core";
import { Pencil } from "@ndla/icons/action";
import { Link } from "@ndla/icons/common";
import { DeleteForever } from "@ndla/icons/editor";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { IconButton } from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { ImageEmbedData, ImageMetaData } from "@ndla/types-embed";
import { ImageEmbed } from "@ndla/ui";
import ImageEmbedForm from "./ImageEmbedForm";
import { ImageElement } from "./types";
import { useImageMeta } from "../../../../modules/embed/queries";
import { OldSpinner } from "../../../OldSpinner";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { StyledFigureButtons } from "../embed/FigureButtons";

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

const disableImageCache = (embed: ImageMetaData | undefined): ImageMetaData | undefined => {
  if (embed?.status !== "success") return embed;
  // NOTE: We add a query parameter to the imageUrl to avoid cache
  const parsed = queryString.parseUrl(embed.data.image.imageUrl);
  const newQuery = queryString.stringify({ ...parsed.query, ts: Date.now() });
  const newUrl = `${parsed.url}?${newQuery}`;
  return {
    ...embed,
    data: {
      ...embed.data,
      image: {
        ...embed.data.image,
        imageUrl: newUrl,
      },
    },
  };
};

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

  const embedWithoutCaching = useMemo(() => disableImageCache(embed), [embed]);

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

  if (imageEmbedQuery.isLoading || !embed || !embedWithoutCaching) {
    return <OldSpinner />;
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
        <ImageEmbed embed={embedWithoutCaching}>
          <FigureButtons>
            <ModalTrigger>
              <IconButton
                title={t("form.image.editImage")}
                aria-label={t("form.image.editImage")}
                variant="secondary"
                size="small"
              >
                <Pencil />
              </IconButton>
            </ModalTrigger>
            <SafeLinkIconButton
              variant="secondary"
              size="small"
              to={`/media/image-upload/${embed.embedData.resourceId}/edit/${language}`}
              target="_blank"
              title={t("form.editOriginalImage")}
              aria-label={t("form.editOriginalImage")}
            >
              <Link />
            </SafeLinkIconButton>
            <IconButton
              title={t("form.image.removeImage")}
              aria-label={t("form.image.removeImage")}
              variant="danger"
              size="small"
              onClick={handleRemove}
              data-testid="remove-element"
            >
              <DeleteForever />
            </IconButton>
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
