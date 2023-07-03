/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from 'react';
import loadable from '@loadable/component';
import { useConcept } from '../../modules/concept/conceptQueries';
import ResourcePage from '../../components/ResourcePage';
const CreateGlossary = loadable(() => import('./CreateGlossary'));
const EditGlossary = loadable(() => import('./EditGlossary'));

const GlossaryPage = () => (
  <ResourcePage
    CreateComponent={CreateGlossary}
    EditComponent={EditGlossary}
    useHook={useConcept}
    createUrl="/glossary/new"
  />
);

export default memo(GlossaryPage);
