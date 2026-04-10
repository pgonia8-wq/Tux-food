import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN = { width, height };

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
} as const;

export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

const palette = {
  orange: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
  },
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
  },
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
  },
  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
  },
  cyan: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
  },
  yellow: {
    50: '#FEFCE8',
    400: '#FACC15',
    500: '#EAB308',
  },
};

export const Colors = {
  light: {
    primary: palette.orange[500],
    primaryLight: palette.orange[50],
    primaryDark: palette.orange[700],
    secondary: '#1E293B',

    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    card: '#FFFFFF',
    cardPressed: '#F1F5F9',

    text: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',
    textOnPrimary: '#FFFFFF',

    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    divider: '#F1F5F9',

    success: palette.green[500],
    successLight: palette.green[50],
    error: palette.red[500],
    errorLight: palette.red[50],
    warning: palette.yellow[500],
    warningLight: palette.yellow[50],
    info: palette.blue[500],
    infoLight: palette.blue[50],

    skeleton: '#E2E8F0',
    skeletonHighlight: '#F1F5F9',

    shadow: 'rgba(0, 0, 0, 0.06)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    glass: 'rgba(255, 255, 255, 0.85)',

    tabBar: '#FFFFFF',
    tabBarBorder: '#F1F5F9',
    tabBarActive: palette.orange[500],
    tabBarInactive: '#94A3B8',

    inputBg: '#F8FAFC',
    inputBorder: '#E2E8F0',
    inputFocusBorder: palette.orange[500],
    placeholder: '#94A3B8',

    gradientStart: palette.orange[500],
    gradientEnd: palette.orange[600],
    gradientAccent: '#FF6B35',

    star: palette.yellow[400],
    online: palette.green[400],
    offline: '#94A3B8',

    roleCliente: palette.orange[500],
    roleRestaurante: palette.purple[500],
    roleRepartidor: palette.cyan[500],
    roleAdmin: palette.red[500],
  },
  dark: {
    primary: palette.orange[400],
    primaryLight: 'rgba(249, 115, 22, 0.15)',
    primaryDark: palette.orange[500],
    secondary: '#E2E8F0',

    background: '#0B1120',
    surface: '#151E2E',
    surfaceElevated: '#1C2840',
    card: '#151E2E',
    cardPressed: '#1C2840',

    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textInverse: '#0F172A',
    textOnPrimary: '#FFFFFF',

    border: '#1E293B',
    borderLight: '#1E293B',
    divider: '#1E293B',

    success: palette.green[400],
    successLight: 'rgba(34, 197, 94, 0.15)',
    error: palette.red[400],
    errorLight: 'rgba(239, 68, 68, 0.15)',
    warning: palette.yellow[400],
    warningLight: 'rgba(234, 179, 8, 0.15)',
    info: palette.blue[400],
    infoLight: 'rgba(59, 130, 246, 0.15)',

    skeleton: '#1E293B',
    skeletonHighlight: '#334155',

    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    glass: 'rgba(21, 30, 46, 0.85)',

    tabBar: '#151E2E',
    tabBarBorder: '#1E293B',
    tabBarActive: palette.orange[400],
    tabBarInactive: '#64748B',

    inputBg: '#1C2840',
    inputBorder: '#1E293B',
    inputFocusBorder: palette.orange[400],
    placeholder: '#64748B',

    gradientStart: palette.orange[500],
    gradientEnd: palette.orange[700],
    gradientAccent: '#FF6B35',

    star: palette.yellow[400],
    online: palette.green[400],
    offline: '#64748B',

    roleCliente: palette.orange[400],
    roleRestaurante: palette.purple[400],
    roleRepartidor: palette.cyan[400],
    roleAdmin: palette.red[400],
  },
} as const;

export type ThemeColors = typeof Colors.light;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
} as const;

export const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  pendiente: { label: 'Pendiente', color: '#94A3B8', icon: 'Clock' },
  confirmado: { label: 'Confirmado', color: '#3B82F6', icon: 'CheckCircle' },
  preparando: { label: 'Preparando', color: '#F97316', icon: 'ChefHat' },
  listo: { label: 'Listo', color: '#8B5CF6', icon: 'Package' },
  en_camino: { label: 'En camino', color: '#06B6D4', icon: 'Truck' },
  entregado: { label: 'Entregado', color: '#22C55E', icon: 'CheckCircle2' },
  cancelado: { label: 'Cancelado', color: '#EF4444', icon: 'XCircle' },
};
