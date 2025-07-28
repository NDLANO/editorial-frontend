/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import CreateConcept from "./CreateConcept";
import EditConcept from "./EditConcept";
import ResourcePage from "../../components/ResourcePage";
import { useConcept } from "../../modules/concept/conceptQueries";

const ConceptPage = () => (
  <ResourcePage CreateComponent={CreateConcept} EditComponent={EditConcept} useHook={useConcept} />
);

export default memo(ConceptPage);
