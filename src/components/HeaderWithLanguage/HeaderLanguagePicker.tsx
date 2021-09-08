/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FocusTrapReact from 'focus-trap-react';
import { injectT, tType } from '@ndla/i18n';
import { Plus } from '@ndla/icons/action';
import StyledFilledButton from '../StyledFilledButton';
import StyledListButton from '../StyledListButton';
import Overlay from '../Overlay';
import { StyledDropdownOverlay } from '../Dropdown';

const StyledLink = StyledListButton.withComponent(Link);

const LanguagePicker = ({ emptyLanguages, editUrl, t }: Props & tType) => {
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

interface Props {
  emptyLanguages: {
    key: string;
    title: string;
  }[];
  editUrl: (url: string) => string;
}

export default injectT(LanguagePicker);
