/*
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FunctionComponent, Children, useState } from 'react';
import { AccordionBar, AccordionPanel } from '@ndla/accordion';

interface Props {
  id: string;
  title: string;
  className: string;
  hasError?: boolean;
  startOpen?: boolean;
}
const AccordionSection: FunctionComponent<Props> = ({
  id,
  title,
  className,
  hasError,
  children,
  startOpen,
}) => {
  const [isOpen, setIsOpen] = useState(!!startOpen);

  return (
    <>
      <AccordionBar
        panelId={id}
        hasError={hasError}
        ariaLabel={title}
        title={title}
        onClick={() => setIsOpen(old => !old)}
        isOpen={isOpen}
      />
      {isOpen && (
        <AccordionPanel id={id} hasError={hasError} isOpen={isOpen}>
          <div className={className}>
            {Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  setIsOpen,
                });
              }
              return null;
            })}
          </div>
        </AccordionPanel>
      )}
    </>
  );
};

export default AccordionSection;
