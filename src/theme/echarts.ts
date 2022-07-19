const contrastColor = '#eee';
const axisCommon = {
  axisLine: {
    lineStyle: {
      color: 'rgba(255, 255, 255, 0.4)',
    },
  },
  axisTick: {
    lineStyle: {
      color: 'rgba(255, 255, 255, 0.4)',
    },
  },
  axisLabel: {
    textStyle: {
      color: 'rgba(255, 255, 255, 0.8)',
    },
  },
  splitLine: {
    lineStyle: {
      //   type: 'dashed',
      color: 'rgba(255, 255, 255, 0.1)',
    },
  },
  splitArea: {
    areaStyle: {
      color: contrastColor,
    },
  },
  minorSplitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.08)' } },
  axisPointer: {
    label: {
      backgroundColor: '#E2E8F0',
      color: '#2D3748',
    },
  },
};

const colorPalette = [
  '#dd6b66',
  '#759aa0',
  '#e69d87',
  '#8dc1a9',
  '#ea7e53',
  '#eedd78',
  '#73a373',
  '#73b9bc',
  '#7289ab',
  '#91ca8c',
  '#f49f42',
];

export const darkTheme = {
  color: colorPalette,
  tooltip: {
    axisPointer: {
      lineStyle: {
        color: contrastColor,
      },
      crossStyle: {
        color: contrastColor,
      },
    },
  },
  legend: {
    textStyle: {
      color: contrastColor,
    },
  },
  textStyle: {
    color: contrastColor,
  },
  title: {
    textStyle: {
      color: contrastColor,
    },
  },
  toolbox: {
    iconStyle: {
      normal: {
        borderColor: contrastColor,
      },
    },
  },
  dataZoom: {
    textStyle: {
      color: contrastColor,
    },
  },
  timeline: {
    lineStyle: {
      color: contrastColor,
    },
    itemStyle: {
      normal: {
        color: colorPalette[1],
      },
    },
    label: {
      normal: {
        textStyle: {
          color: contrastColor,
        },
      },
    },
    controlStyle: {
      normal: {
        color: contrastColor,
        borderColor: contrastColor,
      },
    },
  },
  timeAxis: axisCommon,
  logAxis: axisCommon,
  valueAxis: {
    ...axisCommon,
  },
  categoryAxis: {
    ...axisCommon,
    splitLine: { ...axisCommon.splitLine, show: false },
  },

  line: {
    symbol: 'circle',
  },
  graph: {
    color: colorPalette,
  },
  gauge: {
    title: {
      textStyle: {
        color: contrastColor,
      },
    },
  },
  candlestick: {
    itemStyle: {
      normal: {
        color: '#FD1050',
        color0: '#0CF49B',
        borderColor: '#FD1050',
        borderColor0: '#0CF49B',
      },
    },
  },
};
