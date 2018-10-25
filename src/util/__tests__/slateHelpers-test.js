/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { fromJS } from 'immutable';
import TestRenderer from 'react-test-renderer';
import jsdom from 'jsdom';
import { Value } from 'slate';
import Html from 'slate-html-serializer';
import {
  valueWithInlineFootnotesAndContentLinks,
  valueWithTwoImageEmbeds,
  tableSlateValue,
  listValue,
  detailsBoxValue,
  headingTwoValue,
  sectionValue,
  quoteValue,
  brValue,
  normalDivValue,
  spanWithAttributesValue,
} from './slateMockValues';
import {
  learningResourceEmbedRule,
  findNodesByType,
  divRule,
  footnoteRule,
  toJSON,
  learningResourceRules,
  topicArticeRules,
} from '../slateHelpers';
import {
  standardArticleHTML,
  standardArticleValue,
  articleWithMath,
  mathArticleValue,
} from './slateMockArticle';

const { fragment } = jsdom.JSDOM;

const learningResourceSerializer = new Html({
  rules: learningResourceRules,
  parseHtml: fragment,
});

const topicArticleSerializer = new Html({
  rules: topicArticeRules,
  parseHtml: fragment,
});

test('serialize embed block', () => {
  const obj = {
    object: 'block',
    type: 'embed',
    data: fromJS({ caption: 'test' }),
  };
  const tag = learningResourceEmbedRule[0].serialize(obj);

  expect(TestRenderer.create(tag).toJSON()).toMatchSnapshot();
});

test('find embed nodes in slate document', () => {
  const { document } = Value.fromJSON(valueWithTwoImageEmbeds);
  const embeds = findNodesByType(document, 'embed');
  expect(embeds.length).toBe(2);
});

test('find footnote nodes in slate document', () => {
  const { document } = Value.fromJSON(valueWithInlineFootnotesAndContentLinks);
  const embeds = findNodesByType(document, 'footnote');
  expect(embeds.length).toBe(2);
});

test('serialize bodybox block', () => {
  const obj = {
    object: 'block',
    type: 'bodybox',
  };
  const children = <p>test</p>;
  const bodybox = divRule.serialize(obj, children);
  expect(TestRenderer.create(bodybox).toJSON()).toMatchSnapshot();
});

test('deserialize bodybox block', () => {
  const deserialized = learningResourceSerializer.deserialize(
    '<div class="c-bodybox">test</div>',
  );

  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('deserializing a normal div block', () => {
  const div = '<div><p>A paragraph</p></div>';
  const deserialized = learningResourceSerializer.deserialize(div);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing a normal div block', () => {
  const value = Value.fromJSON(normalDivValue);
  const serialized = learningResourceSerializer.serialize(value);
  expect(serialized).toMatchSnapshot();
});

test('deserializing a span with attributes', () => {
  const span = '<span lang="en">Hyper Text Markup Language</span>';
  const deserialized = learningResourceSerializer.deserialize(span);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing a span with attributes', () => {
  const value = Value.fromJSON(spanWithAttributesValue);
  const serialized = learningResourceSerializer.serialize(value);
  expect(serialized).toMatchSnapshot();
});

test('deserialize footnote', () => {
  const deserialized = learningResourceSerializer.deserialize(
    `<embed data-title="Apple Watch" data-year="2015" data-resource="footnote" data-authors="Jony Ive" data-edition="2" data-publisher="Apple" data-type=""><embed data-title="iPhone" data-year="2007" data-resource="footnote" data-authors="Steve Jobs;Jony Ive" data-edition="1" data-publisher="Apple" data-type="">`,
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serialize footnote', () => {
  const obj = {
    isVoid: false,
    object: 'inline',
    data: fromJS({
      title: 'Apple Watch',
      type: 'product',
      year: '2015',
      edition: '4',
      publisher: 'Apple',
      authors: ['Jony Ive'],
    }),
    nodes: [
      {
        object: 'text',
        leaves: [
          {
            object: 'leaf',
            marks: [],
            text: '#',
          },
        ],
      },
    ],
    type: 'footnote',
  };
  const footnote = footnoteRule.serialize(obj);
  expect(TestRenderer.create(footnote).toJSON()).toMatchSnapshot();
});

test('deserializing any heading becomes heading-two except heading-three', () => {
  const deserialized = learningResourceSerializer.deserialize(
    '<h1>heading 1</h1><h2>heading 2</h2><h3>heading 3</h3><h4>heading 4</h4><h5>heading 5</h5><h6>heading 6</h6>',
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

const tableHTML =
  '<table><thead><tr><th>column 1</th><th>column 2</th></tr></thead><tbody><tr><td>column 1</td><td>column 2</td></tr></tbody></table>';

test('deserializing table', () => {
  const deserialized = learningResourceSerializer.deserialize(tableHTML);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing table', () => {
  const value = Value.fromJSON(tableSlateValue);
  const serialized = learningResourceSerializer.serialize(value);
  expect(serialized).toMatch(tableHTML);
});

test('deserializing bullet list', () => {
  const deserialized = learningResourceSerializer.deserialize(
    '<ul><li>Rad 1</li><li>Rad 2</li><li>Rad 3</li></ul>',
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing bullet list', () => {
  const value = Value.fromJSON(listValue('bulleted-list'));
  const serialized = learningResourceSerializer.serialize(value);
  expect(serialized).toMatchSnapshot();
});

test('deserializing two column list', () => {
  const deserialized = learningResourceSerializer.deserialize(
    '<ul class="o-list--two-columns"><li>Rad 1</li><li>Rad 2</li><li>Rad 3</li></ul>',
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing two column list', () => {
  const value = Value.fromJSON(listValue('two-column-list'));
  const serialized = learningResourceSerializer.serialize(value);
  expect(serialized).toMatchSnapshot();
});

test('deserializing numbered list', () => {
  const deserialized = learningResourceSerializer.deserialize(
    '<ol><li>Rad 1</li><li>Rad 2</li><li>Rad 3</li></ol>',
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing numbered list', () => {
  const value = Value.fromJSON(listValue('numbered-list'));
  const serialized = learningResourceSerializer.serialize(value);
  expect(serialized).toMatchSnapshot();
});

test('deserializing alphabetical list', () => {
  const deserialized = learningResourceSerializer.deserialize(
    '<ol data-type="letters"><li>Rad 1</li><li>Rad 2</li><li>Rad 3</li></ol>',
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing letter list', () => {
  const value = Value.fromJSON(listValue('letter-list'));
  const serialized = learningResourceSerializer.serialize(value);
  expect(serialized).toMatchSnapshot();
});

test('deserializing list with paragraph inside li elements', () => {
  const listWithParagraphs =
    '<ul><li><p>paragraph 1</p></li><li><p>paragraph 2</p></li><li><p><strong>bold paragraph 3</strong></p></li></ul>';
  const deserialized = learningResourceSerializer.deserialize(
    listWithParagraphs,
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing details box with summary element', () => {
  const value = Value.fromJSON(detailsBoxValue);
  const serialized = learningResourceSerializer.serialize(value);
  expect(serialized).toMatchSnapshot();
});

test('deserializing details box with summary element', () => {
  const detailsWithSummary =
    '<details><summary>Summary text</summary><p>Details text</p></details>';
  const deserialized = learningResourceSerializer.deserialize(
    detailsWithSummary,
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('deserializing a section', () => {
  const section = '<section><p>Paragraph text</p></sectiob>';
  const deserialized = learningResourceSerializer.deserialize(section);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing section', () => {
  const value = Value.fromJSON(sectionValue);
  const serialized = learningResourceSerializer.serialize(value);
  expect(serialized).toMatchSnapshot();
});

test('deserializing any heading should result in heading-two except heading-three', () => {
  const h1 = '<h1>Heading 1</h1>';
  const h2 = '<h2>Heading 2</h2>';
  const h3 = '<h3>Heading 3</h3>';
  const h4 = '<h4>Heading 4</h4>';
  const h5 = '<h5>Heading 5</h5>';
  const h6 = '<h6>Heading 6</h6>';

  const deserializedH1 = learningResourceSerializer.deserialize(h1);
  const deserializedH2 = learningResourceSerializer.deserialize(h2);
  const deserializedH3 = learningResourceSerializer.deserialize(h3);
  const deserializedH4 = learningResourceSerializer.deserialize(h4);
  const deserializedH5 = learningResourceSerializer.deserialize(h5);
  const deserializedH6 = learningResourceSerializer.deserialize(h6);

  expect(toJSON(deserializedH1)).toMatchSnapshot();
  expect(toJSON(deserializedH2)).toMatchSnapshot();
  expect(toJSON(deserializedH3)).toMatchSnapshot();
  expect(toJSON(deserializedH4)).toMatchSnapshot();
  expect(toJSON(deserializedH5)).toMatchSnapshot();
  expect(toJSON(deserializedH6)).toMatchSnapshot();
});

test('serializing heading-two', () => {
  const value = Value.fromJSON(headingTwoValue);
  const serialized = learningResourceSerializer.serialize(value);
  expect(serialized).toMatchSnapshot();
});

test('deserializing a quote', () => {
  const quote =
    '<blockquote>This quote should be both smart and wise</blockquote>';
  const deserialized = learningResourceSerializer.deserialize(quote);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing quote', () => {
  const value = Value.fromJSON(quoteValue);
  const serialized = learningResourceSerializer.serialize(value);
  expect(serialized).toMatchSnapshot();
});

test('deserializing a br', () => {
  const br = '<br />';
  const deserialized = learningResourceSerializer.deserialize(br);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing br', () => {
  const value = Value.fromJSON(brValue);
  const serialized = learningResourceSerializer.serialize(value);
  expect(serialized).toMatchSnapshot();
});

test('deserialize standard article', () => {
  const deserialized = learningResourceSerializer.deserialize(
    standardArticleHTML,
  );
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing standard article', () => {
  const value = Value.fromJSON(standardArticleValue);
  const serialized = learningResourceSerializer.serialize(value);
  expect(global.prettifyHTML(serialized)).toMatchSnapshot();
});

test('deserialize em mark that contains embed footnote', () => {
  const string =
    '<em>NDLA<embed data-authors="Peter, Christian" data-edition="" data-publisher="Knowit" data-resource="footnote" data-title="Javascript." data-type="Programming" data-year="2018"> </em>';
  const deserialized = learningResourceSerializer.deserialize(string);
  const deserializedTopic = topicArticleSerializer.deserialize(string);

  expect(toJSON(deserialized)).toMatchSnapshot();
  expect(toJSON(deserializedTopic)).toMatchSnapshot();
});

test('deserializing', () => {
  const deserialized = learningResourceSerializer.deserialize(articleWithMath);
  expect(toJSON(deserialized)).toMatchSnapshot();
});

test('serializing', () => {
  const value = Value.fromJSON(mathArticleValue);
  const serialized = learningResourceSerializer.serialize(value);
  expect(global.prettifyHTML(serialized)).toMatchSnapshot();
});
