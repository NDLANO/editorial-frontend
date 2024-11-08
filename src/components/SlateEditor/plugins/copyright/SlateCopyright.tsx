/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { Portal } from "@ark-ui/react";
import { PencilFill } from "@ndla/icons/action";
import {
  DialogContent,
  DialogRoot,
  DialogTitle,
  DialogBody,
  DialogHeader,
  IconButton,
  DialogTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { CopyrightEmbedData, CopyrightMetaData } from "@ndla/types-embed";
import { CopyrightEmbed, EmbedWrapper } from "@ndla/ui";
import { EmbedCopyrightForm } from "./EmbedCopyrightForm";
import { CopyrightElement, TYPE_COPYRIGHT } from "./types";
import DeleteButton from "../../../DeleteButton";
import { DialogCloseButton } from "../../../DialogCloseButton";
import MoveContentButton from "../../../MoveContentButton";
import { StyledFigureButtons } from "../embed/FigureButtons";

interface Props {
  attributes: RenderElementProps["attributes"];
  children: ReactNode;
  editor: Editor;
  element: CopyrightElement;
}

const StyledEmbedWrapper = styled(EmbedWrapper, {
  base: {
    "& [data-copyright-content]": {
      border: "1px solid",
      borderColor: "stroke.default",
      padding: "xsmall",
    },
  },
});

const ButtonContainer = styled(StyledFigureButtons, {
  base: {
    top: "-xlarge",
    right: 0,
  },
});

const SlateCopyright = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setModalOpen(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

  const embed: CopyrightMetaData | undefined = useMemo(
    () =>
      element.data
        ? {
            status: "success",
            data: undefined,
            embedData: element.data,
            resource: element.data?.resource,
          }
        : undefined,
    [element.data],
  );

  const handleDelete = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_COPYRIGHT,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, Path.previous(path));
      Transforms.collapse(editor);
    }, 0);
  };

  const handleRemoveCopyright = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_COPYRIGHT,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const onClose = useCallback(() => {
    ReactEditor.focus(editor);
    setModalOpen(false);
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
  }, [editor, element]);

  const onSave = useCallback(
    (data: CopyrightEmbedData) => {
      setModalOpen(false);
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
    <StyledEmbedWrapper data-testid="slate-copyright-block" {...attributes}>
      <ButtonContainer contentEditable={false}>
        <DeleteButton aria-label={t("delete")} data-testid="delete-copyright" onClick={handleDelete} />
        <DialogRoot open={modalOpen} onOpenChange={(details) => setModalOpen(details.open)}>
          <DialogTrigger asChild>
            <IconButton
              variant="tertiary"
              size="small"
              aria-label={t("form.copyright.edit")}
              data-testid="edit-copyright"
              title={t("form.copyright.edit")}
            >
              <PencilFill />
            </IconButton>
          </DialogTrigger>
          <Portal>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("form.copyright.title")}</DialogTitle>
                <DialogCloseButton />
              </DialogHeader>
              <DialogBody>
                <EmbedCopyrightForm embedData={element.data} onCancel={onClose} onSave={onSave} />
              </DialogBody>
            </DialogContent>
          </Portal>
        </DialogRoot>
        <MoveContentButton
          aria-label={t("form.moveContent")}
          data-testid="move-copyright"
          onMouseDown={handleRemoveCopyright}
        />
      </ButtonContainer>
      {!!embed && <CopyrightEmbed embed={embed}>{children}</CopyrightEmbed>}
    </StyledEmbedWrapper>
  );
};

export default SlateCopyright;
