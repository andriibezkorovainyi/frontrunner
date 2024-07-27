import configDotenv from 'dotenv';
import MempoolService from './services/mempool.service';
configDotenv.configDotenv();

async function main() {
  const mempoolService = new MempoolService();
  const mempoolTxs = await mempoolService.getMempoolTxs();

  console.log(mempoolTxs);
}

main();
