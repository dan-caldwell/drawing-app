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
  bottom: number,
  target: string | null,
  reRendering: boolean
}

export type AutoJoin = {
  disabled: boolean,
  distance: number
}

export type SvgPath = {
  points: string,
  strokeWidth: number,
  fill: string
  id: string,
  left: number,
  right: number,
  top: number,
  bottom: number,
  translateX: number,
  translateY: number,
  rotation: number
}

export type CanvasPoint = {
  x: number | null,
  y: number | null
}