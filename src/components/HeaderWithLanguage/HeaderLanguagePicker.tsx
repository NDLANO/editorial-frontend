/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import FocusTrapReact from 'focus-trap-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus } from '@ndla/icons/action';
import { StyledDropdownOverlay } from '../Dropdown';
import Overlay from '../Overlay';
import StyledFilledButton from '../StyledFilledButton';
import { styledListElement } from '../StyledListElement/StyledListElement';

const LanguagePicker = ({ id, emptyLanguages, editUrl }: Props) => {
  const { t } = useTranslation();
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
            }}
          >
            <StyledDropdownOverlay withArrow>
              {emptyLanguages.map((language) => (
                <Link
                  css={styledListElement}
                  key={language.key}
                  to={editUrl(id, language.key)}
                  onClick={() => setDisplay(false)}
                >
                  {language.title}
                </Link>
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
  id: number;
  emptyLanguages: {
    key: string;
    title: string;
  }[];
  editUrl: (id: number, url: string) => string;
}

export default LanguagePicker;
