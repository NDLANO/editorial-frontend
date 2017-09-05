/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { FootNoteShape } from '../../../shapes';

const classes = new BEMHelper({
  name: 'footnotes',
  prefix: 'c-',
});

const FootNote = ({ footNote, editionTitle, publisherTitle, id, t }) =>
  <li {...classes('item')} id={`${id}_cite`}>
    <span>
      <sup {...classes('backlink')}>
        <b>
          <a href={`#${id}_sup`}>[^]</a>
        </b>
      </sup>
    </span>
    <span>
      <cite
        {...classes(
          'cite',
        )}>{` ${footNote.title} (${footNote.year}), ${footNote.authors.join(
        ' ',
      )}, ${editionTitle ||
        t(
          'learningResourceForm.fields.footNotes.edition',
        )}: ${footNote.edition}, ${publisherTitle ||
        t(
          'learningResourceForm.fields.footNotes.publisher',
        )}: ${footNote.publisher}`}</cite>
    </span>
  </li>;

FootNote.propTypes = {
  id: PropTypes.string.isRequired,
  refNr: PropTypes.string.isRequired,
  footNote: FootNoteShape.isRequired,
  editionTitle: PropTypes.string,
  publisherTitle: PropTypes.string,
};

const LearningResourceFootNotes = ({ footNotes, ...rest }) =>
  <ol {...classes()}>
    {Object.keys(footNotes).map(key =>
      <FootNote
        id={key}
        key={key}
        refNr={key.replace('ref_', '')}
        footNote={footNotes[key]}
        {...rest}
      />,
    )}
  </ol>;

LearningResourceFootNotes.propTypes = {
  footNotes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default LearningResourceFootNotes;
