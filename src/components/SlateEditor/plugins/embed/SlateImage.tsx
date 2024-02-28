/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { ReactNode, useState, MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path } from "slate";
import { RenderElementProps, useSlateStatic } from "slate-react";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { Pencil } from "@ndla/icons/action";
import { DeleteForever, Link } from "@ndla/icons/editor";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { SafeLinkIconButton } from "@ndla/safelink";
import EditImage from "./EditImage";
import { StyledDeleteEmbedButton, StyledFigureButtons } from "./FigureButtons";
import { ImageEmbed } from "../../../../interfaces";
import { getSrcSets } from "../../../../util/imageEditorUtil";
import parseMarkdown from "../../../../util/parseMarkdown";
import { isTable } from "../table/slateHelpers";

interface Props {
  active?: boolean;
  attributes: RenderElementProps["attributes"];
  embed: ImageEmbed;
  figureClass?: { className: string };
  isSelectedForCopy?: boolean;
  language: string;
  onRemoveClick: (event: MouseEvent) => void;
  saveEmbedUpdates: (change: { [x: string]: string | undefined }) => void;
  visualElement: boolean;
  children: ReactNode;
  pathToEmbed: Path;
  allowDecorative?: boolean;
}

const StyledSlateImage = styled.div`
  &[data-border="false"] {
    border: 2px solid rgba(209, 55, 46, 0.3);
  }
`;

const StyledDiv = styled.div`
  p {
    margin: 0;
    text-align: center;
  }
`;

const StyledImg = styled.img`
  &[data-outline="true"] {
    box-shadow: "rgb(32, 88, 143) 0 0 0 2px";
  }
`;

const SlateImage = ({
  active,
  attributes,
  embed,
  figureClass,
  isSelectedForCopy,
  language,
  onRemoveClick,
  saveEmbedUpdates,
  visualElement,
  children,
  pathToEmbed,
  allowDecorative,
}: Props) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const showCopyOutline = isSelectedForCopy && (!editMode || !active);
  const editor = useSlateStatic();

  const [parentTable] = Editor.nodes(editor, {
    at: pathToEmbed,
    match: (node) => isTable(node),
  });
  const inTable = !!parentTable;

  const constructFigureClassName = () => {
    const isFullWidth = embed.align === "center";
    const size = embed.size && ["small", "xsmall"].includes(embed.size) ? `-${embed.size}` : "";
    const align = embed.align && ["left", "right"].includes(embed.align) ? `-${embed.align}` : "";

    return `c-figure ${!isFullWidth ? `u-float${size}${align}` : ""}`;
  };

  const transformData = () => {
    return {
      focalX: embed["focal-x"],
      focalY: embed["focal-y"],
      upperLeftX: embed["upper-left-x"],
      upperLeftY: embed["upper-left-y"],
      lowerRightX: embed["lower-right-x"],
      lowerRightY: embed["lower-right-y"],
    };
  };

  return (
    <Modal open={editMode} onOpenChange={setEditMode}>
      <StyledSlateImage
        {...attributes}
        draggable={!visualElement && !editMode}
        className={constructFigureClassName()}
        data-border={!!embed.alt && embed["is-decorative"]}
      >
        <ModalContent modalMargin="none">
          <EditImage
            embed={embed}
            saveEmbedUpdates={saveEmbedUpdates}
            setEditModus={setEditMode}
            language={language}
            allowDecorative={allowDecorative}
          />
        </ModalContent>
        {!visualElement && (
          <figure {...figureClass} contentEditable={false}>
            <StyledFigureButtons data-white={true}>
              <ModalTrigger>
                <IconButtonV2
                  aria-label={t("form.image.editImage")}
                  title={t("form.image.editImage")}
                  colorTheme="light"
                >
                  <Pencil />
                </IconButtonV2>
              </ModalTrigger>
              <SafeLinkIconButton
                colorTheme="light"
                to={`/media/image-upload/${embed.resource_id}/edit/${language}`}
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
                onClick={onRemoveClick}
                data-testid="remove-element"
              >
                <DeleteForever />
              </StyledDeleteEmbedButton>
            </StyledFigureButtons>
            <StyledImg
              alt={embed.alt}
              onClick={(e) => {
                e.stopPropagation();
                setEditMode(true);
              }}
              sizes={
                inTable
                  ? "(min-width: 1024px) 180px, (min-width: 768px) 180px, 100vw"
                  : "(min-width: 1280px) 1440px," +
                    "(min-width: 1024px) 1000px," +
                    "(min-width: 768px) 800px," +
                    "(min-width: 500px) 480px," +
                    "(min-width: 350px) 320px," +
                    "100vw"
              }
              srcSet={getSrcSets(embed.resource_id, transformData(), language)}
              data-outline={showCopyOutline}
            />
            <figcaption className="c-figure__caption" contentEditable={false}>
              <StyledDiv className="c-figure__info">
                {embed.caption && parse(parseMarkdown({ markdown: embed.caption, inline: true }))}
              </StyledDiv>
            </figcaption>
          </figure>
        )}
        {children}
      </StyledSlateImage>
    </Modal>
  );
};

export default SlateImage;
