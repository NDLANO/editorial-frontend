import { SerializedStyles } from '@emotion/core';

export enum ButtonAppearance {
  FILL = 'fill',
  RESOURCEGROUP = 'resourceGroup',
  TAXONOMY = 'taxonomy',
}

export type AppearanceMap = {
  [key in ButtonAppearance]: SerializedStyles;
};
