/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Node } from "slate";
import { RenderElementProps } from "slate-react";
import EditorErrorMessage from "../../EditorErrorMessage";
import { EmbedElements } from "../embed";

interface Props {
  attributes: RenderElementProps["attributes"];
  element: EmbedElements;
}

const NoEmbedMessage = ({ attributes, element }: Props) => {
  const { t } = useTranslation();

  const text = Node.string(element);
  const embed = element.data;
  const msg = text.length > 0 ? text : t("noEmbedMessage.deleteOnSave", { type: embed?.resource });

  return <EditorErrorMessage attributes={attributes} msg={msg} />;
};

export default NoEmbedMessage;
