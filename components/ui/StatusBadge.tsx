import React from 'react';
import { ORDER_STATUS_CONFIG } from '../../constants/theme';
import { Badge } from './Badge';
import type { OrderStatus } from '../../types';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size }) => {
  const config = ORDER_STATUS_CONFIG[status] || { label: status, color: '#94A3B8' };
  return <Badge label={config.label} color={config.color} size={size} />;
};
