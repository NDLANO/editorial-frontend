/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import { Field } from '../../../Fields';

const classes = new BEMHelper({
  name: 'toolbar',
  prefix: 'c-',
});

const SlateToolbarLink = props => {
  const {
    text,
    url,
    showDialog,
    onSubmit,
    onChange,
  } = props;


  return (
    <div {...classes('link-overlay', showDialog ? 'open' : 'hidden')}>
      <div {...classes('link-dialog')}>
          <Field>
            <label htmlFor='text'>
              Tekst
            </label>
            <input name="text" type="text" value={text} onChange={onChange}/>
          </Field>
          <Field>
            <label htmlFor='url'>
              Url
            </label>
            <input name="url" type="text" value={url} onChange={onChange}/>
          </Field>
          <Field>
            <Button onClick={onSubmit}>
              Lagre
            </Button>
          </Field>
      </div>
    </div>
  );
};

SlateToolbarLink.propTypes = {

};

export default SlateToolbarLink;
