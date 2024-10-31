/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { IconButtonV2 } from "@ndla/button";
import { ModalBody, ModalCloseButton, ModalTitle, ModalHeader, Modal, ModalTrigger, ModalContent } from "@ndla/modal";
import { HelpIcon } from "../../../components/HelpIcon";

const AudioFileInfoModal = () => {
  const { t } = useTranslation();

  return (
    <Modal>
      <ModalTrigger>
        <IconButtonV2
          title={t("form.audio.modal.label")}
          aria-label={t("form.audio.modal.label")}
          variant="stripped"
          colorTheme="light"
        >
          <HelpIcon />
        </IconButtonV2>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t("form.audio.modal.header")}</ModalTitle>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <ul>
            <li>{t("form.audio.info.multipleFiles")}</li>
            <li>{t("form.audio.info.changeFile")}</li>
            <li>{t("form.audio.info.newLanguage")}</li>
            <li>{t("form.audio.info.deleteFiles")}</li>
          </ul>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AudioFileInfoModal;
