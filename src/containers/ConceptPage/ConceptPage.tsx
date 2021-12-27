/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from 'react';
import loadable from '@loadable/component';
import { useConcept } from '../../modules/concept/conceptQueries';
import ResourcePage from '../../components/ResourcePage';
const CreateConcept = loadable(() => import('./CreateConcept'));
const EditConcept = loadable(() => import('./EditConcept'));

const ConceptPage = () => (
  <ResourcePage
    CreateComponent={CreateConcept}
    EditComponent={EditConcept}
    useHook={useConcept}
    createUrl="/concept/new"
  />
);

export default memo(ConceptPage);
