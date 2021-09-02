/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getLicenseByAbbreviation } from '@ndla/licenses';
import { License } from '../interfaces';

export const getLicensesWithTranslations = (
  licenses: License[],
  language: string,
  enableLicenseNA: boolean = false,
) =>
  licenses
    .filter(license => license.license !== 'N/A' || enableLicenseNA)
    .map(license => ({
      ...license,
      ...getLicenseByAbbreviation(license.license, language),
    }));
