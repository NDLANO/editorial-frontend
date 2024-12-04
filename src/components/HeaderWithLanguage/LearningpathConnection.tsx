/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { TextWrap } from "@ndla/icons";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
} from "@ndla/primitives";
import { ILearningPathV2 } from "@ndla/types-backend/learningpath-api";
import { fetchLearningpathsWithArticle } from "../../modules/learningpath/learningpathApi";
import { toLearningpathFull } from "../../util/routeHelpers";
import { DialogCloseButton } from "../DialogCloseButton";
import ListResource from "../Form/ListResource";

interface Props {
  id?: number;
  learningpaths: ILearningPathV2[];
  setLearningpaths: (lps: ILearningPathV2[]) => void;
}

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
    <DialogRoot>
      <DialogTrigger asChild>
        <IconButton
          size="small"
          variant="tertiary"
          aria-label={t("form.learningpathConnections.sectionTitle")}
          title={t("form.learningpathConnections.sectionTitle")}
        >
          <TextWrap />
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("form.learningpathConnections.title")}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          {learningpaths.map((element) => (
            <ListResource
              key={element.id}
              title={element.title.title}
              url={toLearningpathFull(element.id, i18n.language)}
              isExternal
            />
          ))}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default LearningpathConnection;
