/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ImageMetaInformationV3DTO,
  AuthorDTO,
  NewImageMetaInformationV2DTO,
  UpdateImageMetaInformationDTO,
  LicenseDTO,
} from "@ndla/types-backend/image-api";
import { Descendant } from "slate";
import { RulesType } from "../../components/formikValidationSchema";
import { editorValueToPlainText, plainTextToEditorValue } from "../../util/articleContentConverter";

export const imageRules: RulesType<ImageFormikType, ImageMetaInformationV3DTO> = {
  title: {
    required: true,
    warnings: {
      languageMatch: true,
    },
  },
  caption: {
    warnings: {
      languageMatch: true,
    },
  },
  alttext: {
    required: true,
    warnings: {
      languageMatch: true,
    },
  },
  tags: {
    minItems: 3,
    warnings: {
      languageMatch: true,
    },
  },
  creators: {
    allObjectFieldsRequired: true,
  },
  processors: {
    allObjectFieldsRequired: true,
  },
  rightsholders: {
    allObjectFieldsRequired: true,
  },
  imageFile: {
    required: true,
  },
  license: {
    required: true,
    test: (values) => {
      const authors = values.creators.concat(values.rightsholders).concat(values.processors);
      if (!values.license || authors.length > 0) return undefined;
      return { translationKey: "validation.noLicenseWithoutCopyrightHolder" };
    },
  },
};

export interface ImageFormikType {
  id?: number;
  supportedLanguages: string[];
  title: Descendant[];
  language: string;
  alttext: string;
  caption: string;
  /** If undefined, we're creating an image. If string, we're editing an existing image. If blob, the currently active image hasn't been uploaded yet. */
  imageFile?: string | Blob;
  tags: string[];
  creators: AuthorDTO[];
  processors: AuthorDTO[];
  rightsholders: AuthorDTO[];
  processed: boolean;
  origin: string;
  license?: string;
  modelReleased: string;
  inactive: boolean;
}

export const imageApiTypeToFormType = (
  image: ImageMetaInformationV3DTO | undefined,
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
    inactive: image?.inactive ?? false,
  };
};

export const imageFormTypeToApiType = (
  values: ImageFormikType,
  licenses: LicenseDTO[] | undefined,
): (NewImageMetaInformationV2DTO & UpdateImageMetaInformationDTO) | undefined => {
  const license = licenses?.find((license) => license.license === values.license);
  if (
    license === undefined ||
    values.title === undefined ||
    values.alttext === undefined ||
    values.caption === undefined ||
    values.language === undefined ||
    values.tags === undefined ||
    values.origin === undefined ||
    values.creators === undefined ||
    values.processors === undefined ||
    values.rightsholders === undefined ||
    values.imageFile === undefined ||
    values.modelReleased === undefined
  ) {
    return undefined;
  }

  return {
    title: editorValueToPlainText(values.title),
    alttext: values.alttext,
    caption: values.caption,
    language: values.language,
    tags: values.tags,
    inactive: values.inactive,
    copyright: {
      license,
      origin: values.origin,
      creators: values.creators,
      processors: values.processors,
      rightsholders: values.rightsholders,
      processed: values.processed,
    },
    modelReleased: values.modelReleased,
  };
};
