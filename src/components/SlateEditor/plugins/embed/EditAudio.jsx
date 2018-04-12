import React from 'react';
import { func, string } from 'prop-types';
import { Button } from 'ndla-ui';
import BEMHelper from 'react-bem-helper';
import { Cross } from 'ndla-icons/action';
import ObjectSelector from '../../../ObjectSelector';
import { editorClasses } from './SlateFigure';
import Overlay from '../../../../components/Overlay';

const classes = new BEMHelper({
  name: 'related-box',
  prefix: 'c-',
});

const EditAudio = ({
  onExit,
  onChange,
  audioType,
  onRemoveClick,
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
      <Button
        onClick={onRemoveClick}
        stripped
        {...editorClasses('delete-button')}>
        <Cross />
      </Button>
      {children}
    </div>
  </div>
);

EditAudio.propTypes = {
  onExit: func,
  onChange: func,
  audioType: string,
  onRemoveClick: func,
};

export default EditAudio;
