/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IFrontPage } from '@ndla/types-backend/frontpage-api';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { FRONTPAGE } from '../../queryKeys';
import { fetchFrontpage } from './frontpageApi';

export const frontpageQueryKey = () => [FRONTPAGE];

export const useFrontpage = (options?: UseQueryOptions<IFrontPage>) => {
  return useQuery<IFrontPage>(frontpageQueryKey(), () => fetchFrontpage(), options);
};
