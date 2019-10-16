/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
export interface Offset {
  offsetY: number;
  offsetX: number;
}

export const SIGNPOST_OFFSETS: { [input: string]: Offset } = {
  'top-left': { offsetY: -10, offsetX: 0 },
  'top-middle': { offsetY: -10, offsetX: 0 },
  'top-right': { offsetY: -10, offsetX: 0 },
  'right-top': { offsetY: 2, offsetX: 14 },
  'right-middle': { offsetY: 6, offsetX: 14 },
  'right-bottom': { offsetY: -1, offsetX: 14 },
  'bottom-right': { offsetY: 9, offsetX: -1 },
  'bottom-middle': { offsetY: 9, offsetX: 12 },
  'bottom-left': { offsetY: 9, offsetX: 0 },
  'left-bottom': { offsetY: 0, offsetX: -14 },
  'left-middle': { offsetY: 4, offsetX: -14 },
  'left-top': { offsetY: 0, offsetX: -14 },
};
