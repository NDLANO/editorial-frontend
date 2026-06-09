/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { mutationOptions } from "@tanstack/react-query";
import { deleteVersion, postVersion, publishVersion, putVersion } from "./versionApi";

export const postVersionMutationOptions = () => {
  return mutationOptions({ mutationFn: postVersion });
};

export const putVersionMutationOptions = () => {
  return mutationOptions({ mutationFn: putVersion });
};

export const deleteVersionMutationOptions = () => {
  return mutationOptions({ mutationFn: deleteVersion });
};

export const publishVersionMutationOptions = () => {
  return mutationOptions({ mutationFn: publishVersion });
};
