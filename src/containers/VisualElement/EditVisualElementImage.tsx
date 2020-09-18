/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useState } from 'react';
import FocusTrapReact from 'focus-trap-react';
import { shadows } from '@ndla/core';
import { connect } from 'formik';
import Overlay from '../../components/Overlay';
import FigureInput from '../../components/SlateEditor/plugins/embed/FigureInput';
import { getSrcSets } from '../../util/imageEditorUtil';
import config from '../../config';
import { Embed, FormikInputEvent, TranslateType } from '../../interfaces';

const editorContentCSS = css`
  box-shadow: ${shadows.levitate1};
  position: relative;
`;

const imageEditorWrapperStyle = css`
  background-color: white;
`;

interface Props {
  t: TranslateType;
  embed: Embed;
  formik: { handleChange: Function };
  setEditModus: Function;
  submitted: boolean;
}

const EditVisualElementImage: React.FC<Props> = ({
  t,
  embed,
  formik,
  submitted,
  setEditModus,
}) => {
  const [state, setState] = useState({
    alt: embed.alt,
    caption: embed.caption,
    madeChanges: false,
  });

  const onSave = () => {
    formik.handleChange({
      target: { name: 'visualElementAlt', value: state.alt },
    });
    formik.handleChange({
      target: { name: 'visualElementCaption', value: state.caption },
    });
    setEditModus(false);
  };

  const onAbort = () => {
    setEditModus(false);
  };

  const onChange = (e: FormikInputEvent) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
      madeChanges: true,
    });
  };

  return (
    <div css={imageEditorWrapperStyle}>
      <Overlay />
      <FocusTrapReact
        focusTrapOptions={{
          onDeactivate: () => {
            setEditModus(false);
          },
          clickOutsideDeactivates: true,
          escapeDeactivates: true,
        }}>
        <div css={editorContentCSS}>
          <figure>
            <img
              src={`${config.ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`}
              alt={embed.alt}
              srcSet={getSrcSets(embed.resource_id, {})}
            />
          </figure>
          <FigureInput
            t={t}
            caption={state.caption}
            alt={state.alt}
            submitted={submitted}
            madeChanges={state.madeChanges}
            onChange={onChange}
            onAbort={onAbort}
            onSave={onSave}
          />
        </div>
      </FocusTrapReact>
    </div>
  );
};

// @ts-ignore
export default connect(EditVisualElementImage);
