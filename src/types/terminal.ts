import type Color from 'color';
import React from 'react';

export type AssetKey = 'AAVEV2' | 'COMPOUND';

export interface AssetInfo {
  key: AssetKey;
  title: string;
  subtitle?: string;
  logo: React.ReactNode;
  color: Color;
  infoLink: string;
}

export type MetricKey = 'VAR' | 'LCR' | 'VTL' | 'TA' | 'TL' | 'MC';
