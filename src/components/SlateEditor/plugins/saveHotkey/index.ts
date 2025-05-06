/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import isHotkey from "is-hotkey";
import { SAVE_BUTTON_ID } from "../../../../constants";
import { createPlugin } from "@ndla/editor";
import { SAVE_HOTKEY_PLUGIN } from "./types";

const isSaveHotkey = isHotkey("mod+s");

export const saveHotkeyPlugin = createPlugin({
  name: SAVE_HOTKEY_PLUGIN,
  shortcuts: {
    onSave: {
      keyCondition: isSaveHotkey,
      handler: (_, event, logger) => {
        event.preventDefault();
        logger.log("Saving document");
        document.getElementById(SAVE_BUTTON_ID)?.click();
        return true;
      },
    },
  },
});

export default saveHotkeyPlugin;
