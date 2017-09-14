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
import { uuid } from 'ndla-util';
import { FootNoteShape } from '../../../shapes';

const classes = new BEMHelper({
  name: 'footnotes',
  prefix: 'c-',
});

const Footnote = ({ footnote, id, t }) =>
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
        )}>{` ${footnote.title} (${footnote.year}), ${footnote.authors.join(
        ' ',
      )}, ${t(
        'learningResourceForm.fields.footNotes.edition',
      )}: ${footnote.edition}, ${t(
        'learningResourceForm.fields.footNotes.publisher',
      )}: ${footnote.publisher}`}</cite>
    </span>
  </li>;

Footnote.propTypes = {
  id: PropTypes.string.isRequired,
  footnote: FootNoteShape.isRequired,
  editionTitle: PropTypes.string,
  publisherTitle: PropTypes.string,
};

const LearningResourceFootNotes = ({ footnotes, t }) =>
  <ol {...classes()}>
    {footnotes.map((footnote, i) =>
      <Footnote key={uuid()} id={i.toString()} t={t} footnote={footnote} />,
    )}
  </ol>;

LearningResourceFootNotes.propTypes = {
  footnotes: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

export default LearningResourceFootNotes;
