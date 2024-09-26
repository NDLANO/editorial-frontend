/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { Cross, Pencil } from "@ndla/icons/action";
import { DeleteForever } from "@ndla/icons/editor";
import { ModalBody, ModalHeader, ModalTitle, Modal, ModalTrigger, ModalContent } from "@ndla/modal";
import { IconButton } from "@ndla/primitives";
import { BlogPostEmbedData } from "@ndla/types-embed";
import { BlogPostV2, EmbedWrapper } from "@ndla/ui";
import BlogPostForm from "./BlogPostForm";
import { BlogPostElement } from "./types";
import config from "../../../../config";
import { StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: BlogPostElement;
  editor: Editor;
}

const StyledEmbedWrapper = styled(EmbedWrapper)`
  width: fit-content;
`;

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0px;
`;

const StyledModalBody = styled(ModalBody)`
  padding-top: 0px;
  h2 {
    margin: 0px;
  }
`;

const imageUrl = `${config.ndlaApiUrl}/image-api/raw/id/`;

const SlateBlogPost = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(element.isFirstEdit);
  const { data } = element;

  const handleRemove = () => {
    Transforms.removeNodes(editor, {
      at: ReactEditor.findPath(editor, element),
      voids: true,
    });
  };

  const onClose = () => {
    setIsEditing(false);
    ReactEditor.focus(editor);
    if (element.isFirstEdit) {
      Transforms.removeNodes(editor, {
        at: ReactEditor.findPath(editor, element),
        voids: true,
      });
    }
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  };

  const onSave = useCallback(
    (data: BlogPostEmbedData) => {
      setIsEditing(false);
      const properties = {
        data,
        isFirstEdit: false,
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

  return (
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      <StyledEmbedWrapper {...attributes} data-testid="slate-blog-post" contentEditable={false}>
        {data && (
          <>
            <StyledFigureButtons>
              <ModalTrigger>
                <IconButton
                  variant="secondary"
                  size="small"
                  onClick={() => setIsEditing(true)}
                  aria-label={t("blogPostForm.title")}
                  title={t("blogPostForm.title")}
                >
                  <Pencil />
                </IconButton>
              </ModalTrigger>
              <IconButton
                aria-label={t("delete")}
                variant="danger"
                size="small"
                title={t("delete")}
                data-testid="remove-blogpost"
                onClick={handleRemove}
              >
                <DeleteForever />
              </IconButton>
            </StyledFigureButtons>
            <BlogPostV2
              title={data.title}
              author={data.author}
              size={data.size}
              url={data.url}
              metaImage={{
                url: `${imageUrl}/${data.imageId}`,
                alt: "",
              }}
            />
          </>
        )}
        {children}
      </StyledEmbedWrapper>
      <ModalContent>
        <StyledModalHeader>
          <ModalTitle>{t("blogPostForm.title")}</ModalTitle>
          <IconButton variant="tertiary" aria-label={t("close")} title={t("close")} onClick={onClose}>
            <Cross />
          </IconButton>
        </StyledModalHeader>
        <StyledModalBody>
          <BlogPostForm onSave={onSave} initialData={data} onCancel={onClose} />
        </StyledModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SlateBlogPost;
