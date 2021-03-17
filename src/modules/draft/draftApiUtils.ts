/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { License } from '../../interfaces';
import { ImageApiLicense } from '../image/imageApiInterfaces';

export const draftLicensesToImageLicenses = (licenses: License[]): ImageApiLicense[] =>
  licenses.map(l => ({ license: l.license, description: l.description || '', url: l.url }));
