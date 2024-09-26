/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { Transforms } from "slate";
import { useSlateStatic } from "slate-react";
import styled from "@emotion/styled";
import { fonts } from "@ndla/core";
import { Pencil } from "@ndla/icons/action";
import { ModalBody, ModalCloseButton, ModalHeader, ModalTitle, Modal, ModalTrigger, ModalContent } from "@ndla/modal";
import { Button } from "@ndla/primitives";
import { TableElement } from "./interfaces";
import { OldSpinner } from "../../../OldSpinner";

const MonacoEditor = lazy(() => import("../../../MonacoEditor"));

interface Props {
  element: TableElement;
}

const StyledCode = styled.code`
  ${fonts.sizes(16)}
`;

const EditColgroupsModal = ({ element }: Props) => {
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
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <Button data-testid="edit-colgroups" title={t("form.content.table.edit-colgroups")}>
          {t("form.content.table.colgroups")}
          <Pencil />
        </Button>
      </ModalTrigger>
      <ModalContent size="large">
        <ModalHeader>
          <ModalTitle>{t("form.content.table.colgroupTitle")}</ModalTitle>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <p>
            {t("form.content.table.colgroupInfo")}
            <StyledCode>{'<colgroup><col><col><col style="width:200px;"></colgroup>'}</StyledCode>
          </p>
          <Suspense fallback={<OldSpinner />}>
            <MonacoEditor onChange={setColgroups} onSave={onSave} value={colgroups} size="small" />
          </Suspense>
          <Button onClick={() => onSave(colgroups)}>{t("form.save")}</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditColgroupsModal;
