// type of code content
export interface CodeTerminal {
  label: string;
  command: string;
  content: string;
}

// set content
export const codeTerminal: CodeTerminal = {
  label: 'credmark-dev run ',
  command: 'USDC-circulating-supply -b 14000000 -i "{}"',
  content: `{
  "result": {
	"USDC": {
	  "data": {
		"lcr": 1.8718877255299988,
		  "v2_ratio": 0.5903757006898251,
		  "market_cap": 4524435192.74808,
		  "total_assets": 5104286092.220225,
	  }
	},
	"COMPOUND": {
	  "data": {
		"lcr": 1.8718877255299988,
		  "v2_ratio": 0.5903757006898251,
		  "market_cap": 4524435192.74808,
		  "total_assets": 5104286092.220225,
	  },
	  "context": {  // context is optional
		  "tokens": ["USDC", "ETH", "BTC" ]
	  }
	}
  }
}`,
};

// total cursor blink count
export const CURSOR_LEN = 14;
export const PAUSE_LEN = 60;
