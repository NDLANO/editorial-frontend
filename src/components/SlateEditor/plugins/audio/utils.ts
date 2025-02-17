/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { AUDIO_ELEMENT_TYPE } from "./audioTypes";

export const defaultAudioBlock = () => slatejsx("element", { type: AUDIO_ELEMENT_TYPE });
