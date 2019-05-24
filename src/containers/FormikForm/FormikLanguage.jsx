/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FocusTrapReact from 'focus-trap-react';
import { injectT } from '@ndla/i18n';
import { Plus } from '@ndla/icons/action';
import StyledFilledButton from '../../components/StyledFilledButton';
import StyledListButton from '../../components/StyledListButton';
import Overlay from '../../components/Overlay';
import { StyledDropdownOverlay } from '../../components/Dropdown';

const StyledLink = StyledListButton.withComponent(Link);

const FormikLanguage = ({ emptyLanguages, editUrl, t }) => {
  const [display, setDisplay] = useState(false);
  return (
    <div>
      {emptyLanguages.length > 0 && (
        <StyledFilledButton type="button" onClick={() => setDisplay(true)}>
          <Plus /> {t('form.variant.create')}
        </StyledFilledButton>
      )}
      {display && (
        <>
          <FocusTrapReact
            active
            focusTrapOptions={{
              onDeactivate: () => {
                setDisplay(false);
              },
              clickOutsideDeactivates: true,
              escapeDeactivates: true,
            }}>
            <StyledDropdownOverlay withArrow>
              {emptyLanguages.map(language => (
                <StyledLink
                  key={language.key}
                  to={editUrl(language.key)}
                  onClick={() => setDisplay(false)}>
                  {language.title}
                </StyledLink>
              ))}
            </StyledDropdownOverlay>
          </FocusTrapReact>
          <Overlay modifiers="zIndex" />
        </>
      )}
    </div>
  );
};

FormikLanguage.propTypes = {
  emptyLanguages: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  editUrl: PropTypes.func.isRequired,
};

export default injectT(FormikLanguage);
