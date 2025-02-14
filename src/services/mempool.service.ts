import axios from 'axios';
import { MempoolTx } from '../types/interfaces';

class MempoolService {
  rpcUrl: string;

  constructor() {
    this.rpcUrl = process.env.RPC_URL || '';

    if (!this.rpcUrl) {
      throw new Error('RPC_URL is not set');
    }
  }

  async getMempoolTxs(): Promise<MempoolTx[] | undefined> {
    try {
      const response = await axios.post(this.rpcUrl, {
        method: 'parity_pendingTransactions',
        params: [],
        id: 1,
        jsonrpc: '2.0',
      });

      return response.data.result;
    } catch (error) {
      console.error(error);
    }
  }
}

export default MempoolService;
