/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";
import { uuid } from "@ndla/util";
import { useTranslation } from "react-i18next";

const FootnoteId = styled("sup", {
  base: {
    textDecoration: "underline",
    color: "text.action",
  },
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
  const authors = footnote.authors.join(" ");
  const editonLabel = t("learningResourceForm.fields.footnotes.edition");
  const publisherLabel = t("learningResourceForm.fields.footnotes.publisher");
  return (
    <li id={`${id}_cite`}>
      <FootnoteId>{id}</FootnoteId>
      <cite>{` ${footnote.title} (${footnote.year}), ${authors}, ${editonLabel}: ${footnote.edition}, ${publisherLabel}: ${footnote.publisher}`}</cite>
    </li>
  );
};

interface LearningResourceFootnotesProps {
  footnotes: FootnoteType[];
}

const FootnotesList = styled("ol", {
  base: {
    borderTop: "2px solid",
    borderColor: "stroke.subtle",
    color: "text.subtle",
    paddingBlockStart: "large",
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    textStyle: "label.small",
  },
});

const LearningResourceFootnotes = ({ footnotes }: LearningResourceFootnotesProps) => {
  if (footnotes.length > 0) {
    return (
      <FootnotesList>
        {footnotes.map((footnote, i) => (
          <Footnote key={uuid()} id={`${i + 1}`} footnote={footnote} />
        ))}
      </FootnotesList>
    );
  }
  return null;
};

export default LearningResourceFootnotes;
