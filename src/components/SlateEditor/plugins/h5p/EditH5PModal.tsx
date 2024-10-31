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
import styled from "@emotion/styled";
import { Link } from "@ndla/icons/common";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { IconButton } from "@ndla/primitives";
import { H5pEmbedData, H5pMetaData } from "@ndla/types-embed";
import { H5pElement } from "./types";
import config from "../../../../config";
import { getH5pLocale } from "../../../H5PElement/h5pApi";
import H5PElement, { OnSelectObject } from "../../../H5PElement/H5PElement";

const StyledModalBody = styled.div`
  display: flex;
  height: 100%;
`;

const StyledModalContent = styled(ModalContent)`
  padding: 0;
  width: 100% !important;
  height: 100%;
  max-height: 95%;
  overflow: hidden;
`;

interface Props {
  embed: H5pMetaData | undefined;
  language: string;
  element: H5pElement;
  editor: Editor;
}

const EditH5PModal = ({ embed, language, editor, element }: Props) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState<boolean>(!!element.isFirstEdit);

  const onSave = useCallback(
    (params: OnSelectObject) => {
      if (!params.path) {
        return;
      }
      setOpen(false);
      const cssUrl = encodeURIComponent(`${config.ndlaFrontendDomain}/static/h5p-custom-css.css`);
      const url = `${config.h5pApiUrl}${params.path}?locale=${getH5pLocale(language)}&cssUrl=${cssUrl}`;
      const embedData: H5pEmbedData = {
        resource: "h5p",
        path: params.path,
        title: params.title,
        alt: embed?.embedData.alt,
        url,
      };
      const properties = { data: embedData };
      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, properties, { at: path });
      if (Editor.hasPath(editor, Path.next(path))) {
        setTimeout(() => {
          Transforms.select(editor, Path.next(path));
        }, 0);
      }
    },
    [language, embed?.embedData.alt, editor, element],
  );

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

  return (
    <Modal open={isOpen} onOpenChange={setOpen}>
      <ModalTrigger>
        <IconButton variant="secondary" size="small" title={t("form.editH5p")} aria-label={t("form.editH5p")}>
          <Link />
        </IconButton>
      </ModalTrigger>
      <StyledModalContent size="large">
        <StyledModalBody>
          <H5PElement
            canReturnResources
            h5pUrl={embed?.embedData.url}
            onClose={onClose}
            locale={language}
            onSelect={onSave}
          />
        </StyledModalBody>
      </StyledModalContent>
    </Modal>
  );
};

export default EditH5PModal;
