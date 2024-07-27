export interface MempoolTx {
  hash: string;
  nonce: string;
  blockHash: string | null;
  blockNumber: number | null;
  transactionIndex: number | null;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gas: string;
  input: string;
  raw: string;
  creates: string | null;
  publicKey: string;
  chainId: string;
  condition: string | null;
  r: string;
  s: string;
  v: string;
  standardV: string;
}

export interface Filter {
  from?: string;
  to?: string;
  value?: string;
}
