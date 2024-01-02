/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import loadable from "@loadable/component";
import ResourcePage from "../../components/ResourcePage";
import { useConcept } from "../../modules/concept/conceptQueries";
const CreateGloss = loadable(() => import("./CreateGloss"));
const EditGloss = loadable(() => import("./EditGloss"));

const GlossPage = () => (
  <ResourcePage CreateComponent={CreateGloss} EditComponent={EditGloss} useHook={useConcept} createUrl="/gloss/new" />
);

export default memo(GlossPage);
