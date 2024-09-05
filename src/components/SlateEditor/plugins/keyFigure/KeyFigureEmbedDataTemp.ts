/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { KeyFigureEmbedData } from "@ndla/types-embed";

// TODO: Remove this and use `KeyFigureEmbedData` directly once we can bump packages thank you
export interface KeyFigureEmbedDataTemp extends Omit<KeyFigureEmbedData, "imageId"> {
  imageId: string | undefined;
}
