/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors } from "@ndla/core";
import { LearningPath } from "@ndla/icons/contentType";
import { ModalCloseButton, ModalBody, Modal, ModalTitle, ModalHeader, ModalTrigger, ModalContent } from "@ndla/modal";
import { ILearningPathV2 } from "@ndla/types-backend/learningpath-api";
import { fetchLearningpathsWithArticle } from "../../modules/learningpath/learningpathApi";
import { toLearningpathFull } from "../../util/routeHelpers";
import ListResource from "../Form/ListResource";

interface Props {
  id?: number;
  learningpaths: ILearningPathV2[];
  setLearningpaths: (lps: ILearningPathV2[]) => void;
}

const LearningpathIcon = styled(LearningPath)`
  margin-top: -3px;
  color: ${colors.brand.primary};
  cursor: pointer;
`;

const LearningpathConnection = ({ id, learningpaths, setLearningpaths }: Props) => {
  const { i18n, t } = useTranslation();

  useEffect(() => {
    if (id) {
      fetchLearningpathsWithArticle(id).then(setLearningpaths);
    }
  }, [id, setLearningpaths]);

  if (!learningpaths.length) {
    return null;
  }

  return (
    <Modal>
      <ModalTrigger>
        <ButtonV2
          variant="stripped"
          aria-label={t("form.learningpathConnections.sectionTitle")}
          title={t("form.learningpathConnections.sectionTitle")}
        >
          <LearningpathIcon />
        </ButtonV2>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t("form.learningpathConnections.title")}</ModalTitle>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          {learningpaths.map((element) => (
            <ListResource
              key={element.id}
              title={element.title.title}
              url={toLearningpathFull(element.id, i18n.language)}
              isExternal
            />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LearningpathConnection;
