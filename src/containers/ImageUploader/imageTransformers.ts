/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { IImageMetaInformationV3DTO, IAuthorDTO, IImageDimensionsDTO } from "@ndla/types-backend/image-api";
import { plainTextToEditorValue } from "../../util/articleContentConverter";

export interface ImageFormikType {
  id?: number;
  language: string;
  supportedLanguages: string[];
  title: Descendant[];
  alttext: string;
  caption: string;
  imageFile?: string | Blob;
  tags: string[];
  creators: IAuthorDTO[];
  processors: IAuthorDTO[];
  rightsholders: IAuthorDTO[];
  processed: boolean;
  origin: string;
  license?: string;
  modelReleased: string;
  filepath?: string;
  contentType?: string;
  fileSize?: number;
  imageDimensions?: IImageDimensionsDTO;
}

export const imageApiTypeToFormType = (
  image: IImageMetaInformationV3DTO | undefined,
  language: string,
): ImageFormikType => {
  return {
    id: image?.id ? parseInt(image.id) : undefined,
    language,
    supportedLanguages: image?.supportedLanguages ?? [language],
    title: plainTextToEditorValue(image?.title.title || ""),
    alttext: image?.alttext.alttext ?? "",
    caption: image?.caption.caption ?? "",
    imageFile: image?.image.imageUrl,
    tags: image?.tags.tags ?? [],
    creators: image?.copyright.creators ?? [],
    processors: image?.copyright.processors ?? [],
    rightsholders: image?.copyright.rightsholders ?? [],
    processed: image?.copyright.processed ?? false,
    origin: image?.copyright.origin ?? "",
    license: image?.copyright.license.license !== "unknown" ? image?.copyright.license.license : undefined,
    modelReleased: image?.modelRelease ?? "not-set",
    contentType: image?.image.contentType,
    fileSize: image?.image.size,
    imageDimensions: image?.image.dimensions,
  };
};
