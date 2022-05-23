import { Aggregator, ChartLine } from '~/types/chart';

export function filterDataByDuration(
  data: ChartLine['data'],
  durationInDays: number,
) {
  const sortedData = [...data].sort(
    (a, b) => a.timestamp.valueOf() - b.timestamp.valueOf(),
  );

  const duration = durationInDays * 24 * 3600 * 1000;
  const startTs =
    sortedData.length > 0
      ? sortedData[sortedData.length - 1].timestamp.valueOf()
      : 0;

  const endTs = startTs > 0 ? startTs - duration : 0;
  return sortedData.filter((dp) => dp.timestamp.valueOf() > endTs);
}

export function aggregateData(
  data: ChartLine['data'],
  maxTs: number,
  intervalInDays: number,
  aggregator: Aggregator,
) {
  const interval = intervalInDays * 24 * 3600 * 1000;
  const sortedData = data
    .filter((datum) => datum.timestamp.valueOf() <= maxTs)
    .sort((a, b) => a.timestamp.valueOf() - b.timestamp.valueOf());

  const rangedData: { timestamp: Date; data: ChartLine['data'] }[] = [];
  for (const datum of sortedData) {
    const i = Math.floor((maxTs - datum.timestamp.valueOf()) / interval);
    if (!rangedData[i]) {
      rangedData[i] = {
        timestamp: new Date(maxTs - interval * i),
        data: [],
      };
    }

    rangedData[i].data.push(datum);
  }

  return rangedData
    .map(({ timestamp, data }) => {
      let value = 0;
      switch (aggregator) {
        case 'max':
          value = Math.max(...data.map((datum) => datum.value));
          break;
        case 'min':
          value = Math.min(...data.map((datum) => datum.value));
          break;
        case 'sum':
          value = data.reduce((sum, datum) => sum + datum.value, 0);
          break;
        case 'avg':
          value =
            data.reduce((sum, datum) => sum + datum.value, 0) / data.length;
          break;
      }

      return {
        timestamp,
        value,
      };
    })
    .filter((val) => !!val);
}
