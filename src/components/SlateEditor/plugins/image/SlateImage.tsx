/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { PencilFill, DeleteBinLine, LinkMedium } from "@ndla/icons";
import { DialogContent, DialogRoot, DialogTrigger, IconButton, Spinner } from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { ImageEmbedData, ImageMetaData } from "@ndla/types-embed";
import { EmbedWrapper, ImageEmbed } from "@ndla/ui";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSelected } from "slate-react";
import { useImageMeta } from "../../../../modules/embed/queries";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { restoreFocusOnPopperExit } from "../../utils/restoreFocusOnPopperExit";
import { StyledFigureButtons } from "../embed/FigureButtons";
import ImageEmbedForm from "./ImageEmbedForm";
import { ImageElement } from "./types";

interface Props extends RenderElementProps {
  element: ImageElement;
  editor: Editor;
  allowDecorative?: boolean;
}

const StyledEmbedWrapper = styled(EmbedWrapper, {
  base: {
    width: "100%",
  },
  variants: {
    variant: {
      invalid: {
        "& figure": {
          outline: "2px solid",
          outlineColor: "stroke.error",
        },
      },
      selected: {
        "& figure": {
          outline: "2px solid",
          outlineColor: "stroke.default",
        },
      },
    },
    fullSize: {
      true: {
        display: "inline-block",
      },
    },
  },
});

const FigureButtons = styled(StyledFigureButtons, {
  base: {
    right: "xsmall",
    top: "xsmall",
    zIndex: "docked",
  },
});

const disableImageCache = (embed: ImageMetaData | undefined): ImageMetaData | undefined => {
  if (embed?.status !== "success") return embed;
  // NOTE: We add a query parameter to the imageUrl to avoid cache
  const urlObj = new URL(embed.data.image.imageUrl);
  urlObj.searchParams.set("ts", Date.now().toString());
  const newUrl = urlObj.toString();
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

  const imageEmbedQuery = useImageMeta(element.data?.resourceId ?? "", language, {
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
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      voids: true,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
    }, 0);
  };

  const onSave = useCallback(
    (data: ImageEmbedData) => {
      setIsEditing(false);
      const properties = {
        data,
      };
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, properties, { at: path });
    },
    [editor, element],
  );

  if (imageEmbedQuery.isLoading || !embed || !embedWithoutCaching) {
    return <Spinner />;
  }

  return (
    <DialogRoot
      open={isEditing}
      onOpenChange={(details) => setIsEditing(details.open)}
      onExitComplete={() => restoreFocusOnPopperExit(editor)}
    >
      <StyledEmbedWrapper
        {...attributes}
        contentEditable={false}
        noClear
        variant={
          embed.embedData.isDecorative === "false" && !embed.embedData.alt
            ? "invalid"
            : isSelected
              ? "selected"
              : undefined
        }
        fullSize={embed.embedData.size === "full"}
      >
        <ImageEmbed embed={embedWithoutCaching}>
          <FigureButtons>
            <DialogTrigger asChild>
              <IconButton
                title={t("form.image.editImage")}
                aria-label={t("form.image.editImage")}
                variant="secondary"
                size="small"
              >
                <PencilFill />
              </IconButton>
            </DialogTrigger>
            <SafeLinkIconButton
              variant="secondary"
              size="small"
              to={`/media/image-upload/${embed.embedData.resourceId}/edit/${language}`}
              target="_blank"
              title={t("form.editOriginalImage")}
              aria-label={t("form.editOriginalImage")}
            >
              <LinkMedium />
            </SafeLinkIconButton>
            <IconButton
              title={t("form.image.removeImage")}
              aria-label={t("form.image.removeImage")}
              variant="danger"
              size="small"
              onClick={handleRemove}
              data-testid="remove-element"
            >
              <DeleteBinLine />
            </IconButton>
          </FigureButtons>
        </ImageEmbed>
        <Portal>
          <DialogContent>
            <ImageEmbedForm
              embed={embed.embedData}
              image={embed.status === "success" ? embed.data : undefined}
              onSave={onSave}
              onClose={() => setIsEditing(false)}
              language={language}
              allowDecorative={allowDecorative}
            />
          </DialogContent>
        </Portal>
        {children}
      </StyledEmbedWrapper>
    </DialogRoot>
  );
};
export default SlateImage;
