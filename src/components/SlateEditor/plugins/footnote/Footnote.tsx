/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { SelectableSlateElement } from "../../common/SelectableSlateEmbed";
import { useEditableElement } from "../../utils/useEditableElement";
import FootnoteForm from "./FootnoteForm";
import { FootnoteElement } from "./types";

interface Props extends RenderElementProps {
  editor: Editor;
  element: FootnoteElement;
}

const Footnote = ({ attributes, children, editor, element }: Props) => {
  const { t } = useTranslation();
  const { handleEditingChange, handleRemove, handleSave, dialogProps } = useEditableElement(element, editor);

  return (
    <DialogRoot {...dialogProps}>
      <sup>
        <DialogTrigger asChild>
          <SelectableSlateElement asChild>
            <Button variant="link" {...attributes}>
              [#]
            </Button>
          </SelectableSlateElement>
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
              onClose={() => handleEditingChange(false)}
              isEdit={!!element.data.title}
              onRemove={handleRemove}
              onSave={(data) => handleSave({ data })}
            />
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default Footnote;
