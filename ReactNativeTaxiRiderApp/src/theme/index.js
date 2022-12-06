import { Platform } from 'react-native'

const HORIZONTAL_SPACING_BASE = Platform.OS === 'web' ? 4 : 2
const VERTICAL_SPACING_BASE = 4

const icons = {
  rightArrow: require('../assets/icons/right-arrow.png'),
  tick: require('../assets/icons/tick.png'),
  plus: require('../assets/icons/plus.png'),
  back: require('../assets/icons/back.png'),
  menu: require('../assets/icons/menu.png'),
  call: require('../assets/icons/call.png'),
  pin: require('../assets/icons/pin.png'),
  userFilled: require('../assets/icons/user-filled.png'),
  mapLocation: require('../assets/icons/map-location.png'),
  driver: require('../assets/icons/driver.png'),
  markerImage: require('../assets/icons/marker.png'),
  logo: require('../assets/icons/applogo.png'),
  backArrow: require('../assets/icons/backArrow.png'),
  userAvatar: require('../assets/icons/default-avatar.jpg'),
  close: require('../assets/icons/close-x-icon.png'),
  backArrow: require('../assets/icons/arrow-back-icon.png'),
  menuHamburger: require('../assets/icons/menu-hamburger.png'),
  search: require('../assets/icons/search.png'),
  magnifier: require('../assets/icons/magnifier.png'),
  camera: require('../assets/icons/camera.png'),
  cameraFilled: require('../assets/icons/camera-filled.png'),
  inscription: require('../assets/icons/inscription.png'),
  more: require('../assets/icons/more.png'),
  send: require('../assets/icons/send.png'),
  pinpoint: require('../assets/icons/pinpoint.png'),
  checked: require('../assets/icons/checked.png'),
  bell: require('../assets/icons/bell.png'),
  playButton: require('../assets/icons/play-button.png'),
  logout: require('../assets/icons/logout-drawer.png'),
  sound: require('../assets/icons/sound.png'),
  soundMute: require('../assets/icons/sound_mute.png'),
}

const lightColors = {
  primaryBackground: '#ffffff',
  secondaryBackground: '#ffffff',
  primaryForeground: '#434343',
  secondaryForeground: '#595959',
  foregroundContrast: 'white',
  primaryText: '#434343',
  secondaryText: '#7e7e7e',
  hairline: '#e0e0e0',
  grey0: '#fafafa',
  grey1: '#cecdce',
  grey2: '#efefef',
  grey3: '#f5f5f5',
  grey4: '#c4c4c4',
  grey5: '#b3b3b3',
  grey6: '#d6d6d6',
  grey9: '#939393',
  red: '#ea0606',
}

const InstamobileTheme = {
  colors: {
    light: lightColors,
    'no-preference': lightColors,
    dark: {
      primaryBackground: '#121212',
      secondaryBackground: '#000000',
      primaryForeground: '#434343',
      secondaryForeground: '#8442bd',
      foregroundContrast: 'white',
      primaryText: '#ffffff',
      secondaryText: '#c5c5c5',
      hairline: '#222222',
      grey0: '#0a0a0a',
      grey1: '#b3b3b3',
      grey2: '#c4c4c4',
      grey3: '#f5f5f5',
      grey4: '#efefef',
      grey5: '#cecdce',
      grey6: '#f5f5f5',
      grey9: '#eaeaea',
      red: '#ea0606',
    },
  },
  spaces: {
    horizontal: {
      s: 2 * HORIZONTAL_SPACING_BASE,
      m: 4 * HORIZONTAL_SPACING_BASE,
      l: 6 * HORIZONTAL_SPACING_BASE,
      xl: 8 * HORIZONTAL_SPACING_BASE,
    },
    vertical: {
      s: 2 * VERTICAL_SPACING_BASE,
      m: 4 * VERTICAL_SPACING_BASE,
      l: 6 * VERTICAL_SPACING_BASE,
      xl: 8 * VERTICAL_SPACING_BASE,
    },
  },
  fontSizes: {
    xxs: 8,
    xs: 12,
    s: 14,
    m: 16,
    l: 18,
    xl: 24,
    xxl: 32,
  },
  fontWeights: {
    s: '400',
    m: '600',
    l: '800',
  },
  icons: icons,
  // color, font size, space / margin / padding, vstack / hstack
  button: {
    borderRadius: 8,
  },
}

export default InstamobileTheme
