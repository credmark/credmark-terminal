import { useEffect, useState } from 'react';

import {
  CmkDataPoint,
  CmkGatewayResponse,
  StakedCmkDataPoint,
  StakedCmkGatewayResponse,
} from '~/types/platform';

function dummyData(days: number): Array<{ ts: number; val: number }> {
  const oneHour = 3600 * 1000;
  const oneDay = 24 * oneHour;
  let base = Date.now() - (days + 1) * oneDay;
  const date: Date[] = [new Date(base)];
  const data: number[] = [Math.random() * 300];
  let min: number = data[0];

  for (let i = 1; i < days * 24; i++) {
    const now = new Date((base += oneHour));
    const value = Math.round((Math.random() - 0.5) * 20 + data[i - 1]);
    date.push(now);
    data.push(Number(value.toFixed(0)));
    if (value < min) {
      min = value;
    }
  }

  const offset = min < 0 ? 0 - min : 0;

  const dummy: Array<{ ts: number; val: number }> = [];
  for (let i = 0; i < days * 24; i++) {
    dummy.push({
      ts: date[i].valueOf() / 1000,
      val: data[i] + offset,
    });
  }

  return dummy;
}

export function useCmkData(days = 30, dummy = false) {
  const [data, setData] = useState<Array<CmkDataPoint>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dummy) {
      setData(
        dummyData(days).map(({ ts, val }) => ({
          ts: ts,
          usdc_price: String(val),
          circulating_supply: '',
          market_cap_usdc: '',
          total_locked: '',
          total_supply: '',
        })),
      );

      return;
    }

    const limit = days * 24;
    setLoading(true);
    const abortController = new AbortController();
    fetch(
      `https://gateway.credmark.com/v0/models/cmk/data?token=CMK&limit=${limit}`,
      { signal: abortController.signal },
    )
      .then<CmkGatewayResponse>((resp) => resp.json())
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
  }, [days, dummy]);

  return {
    loading,
    data,
  };
}

export function useStakedCmkData(days = 30, dummy = false) {
  const [data, setData] = useState<Array<StakedCmkDataPoint>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dummy) {
      setData(
        dummyData(days).map(({ ts, val }) => ({
          ts: ts,
          amount_staked_usdc: String(val),
          total_supply: '',
          cmk_balance: '',
          cmk_rate: '',
          staking_apr_percent: '',
        })),
      );

      return;
    }

    const limit = days * 24;
    setLoading(true);
    const abortController = new AbortController();
    fetch(
      `https://gateway.credmark.com/v0/models/cmk/data?token=XCMK&limit=${limit}`,
      { signal: abortController.signal },
    )
      .then<StakedCmkGatewayResponse>((resp) => resp.json())
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
  }, [days, dummy]);

  return {
    loading,
    data,
  };
}
