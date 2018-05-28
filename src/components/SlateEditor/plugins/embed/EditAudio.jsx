import React from 'react';
import { func, string } from 'prop-types';
import BEMHelper from 'react-bem-helper';
import ObjectSelector from '../../../ObjectSelector';
import Overlay from '../../../../components/Overlay';
import FigureButtons from './FigureButtons';
import { EmbedShape } from '../../../../shapes';

const classes = new BEMHelper({
  name: 'related-box',
  prefix: 'c-',
});

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
    <div {...classes()}>
      <ObjectSelector
        onClick={e => e.stopPropagation()}
        onChange={onChange}
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
    <FigureButtons locale={locale} onRemoveClick={onRemoveClick} embed={embed} figureType="audio"/>
      {children}
    </div>
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

export default EditAudio;
