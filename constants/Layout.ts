import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const ICON_MARGIN: number = 10;

export { windowHeight, windowWidth }

export default {
  window: {
    width: windowHeight,
    height: windowHeight,
  },
  isSmallDevice: windowWidth < 375,
};
