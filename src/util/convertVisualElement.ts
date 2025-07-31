/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { IVisualElementDTO } from "@ndla/types-backend/frontpage-api";
import { BRIGHTCOVE_ELEMENT_TYPE } from "../components/SlateEditor/plugins/video/types";

export const getVisualElementId = (visualElement: IVisualElementDTO): string => {
  const splitter = visualElement.type === "brightcove" ? "=" : "/";
  const splittedUrl = visualElement.url.split(splitter);
  const id = splittedUrl.pop() ?? "";
  return id;
};

export const convertVisualElement = (visualElement: IVisualElementDTO): Descendant[] => {
  const id = getVisualElementId(visualElement);
  if (visualElement.type !== "brightcove") {
    return [
      slatejsx(
        "element",
        {
          type: visualElement.type,
          data: {
            url: visualElement.url,
            resource: visualElement.type,
            resourceId: id,
            alt: visualElement.alt,
            metaData: {
              id: id,
            },
          },
        },
        { text: "" },
      ),
    ];
  }

  const splittedUrl = visualElement.url.split("/");
  const account = splittedUrl[3];
  const player = splittedUrl[4].split("_")[0];

  return [
    slatejsx(
      "element",
      {
        type: BRIGHTCOVE_ELEMENT_TYPE,
        data: {
          url: visualElement.url,
          resource: visualElement.type,
          resourceId: id,
          caption: visualElement.alt,
          metaData: {
            id: id,
          },
          videoid: id,
          account: account,
          player: player,
        },
      },
      { text: "" },
    ),
  ];
};
