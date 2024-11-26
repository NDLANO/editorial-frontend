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
import { ReactEditor } from "slate-react";
import { PencilFill } from "@ndla/icons/action";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  FieldLabel,
  FieldRoot,
  FieldTextArea,
  IconButton,
  Text,
} from "@ndla/primitives";
import { H5pEmbedData, H5pMetaData } from "@ndla/types-embed";
import { H5pElement } from "./types";
import { FormActionsContainer } from "../../../FormikForm";

// TODO: This has never been enabled. Will it be?

interface Props {
  embed: H5pMetaData | undefined;
  editor: Editor;
  element: H5pElement;
}

const EditMetadataModal = ({ embed, editor, element }: Props) => {
  const [alttext, setAlttext] = useState(embed?.embedData.alt);
  const [isOpen, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const onSaveMetadata = useCallback(() => {
    if (!embed?.embedData) return;
    setOpen(false);
    ReactEditor.focus(editor);
    const data: H5pEmbedData = { ...embed.embedData, alt: alttext };
    Transforms.setNodes(editor, { data }, { at: ReactEditor.findPath(editor, element) });
  }, [alttext, editor, element, embed?.embedData]);

  const onClose = () => {
    setOpen(false);
    ReactEditor.focus(editor);
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  };

  const onCancel = () => {
    setAlttext(embed?.embedData.alt);
    onClose();
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={(details) => setOpen(details.open)} size="small">
      <DialogTrigger asChild>
        <IconButton
          variant="secondary"
          size="small"
          title={t("form.h5p.metadata.edit")}
          aria-label={t("form.h5p.metadata.edit")}
        >
          <PencilFill />
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("form.h5p.metadata.edit")}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Text>{t("form.h5p.metadata.description")} </Text>
          <FieldRoot>
            <FieldLabel>{t("form.h5p.metadata.alttext")}</FieldLabel>
            <FieldTextArea
              name="alt"
              value={alttext}
              onChange={(e) => setAlttext(e.target.value)}
              placeholder={t("form.h5p.metadata.alttext")}
            />
          </FieldRoot>
          <FormActionsContainer>
            <Button onClick={onCancel}>{t("form.h5p.metadata.cancel")}</Button>
            <Button onClick={onSaveMetadata} disabled={alttext === embed?.embedData.alt}>
              {t("form.h5p.metadata.save")}
            </Button>
          </FormActionsContainer>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default EditMetadataModal;
