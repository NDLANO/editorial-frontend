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
import { FootnoteShape } from '../../../shapes';

const classes = new BEMHelper({
  name: 'footnotes',
  prefix: 'c-',
});

const Footnote = ({ footnote, id, t }) => {
  const authors = footnote.authors.join(' ');
  const editonLabel = t('learningResourceForm.fields.footnotes.edition');
  const publisherLabel = t('learningResourceForm.fields.footnotes.publisher');
  return (
    <li {...classes('item')} id={`${id}_cite`}>
      <sup>
        {id}
      </sup>
      <cite>{` ${footnote.title} (${footnote.year}), ${authors}, ${editonLabel}: ${footnote.edition}, ${publisherLabel}: ${footnote.publisher}`}</cite>
    </li>
  );
};

Footnote.propTypes = {
  id: PropTypes.string.isRequired,
  footnote: FootnoteShape.isRequired,
  editionTitle: PropTypes.string,
  publisherTitle: PropTypes.string,
};

const LearningResourceFootnotes = ({ footnotes, t }) => {
  if (footnotes.length > 0) {
    return (
      <ol {...classes()}>
        {footnotes.map((footnote, i) =>
          <Footnote key={uuid()} id={`${i + 1}`} t={t} footnote={footnote} />,
        )}
      </ol>
    );
  }
  return null;
};

LearningResourceFootnotes.propTypes = {
  footnotes: PropTypes.arrayOf(FootnoteShape),
};

export default LearningResourceFootnotes;
