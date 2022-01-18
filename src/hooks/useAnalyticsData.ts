import { useEffect, useState } from 'react';

import {
  CmkAnalyticsDataPoint,
  CmkAnalyticsGatewayResponse,
  StakedCmkAnalyticsDataPoint,
  StakedCmkAnalyticsGatewayResponse,
} from '~/types/analytics';

import CmkAnalyticsBackfill from './cmkAnalyticsBackfill.json';
import StakedCmkAnalyticsBackfill from './stakedCmkAnalyticsBackfill.json';

export function useCmkAnalyticsData(days = 30, dummy = false) {
  const [data, setData] = useState<Array<CmkAnalyticsDataPoint>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(
      CmkAnalyticsBackfill.result.CMK.map((foo) => ({
        ...foo.data,
        ts: foo.data.timestamp,
      })),
    );
  }, [days, dummy]);

  return {
    loading,
    data,
  };
}

export function useStakedCmkAnalyticsData(days = 30, dummy = false) {
  const [data, setData] = useState<Array<StakedCmkAnalyticsDataPoint>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(
      StakedCmkAnalyticsBackfill.result.SCMK.map((foo) => ({
        ...foo.data,
        ts: foo.data.timestamp,
      })),
    );
  }, [days, dummy]);

  return {
    loading,
    data,
  };
}
