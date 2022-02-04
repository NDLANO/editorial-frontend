import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { RenderLeafProps } from 'slate-react';
import { colors } from '@ndla/core';

interface Props {
  attributes: RenderLeafProps['attributes'];
  children: ReactNode;
  placeholder: string;
}

const WithPlaceHolder = ({ attributes, children, placeholder }: Props) => {
  const { t } = useTranslation();

  return (
    <span style={{ position: 'relative' }}>
      <span {...attributes}>{children}</span>
      <span
        style={{
          position: 'absolute',
          top: 0,
          opacity: 0.3,
          color: `${colors.black}`,
          pointerEvents: 'none',
          userSelect: 'none',
          display: 'inline-block',
        }}
        contentEditable={false}>
        {t(placeholder)}
      </span>
    </span>
  );
};

export default WithPlaceHolder;
