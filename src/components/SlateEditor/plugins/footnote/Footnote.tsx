/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { Portal } from "@ark-ui/react";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@ndla/primitives";
import { FootnoteElement } from ".";
import FootnoteForm from "./FootnoteForm";
import { DialogCloseButton } from "../../../DialogCloseButton";

interface Props extends RenderElementProps {
  editor: Editor;
  element: FootnoteElement;
}

const Footnote = ({ attributes, children, editor, element }: Props) => {
  const { t } = useTranslation();

  const [editMode, setEditMode] = useState(!element.data.title);

  const onClose = () => {
    if (!element.data) {
      handleRemove();
    } else {
      setEditMode(false);
    }
  };

  const handleRemove = () => {
    if (element) {
      Transforms.removeNodes(editor, {
        at: ReactEditor.findPath(editor, element),
      });
      ReactEditor.focus(editor);
      setEditMode(false);
    }
  };

  const handleSave = (data: FootnoteElement["data"]) => {
    Transforms.setNodes(
      editor,
      { data },
      {
        at: ReactEditor.findPath(editor, element),
      },
    );

    setEditMode(false);
  };

  return (
    <DialogRoot open={editMode} onOpenChange={(details) => setEditMode(details.open)}>
      <sup>
        <DialogTrigger asChild>
          <Button variant="link" {...attributes}>
            [#]
          </Button>
        </DialogTrigger>
        {children}
      </sup>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(`form.content.footnote.${element.data.title ? "editTitle" : "addTitle"}`)}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <FootnoteForm
              footnote={element.data}
              onClose={onClose}
              isEdit={!!element.data.title}
              onRemove={handleRemove}
              onSave={handleSave}
            />
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default Footnote;
