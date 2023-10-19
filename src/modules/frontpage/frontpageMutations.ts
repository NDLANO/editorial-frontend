/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IFrontPage } from '@ndla/types-backend/frontpage-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postFrontpage } from './frontpageApi';
import { frontpageQueryKeys } from './frontpageQueries';

export const useUpdateFrontpageMutation = () => {
  const qc = useQueryClient();
  return useMutation<IFrontPage, unknown, IFrontPage>(postFrontpage, {
    onSettled: () => qc.invalidateQueries(frontpageQueryKeys.frontpage),
  });
};
