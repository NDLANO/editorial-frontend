/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { PencilLine } from "@ndla/icons";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Spinner,
  Text,
} from "@ndla/primitives";
import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { Transforms } from "slate";
import { useSlateStatic } from "slate-react";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { FormActionsContainer } from "../../../FormikForm";
import { TableElement } from "./interfaces";

const MonacoEditor = lazy(() => import("../../../MonacoEditor"));

interface Props {
  element: TableElement;
}

const EditColgroupsDialog = ({ element }: Props) => {
  const [open, setOpen] = useState(false);
  const editor = useSlateStatic();
  const { t } = useTranslation();

  const [colgroups, setColgroups] = useState(element.colgroups || "");

  const onSave = (content: string) => {
    Transforms.setNodes(
      editor,
      { colgroups: content },
      {
        match: (node) => node === element,
      },
    );
    setOpen(false);
  };

  return (
    <DialogRoot open={open} size="large" onOpenChange={(details) => setOpen(details.open)}>
      <DialogTrigger asChild>
        <Button size="small" data-testid="edit-colgroups" title={t("form.content.table.edit-colgroups")}>
          {t("form.content.table.colgroups")}
          <PencilLine />
        </Button>
      </DialogTrigger>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("form.content.table.colgroupTitle")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <Text>
              {t("form.content.table.colgroupInfo")}
              <Text asChild consumeCss>
                <code>{'<colgroup><col><col><col style="width:200px;"></colgroup>'}</code>
              </Text>
            </Text>
            <Suspense fallback={<Spinner />}>
              <MonacoEditor onChange={setColgroups} onSave={onSave} value={colgroups} size="small" />
            </Suspense>
            <FormActionsContainer>
              <Button onClick={() => onSave(colgroups)}>{t("form.save")}</Button>
            </FormActionsContainer>
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default EditColgroupsDialog;
