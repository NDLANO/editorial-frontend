/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction } from "react";
import { BaseRange } from "slate";
import { Portal } from "@ark-ui/react";
import { DialogBackdrop, DialogPositioner, DialogRoot, DialogStandaloneContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import RephraseModalContent from "./RephraseModalContent";

interface Props {
  selection: BaseRange | null;
  setSelection: Dispatch<SetStateAction<BaseRange | null>>;
}

// We need to portal both the dialog and the surrounding popover in order to not render invalid HTML in the editor.
// This is a workaround to avoid the popover being rendered above the dialog.
const StyledDialogBackdrop = styled(DialogBackdrop, {
  base: {
    zIndex: "popover",
  },
});
const StyledDialogPositioner = styled(DialogPositioner, {
  base: {
    zIndex: "popover",
  },
});

const RephraseModal = ({ selection, setSelection }: Props) => {
  return (
    <DialogRoot open={!!selection}>
      <Portal>
        <StyledDialogBackdrop />
        <StyledDialogPositioner>
          <DialogStandaloneContent>
            <RephraseModalContent selection={selection} setSelection={setSelection} />
          </DialogStandaloneContent>
        </StyledDialogPositioner>
      </Portal>
    </DialogRoot>
  );
};

export default RephraseModal;
