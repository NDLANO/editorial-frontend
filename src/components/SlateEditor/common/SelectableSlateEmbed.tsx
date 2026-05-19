/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ark, HTMLArkProps } from "@ark-ui/react";
import { styled, StyledProps } from "@ndla/styled-system/jsx";
import { EmbedWrapper, EmbedWrapperProps } from "@ndla/ui";
import { useSelected } from "slate-react";

const StyledDiv = styled(
  ark.div,
  {
    base: {
      _selected: {
        outline: "2px solid",
        borderRadius: "xsmall",
        "&:not([data-invalid])": {
          outlineColor: "stroke.default",
        },
      },
      _invalid: {
        outline: "2px solid",
        outlineColor: "stroke.error",
        borderRadius: "xsmall",
      },
    },
  },
  { baseComponent: true },
);

interface Props {
  invalid?: boolean;
}

interface Props extends HTMLArkProps<"div">, StyledProps {
  invalid?: boolean;
}

export const SelectableSlateElement = ({ children, invalid, ...rest }: Props & HTMLArkProps<"div"> & StyledProps) => {
  const selected = useSelected();
  return (
    <StyledDiv data-selected={selected ? "true" : undefined} data-invalid={invalid ? "true" : undefined} {...rest}>
      {children}
    </StyledDiv>
  );
};

export const SelectableEmbedWrapper = ({ children, ...rest }: EmbedWrapperProps & Props) => {
  return (
    <SelectableSlateElement asChild {...rest}>
      <EmbedWrapper>{children}</EmbedWrapper>
    </SelectableSlateElement>
  );
};
