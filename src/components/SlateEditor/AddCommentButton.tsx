/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Editor, Path, Element } from "slate";
import { IconButtonV2 } from "@ndla/button";
import { Comment } from "@ndla/icons/common";
import { wrapBlockInComment } from "./plugins/comment/block/utils";

interface Props {
  editor: Editor;
  pathToEmbed: Path;
}

const AddCommentButton = ({ editor, pathToEmbed }: Props) => {
  const { t } = useTranslation();
  const [commentNode] = Editor.nodes(editor, {
    at: pathToEmbed,
    match: (node) => Element.isElement(node) && node.type === "comment-block",
  });

  const title = commentNode ? t("form.comment.alreadyExists") : t("form.comment.add");

  return (
    <IconButtonV2
      onClick={() => wrapBlockInComment(editor, pathToEmbed)}
      aria-label={title}
      title={title}
      colorTheme="light"
      disabled={!!commentNode}
    >
      <Comment />
    </IconButtonV2>
  );
};
export default AddCommentButton;
