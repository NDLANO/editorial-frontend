/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isNDLAEmbedUrl } from "../learningpathUtils";

test("isNDLAEmbedUrl should return true for NDLA embed URLs", () => {
  expect(isNDLAEmbedUrl("https://ndla.no/embed/123")).toBe(true);
  expect(isNDLAEmbedUrl("https://staging.ndla.no/embed/123?param=value")).toBe(true);
  expect(isNDLAEmbedUrl("https://test.ndla.no/embed/123#hash")).toBe(true);
  expect(isNDLAEmbedUrl("http://localhost/embed/123#hash")).toBe(true);
  expect(isNDLAEmbedUrl("http://localhost:3000/embed/123#hash")).toBe(true);
  expect(isNDLAEmbedUrl("http://localhost:30019/embed/123#hash")).toBe(true);
});

test("isNDLAEmbedUrl should return false for non-NDLA embed URLs", () => {
  expect(isNDLAEmbedUrl("https://evilndla.no/embed/123#hash")).toBe(false);
  expect(isNDLAEmbedUrl("https://ndla.no.evil.com/embed/123")).toBe(false);
  expect(isNDLAEmbedUrl("https://localhost.com/embed/123")).toBe(false);
  expect(isNDLAEmbedUrl("https://www.example.com/embed/123")).toBe(false);
  expect(isNDLAEmbedUrl("https://www.example.com/embed/123?param=value")).toBe(false);
  expect(isNDLAEmbedUrl("https://www.example.com/embed/123#hash")).toBe(false);
  expect(isNDLAEmbedUrl("https://www.example.com/embed/123?param=value#hash")).toBe(false);
});
