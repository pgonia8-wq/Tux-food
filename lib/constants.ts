export const APP_NAME = 'Tux Food';
export const APP_TAGLINE = 'Tu comida favorita en Tuxtepec';
export const CITY = 'Tuxtepec, Oaxaca';
export const CURRENCY = 'MXN';
export const CURRENCY_SYMBOL = '$';

export const DEFAULT_LOCATION = {
  lat: 18.0883,
  lng: -96.1225,
  name: 'Tuxtepec, Oaxaca',
};

export const COMMISSION_RATE = 0.15;
export const DEFAULT_DELIVERY_FEE = 25;
export const MIN_ORDER_AMOUNT = 50;

export const ORDER_STATUS_FLOW = [
  'pendiente',
  'confirmado',
  'preparando',
  'listo',
  'en_camino',
  'entregado',
] as const;

export const FOOD_CATEGORIES = [
  { id: '1', name: 'Comida Oaxaqueña', icon: '🫔' },
  { id: '2', name: 'Tacos', icon: '🌮' },
  { id: '3', name: 'Mariscos', icon: '🦐' },
  { id: '4', name: 'Hamburguesas', icon: '🍔' },
  { id: '5', name: 'Pizzas', icon: '🍕' },
  { id: '6', name: 'Pollos', icon: '🍗' },
  { id: '7', name: 'Sushi', icon: '🍣' },
  { id: '8', name: 'Postres', icon: '🍰' },
  { id: '9', name: 'Bebidas', icon: '🥤' },
  { id: '10', name: 'Desayunos', icon: '🥚' },
];
