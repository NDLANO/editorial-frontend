/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState, ReactNode } from "react";
import { styled } from "@ndla/styled-system/jsx";

type Props = {
  show?: boolean;
  children: ReactNode;
};

const StyledFade = styled("div", {
  base: {
    animation: "fade-shift-in 200ms",
  },
});

const Fade = ({ show = true, children }: Props) => {
  const [shouldRender, setRender] = useState(true);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  if (!shouldRender) return null;

  return <StyledFade onAnimationEnd={onAnimationEnd}>{children}</StyledFade>;
};

export default Fade;
