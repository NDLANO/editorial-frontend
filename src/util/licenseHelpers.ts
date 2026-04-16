/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getLicenseByAbbreviation, LicenseLocaleType } from "@ndla/licenses";
import { LicenseDTO } from "@ndla/types-backend/draft-api";

export const getLicensesWithTranslations = (
  licenses: LicenseDTO[],
  language: string,
  enableLicenseNA: boolean = false,
) => {
  return licenses.reduce<(LicenseDTO & LicenseLocaleType)[]>((acc, lic) => {
    if (lic.license !== "N/A" || enableLicenseNA) {
      acc.push({ ...lic, ...getLicenseByAbbreviation(lic.license, language) });
    }
    return acc;
  }, []);
};
