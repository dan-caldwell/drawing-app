/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type Measurement = {
  height: number,
  width: number,
  pageX: number,
  pageY: number,
  x: number,
  y: number
}

export type OpenSubmenu = {
  open: boolean,
  left: number,
  bottom: number | string,
  top: number | string,
  target: string | null,
  reRendering: boolean,
  submenuPosition: string | null,
  caretLeft: number
}

export type AutoJoin = {
  disabled: boolean,
  distance: number
}

export type SvgPath = {
  points: string,
  stroke: string,
  strokeWidth: number,
  fill: string
  id: string,
  left: number,
  right: number,
  top: number,
  bottom: number,
  translateX: number,
  translateY: number,
  rotation: number,
  type: string
}

export type CanvasPoint = {
  x: number | null,
  y: number | null
}

export type BoundingBox = {
  top: number,
  bottom: number,
  left: number,
  right: number
}

export type AlteredPaths = {
  oldPath: SvgPath,
  newPath: SvgPath,
  alteredType: 'added' | 'removed' | 'altered'
}

export type CanvasSize = {
  width: number,
  height: number
}