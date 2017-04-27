/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { PropTypes } from 'react';
import { OneColumn } from 'ndla-ui';
import { injectT } from '../../i18n';
import { SubjectShape } from '../../shapes';

export const WelcomePage = ({ t }) =>
  <div className="c-resources u-padding-top-large">
    <OneColumn cssModifier="narrow">
      <article>
        <section>
          <h1>{t('welcomePage.hello')}</h1>
        </section>
      </article>
    </OneColumn>
  </div>
;

WelcomePage.propTypes = {
  subjects: PropTypes.arrayOf(SubjectShape),
};

export default injectT(WelcomePage);
