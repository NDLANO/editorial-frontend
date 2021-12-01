/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useTranslation } from 'react-i18next';
import Tooltip from '@ndla/tooltip';
import { Copyright, Publicdomain } from '@ndla/icons/licenses';
import ImageEditorButton from './ImageEditorButton';

const icon = {
  show: <Copyright />,
  hide: <Publicdomain />,
};

interface Props {
  currentSize?: string;
  onFieldChange: (evt: MouseEvent, field: string, value: string) => void;
  show: boolean;
}

const ShowBylineButton = ({ currentSize, onFieldChange, show }: Props) => {
  const { t } = useTranslation();
  const bylineTag = '-hide-byline';
  const hideByline = currentSize?.endsWith(bylineTag);

  const isActive = (show && !hideByline) || (!show && hideByline);

  const onChange = (evt: MouseEvent) => {
    if (!isActive) {
      onFieldChange(
        evt,
        'size',
        show && currentSize ? currentSize.replace(bylineTag, '') : currentSize + bylineTag,
      );
    }
  };

  return (
    <Tooltip tooltip={t(`form.image.byline.${show ? 'show' : 'hide'}`)}>
      <ImageEditorButton tabIndex={-1} isActive={isActive} stripped onClick={onChange}>
        {icon[show ? 'show' : 'hide']}
      </ImageEditorButton>
    </Tooltip>
  );
};

export default ShowBylineButton;
