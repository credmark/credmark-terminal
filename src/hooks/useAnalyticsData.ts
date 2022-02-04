import { useEffect, useState } from 'react';

import {
  CmkAnalyticsDataPoint,
  CmkAnalyticsGatewayResponse,
  StakedCmkAnalyticsDataPoint,
  StakedCmkAnalyticsGatewayResponse,
} from '~/types/analytics';

export function useCmkAnalyticsData(days = 30) {
  const [data, setData] = useState<Array<CmkAnalyticsDataPoint>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const limit = days * 24;
    setLoading(true);
    const abortController = new AbortController();
    fetch(
      `https://gateway.credmark.com/v0/models/cmk/data?token=CMK&limit=${limit}`,
      { signal: abortController.signal },
    )
      .then<CmkAnalyticsGatewayResponse>((resp) => resp.json())
      .then((jsonResp) => {
        setData(jsonResp.data.sort((pointA, pointB) => pointA.ts - pointB.ts));
      })
      .catch((err) => {
        if (abortController.signal.aborted) {
          return;
        }

        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, [days]);

  return {
    loading,
    data,
  };
}

export function useStakedCmkAnalyticsData(days = 30) {
  const [data, setData] = useState<Array<StakedCmkAnalyticsDataPoint>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const limit = days * 24;
    setLoading(true);
    const abortController = new AbortController();
    fetch(
      `https://gateway.credmark.com/v0/models/cmk/data?token=XCMK&limit=${limit}`,
      { signal: abortController.signal },
    )
      .then<StakedCmkAnalyticsGatewayResponse>((resp) => resp.json())
      .then((jsonResp) => {
        setData(jsonResp.data.sort((pointA, pointB) => pointA.ts - pointB.ts));
      })
      .catch((err) => {
        if (abortController.signal.aborted) {
          return;
        }

        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, [days]);

  return {
    loading,
    data,
  };
}
