/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import CreateGloss from "./CreateGloss";
import EditGloss from "./EditGloss";
import ResourcePage from "../../components/ResourcePage";
import { useConcept } from "../../modules/concept/conceptQueries";

const GlossPage = () => <ResourcePage CreateComponent={CreateGloss} EditComponent={EditGloss} useHook={useConcept} />;

export default memo(GlossPage);
