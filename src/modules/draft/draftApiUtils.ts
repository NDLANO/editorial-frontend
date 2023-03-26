/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ILicense as ImageApiLicense } from '@ndla/types-image-api';
import { ILicense as DraftApiLicense } from '@ndla/types-draft-api';

export const draftLicensesToImageLicenses = (licenses: DraftApiLicense[]): ImageApiLicense[] =>
  licenses.map(l => ({ license: l.license, description: l.description ?? '', url: l.url }));
