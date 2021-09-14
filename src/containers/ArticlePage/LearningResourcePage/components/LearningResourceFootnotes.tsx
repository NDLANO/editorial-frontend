/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import BEMHelper from 'react-bem-helper';
import { uuid } from '@ndla/util';
import { useTranslation } from 'react-i18next';

const classes = new BEMHelper({
  name: 'footnotes',
  prefix: 'c-',
});

export interface FootnoteType {
  title: string;
  year: string;
  resource: string;
  authors: string[];
  edition: string;
  publisher: string;
  type?: string;
}

interface FootnoteProps {
  footnote: FootnoteType;
  id: string;
}

const Footnote = ({ footnote, id }: FootnoteProps) => {
  const { t } = useTranslation();
  const authors = footnote.authors.join(' ');
  const editonLabel = t('learningResourceForm.fields.footnotes.edition');
  const publisherLabel = t('learningResourceForm.fields.footnotes.publisher');
  return (
    <li {...classes('item')} id={`${id}_cite`}>
      <sup>{id}</sup>
      <cite>{` ${footnote.title} (${footnote.year}), ${authors}, ${editonLabel}: ${footnote.edition}, ${publisherLabel}: ${footnote.publisher}`}</cite>
    </li>
  );
};

interface LearningResourceFootnotesProps {
  footnotes: FootnoteType[];
}

const LearningResourceFootnotes = ({ footnotes }: LearningResourceFootnotesProps) => {
  if (footnotes.length > 0) {
    return (
      <ol {...classes()}>
        {footnotes.map((footnote, i) => (
          <Footnote key={uuid()} id={`${i + 1}`} footnote={footnote} />
        ))}
      </ol>
    );
  }
  return null;
};

export default LearningResourceFootnotes;
