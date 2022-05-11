/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { uuid } from '@ndla/util';
import { colors } from '@ndla/core';

const FootnoteId = styled.sup`
  text-decoration: underline;
  color: ${colors.brand.primary};
`;

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
    <li className="c-footnotes__item" id={`${id}_cite`}>
      <FootnoteId>{id}</FootnoteId>
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
      <ol className="c-footnotes">
        {footnotes.map((footnote, i) => (
          <Footnote key={uuid()} id={`${i + 1}`} footnote={footnote} />
        ))}
      </ol>
    );
  }
  return null;
};

export default LearningResourceFootnotes;
