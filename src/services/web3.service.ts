import { Web3 } from 'web3';

class Web3Service {
  web3: Web3;
  constructor() {
    this.web3 = new Web3(process.env.RPC_URL);
  }
}

export default Web3Service;
