import configDotenv from 'dotenv';
import MempoolService from './services/mempool.service';
import { delay } from './helpers';
import FilterService from './services/filter.service';
configDotenv.configDotenv();

async function main() {
  const to = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // USDT address
  const mempoolService = new MempoolService();
  const filterService = new FilterService();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const mempoolTxs = await mempoolService.getMempoolTxs();

    if (!mempoolTxs) {
      console.error('Could not get mempool transactions');
      return;
    }

    const filteredTxs = filterService.filterMempoolTxs(mempoolTxs, {
      to: to.toLowerCase(),
    });

    console.log('Filtered transactions:', filteredTxs.length);

    if (filteredTxs.length) {
      console.log('Filtered transactions:', filteredTxs);
    }

    await delay(2000);
  }
}

main();
