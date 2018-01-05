/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Value } from 'slate';
import { replacer } from '../';
import { sectionValue } from '../../../../../util/__tests__/slateMockValues';
import { toJSON } from '../../../../../util/slateHelpers';

test('onPaste replacer with all characters', () => {
  const value = Value.fromJSON(sectionValue);
  const change = value.change();

  replacer('a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, æ, ø, å', change);
  replacer('A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, Æ, Ø, Å', change);
  expect(toJSON(change.value)).toMatchSnapshot();
});


test('onPaste replacer with cr character', () => {
  const value = Value.fromJSON(sectionValue);
  const change = value.change();
  let str = "This is a text string that contains cr's";
  str += String.fromCharCode(13);

  str += "A new line";
  str += String.fromCharCode(13);
  str += "Another new line";
  str += String.fromCharCode(6);

  replacer(str, change);
  expect(toJSON(change.value)).toMatchSnapshot();
});


test('onPaste replacer with illegal characters', () => {
  const value = Value.fromJSON(sectionValue);
  const change = value.change();
  const str = String.fromCharCode(1) + String.fromCharCode(2) + String.fromCharCode(3) + String.fromCharCode(4);

  replacer(str, change);
  expect(toJSON(change.value)).toMatchSnapshot();
});

test('onPaste replacer norwegian letters', () => {
  const value = Value.fromJSON(sectionValue);
  const change = value.change();
  const str = 'æøåÆØÅ'

  replacer(str, change);
  expect(toJSON(change.value)).toMatchSnapshot();
});
