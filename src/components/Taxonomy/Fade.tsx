/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState, ReactNode } from 'react';
import { css } from '@emotion/react';
import { animations } from '@ndla/core';

type Props = {
  show?: boolean;
  children: ReactNode;
  fadeType: FadeType;
};

type FadeType = 'fadeIn' | 'fadeInTop' | 'fadeInBottom' | 'fadeInScaled';

const fadeOut = (
  fadeIn: FadeType,
): 'fadeOutTop' | 'fadeOutBottom' | 'fadeOutScaled' | 'fadeOut' => {
  if (fadeIn === 'fadeInTop') return 'fadeOutTop';
  if (fadeIn === 'fadeInBottom') return 'fadeOutBottom';
  if (fadeIn === 'fadeInScaled') return 'fadeOutScaled';
  return 'fadeOut';
};

const Fade = ({ show = true, fadeType, children }: Props) => {
  const [shouldRender, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setRender(false);
  };

  if (!shouldRender) return null;

  const animation = show ? animations[fadeType] : animations[fadeOut(fadeType)];
  return (
    <div
      css={css`
        ${animation(animations.durations.fast)}
      `}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  );
};

export default Fade;
