/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FileUploadFileError } from "@ark-ui/react";
import { TFunction } from "i18next";

export const translateFileError = (error: FileUploadFileError, t: TFunction) => {
  const prefix = t("form.image.fileUpload.genericError");
  if (error === "FILE_TOO_LARGE") {
    return `${prefix}: ${t("form.image.fileUpload.tooLargeError")}`;
  } else if (error === "FILE_INVALID_TYPE") {
    return `${prefix}: ${t("form.image.fileUpload.fileTypeInvalidError")}`;
  } else return prefix;
};
