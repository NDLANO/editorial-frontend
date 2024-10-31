/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ResourceType } from "@ndla/types-taxonomy";
import { resourceTypesMock, flattenedResourceTypes } from "./taxonomyMocks";
import { flattenResourceTypesAndAddContextTypes } from "../taxonomyHelpers";

test("taxonomy/flattenResourceTypesAndAddContextTypes flattening", () => {
  const types: Record<string, string> = {
    "contextTypes.topic": "Emne",
    "contextTypes.frontpage": "Forsideartikkel",
    "contextTypes.concept": "Forklaring",
    "contextTypes.gloss": "Glose",
  };
  const t = (key: string) => types[key];
  expect(flattenResourceTypesAndAddContextTypes(resourceTypesMock as ResourceType[], t)).toEqual(
    flattenedResourceTypes,
  );
});
