import React from 'react';
import { func, string } from 'prop-types';
import { injectT } from 'ndla-i18n';
import ObjectSelector from '../../../ObjectSelector';
import Overlay from '../../../../components/Overlay';
import FigureButtons from './FigureButtons';
import { EmbedShape } from '../../../../shapes';

const EditAudio = ({
  onExit,
  onChange,
  audioType,
  onRemoveClick,
  locale,
  embed,
  t,
  children,
}) => (
  <div>
    <Overlay onExit={onExit} />
    <ObjectSelector
      onClick={e => e.stopPropagation()}
      onChange={onChange}
      onBlur={onChange}
      name="audioType"
      labelKey="label"
      idKey="id"
      value={audioType}
      options={[
        {
          id: 'sound',
          label: t('form.audio.sound'),
        },
        {
          id: 'speech',
          label: t('form.audio.speech'),
        },
      ]}
    />
    <FigureButtons
      locale={locale}
      onRemoveClick={onRemoveClick}
      embed={embed}
      figureType="audio"
    />
    {children}
  </div>
);

EditAudio.propTypes = {
  onExit: func,
  onChange: func,
  audioType: string,
  onRemoveClick: func,
  locale: string,
  embed: EmbedShape.isRequired,
};

export default injectT(EditAudio);
