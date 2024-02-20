/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent } from "react";
import { useTranslation } from "react-i18next";
import { AlignLeft, AlignCenter, AlignRight } from "@ndla/icons/editor";
import ImageEditorButton from "./ImageEditorButton";

const icon: Record<string, JSX.Element> = {
  left: <AlignLeft />,
  right: <AlignRight />,
  center: <AlignCenter />,
};

interface Props {
  currentAlign?: string;
  disabled?: boolean;
  alignType: string;
  onFieldChange: (evt: MouseEvent<HTMLButtonElement>, field: string, value: string) => void;
}

const ImageAlignButton = ({ currentAlign, disabled, alignType, onFieldChange }: Props) => {
  const { t } = useTranslation();
  const onChange = (evt: MouseEvent<HTMLButtonElement>) => {
    onFieldChange(evt, "align", alignType);
  };

  return (
    <ImageEditorButton
      aria-label={t(`form.image.alignment.${alignType}`)}
      tabIndex={-1}
      disabled={disabled}
      isActive={currentAlign === alignType}
      onClick={onChange}
      title={t(`form.image.alignment.${alignType}`)}
    >
      {icon[alignType]}
    </ImageEditorButton>
  );
};

export default ImageAlignButton;
