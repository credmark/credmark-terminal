import { useEffect, useState } from 'react';

import {
  AssetKey,
  LcrDataPoint,
  LcrGatewayResponse,
  VarDataPoint,
  VarGatewayResponse,
} from '~/types/terminal';
import dayjs from '~/utils/date';

function dummyLcrData(days: number): Array<LcrDataPoint> {
  const oneDay = 24 * 3600 * 1000;
  let base = Date.now() - (days + 1) * oneDay;
  const date: Date[] = [new Date(base)];
  const data: number[] = [Math.random() * 3];
  let min: number = data[0];

  for (let i = 1; i < days; i++) {
    const now = new Date((base += oneDay));
    const value = Math.round((Math.random() - 0.5) * 2 + data[i - 1]);
    date.push(now);
    data.push(Number(value.toFixed(0)));
    if (value < min) {
      min = value;
    }
  }

  const offset = min < 0 ? 0 - min : 0;

  const lcrData: Array<LcrDataPoint> = [];
  for (let i = 0; i < days; i++) {
    lcrData.push({
      ts: date[i].valueOf() / 1000,
      lcr: data[i] + offset,
    });
  }

  return lcrData;
}

function dummyVarData(days: number): Array<VarDataPoint> {
  const oneDay = 24 * 24 * 3600 * 1000;
  let base = Date.now() - (days + 1) * oneDay;
  const date: Date[] = [new Date(base)];
  const data: number[] = [Math.random() * 300];
  let min: number = data[0];

  for (let i = 1; i < days; i++) {
    const now = new Date((base += oneDay));
    const value = Math.round((Math.random() - 0.5) * 20 + data[i - 1]);
    date.push(now);
    data.push(Number(value.toFixed(0)));
    if (value < min) {
      min = value;
    }
  }

  const offset = min < 0 ? 0 - min : 0;

  const varData: Array<VarDataPoint> = [];
  for (let i = 0; i < days; i++) {
    varData.push({
      ts: date[i].valueOf() / 1000,
      '10_day_99p': String(data[i] + offset),
      var_date_10_day_99p: dayjs(date[i]).format('YYYY-MM-DD'),
      '1_day_99p': String(data[i] + offset),
      var_date_1_day_99p: dayjs(date[i]).format('YYYY-MM-DD'),
      '10_day_95p': String(data[i] + offset),
      var_date_10_day_95p: dayjs(date[i]).format('YYYY-MM-DD'),
      '1_day_95p': String(data[i] + offset),
      var_date_1_day_95p: dayjs(date[i]).format('YYYY-MM-DD'),
      total_assets: 1,
      total_liabilities: 2,
      relative_var_assets: String(data[i] + offset),
      relative_var_liabilities: String(data[i] + offset),
    });
  }

  return varData;
}

export function useLcrData(token: AssetKey, limit?: number, dummy = false) {
  limit = limit ?? 30 * 24;

  const [data, setData] = useState<Array<LcrDataPoint>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dummy) {
      setData(dummyLcrData(30));
      return;
    }

    setLoading(true);
    const abortController = new AbortController();
    fetch(
      `https://gateway.credmark.com/v0/models/lcr/data?token=${token}&limit=${limit}`,
      { signal: abortController.signal },
    )
      .then<LcrGatewayResponse>((resp) => resp.json())
      .then((jsonResp) => {
        setData(jsonResp.data);
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
  }, [dummy, limit, token]);

  return {
    loading,
    data,
  };
}

export function useVarData(token: AssetKey, limit?: number, dummy = false) {
  limit = limit ?? 90;

  const [data, setData] = useState<Array<VarDataPoint>>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dummy) {
      setData(dummyVarData(30));
      return;
    }

    setLoading(true);
    const abortController = new AbortController();
    fetch(
      `https://gateway.credmark.com/v0/models/var/data?token=${token}&limit=${limit}`,
      {
        signal: abortController.signal,
      },
    )
      .then<VarGatewayResponse>((resp) => resp.json())
      .then((jsonResp) => {
        setData(jsonResp.data);
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
  }, [dummy, limit, token]);

  return {
    loading,
    data,
  };
}
