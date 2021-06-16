/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { setToken } from '../../support';
import editorRoutes from "./editorRoutes";

const CONCEPT_ID = 1;

describe('Language handling', () => {
  before(() => {
    setToken();
    editorRoutes()
    cy.apiroute('GET', `/taxonomy/v1/subjects?language=nb`, 'allSubjects');
    cy.apiroute('GET', `**/concept-api/v1/drafts/${CONCEPT_ID}?*`, `concept-${CONCEPT_ID}`);
    cy.visit(`/concept/${CONCEPT_ID}/edit/nb`);
    cy.apiwait(['@allSubjects', `@concept-${CONCEPT_ID}`])
  });

  it('Can change language and fetch the new concept', () => {
    cy.get('header button')
      .contains('Legg til')
      .click({ force: true });
  });
});
