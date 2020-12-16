/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useEffect, useState } from 'react';
import { css } from '@emotion/core';
import { injectT, tType } from '@ndla/i18n';
import Button from '@ndla/button';
import {
  NotionDialogContent,
  NotionDialogText,
  NotionDialogLicenses,
  NotionDialogWrapper,
  NotionHeaderWithoutExitButton,
} from '@ndla/notion';
import { Portal } from '../../../Portal';
import Lightbox from '../../../Lightbox';
import { Concept as ConceptType } from '../../editorTypes';
import Overlay from '../../../Overlay';

const placeholderStyle = css`
  position: relative;
  border: 1px solid var(--article-color);
`;

interface Props {
  concept: ConceptType;
  handleRemove: Function; // TODO: hvordan ser funksjonen ut
  id: number;
  isOpen: boolean;
  onClose: Function; // TODO: hvordan ser funksjonen ut
  locale: string;
}

const ConceptPreview: FC<Props & tType> = ({
  concept,
  handleRemove,
  id,
  isOpen,
  onClose,
  t,
}) => {
  let placeholderElement: any = React.createRef();
  let embedElement: any = React.createRef();

  useEffect(() => {
    const bodyRect = document.body.getBoundingClientRect();
    const embedRect = embedElement.getBoundingClientRect();
    const placeholderRect = placeholderElement.getBoundingClientRect();

    // Placing embed within placeholder div on mount
    placeholderElement.style.height = `${embedRect.height + 120}px`;
    embedElement.style.position = 'absolute';
    embedElement.style.top = `${placeholderRect.top - bodyRect.top}px`;
    embedElement.style.left = `${placeholderRect.left}px`;
    embedElement.style.width = `${placeholderRect.width}px`;
  }, []);

  return (
    // TODO might replace partly with Concept component from #2302-2303
    //   <Lightbox display appearance="big" onClose={onClose}>
    <>
      {/* <Overlay onExit={onClose} key="conceptOverlay" /> */}
        <div
          key="audioPlaceholder"
          css={placeholderStyle}
          ref={placeholderEl => {
            placeholderElement = placeholderEl;
          }}
        />
        <Portal isOpened key="conceptPortal">
           {/* <Lightbox display appearance="big" onClose={onClose}> */}
           <div
          css={css`
            padding: 50px;
            background-color: red;
          `}
          ref={embedEl => {
            embedElement = embedEl;
          }}>
          <NotionHeaderWithoutExitButton
          title={concept.title}
          subtitle={concept.metaDescription}
        />
          
            <NotionDialogContent>
              <NotionDialogText>{concept.content}</NotionDialogText>
            </NotionDialogContent>
            <NotionDialogLicenses
              license={concept.copyright?.license?.license}
              source={concept.source}
              authors={concept.copyright?.creators.map(creator => creator.name)}
            />  
            {/* </Lightbox> */}
            </div>
        </Portal>
      </>

    //   </Lightbox>

  );
};

export default injectT(ConceptPreview);
