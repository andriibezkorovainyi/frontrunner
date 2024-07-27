import { Filter, MempoolTx } from '../types/interfaces';

class FilterService {
  filterMempoolTxs(txs: MempoolTx[], filter: Filter) {
    return txs.filter((tx) => {
      if (filter.from && tx.from === filter.from) {
        return true;
      }

      if (filter.to && tx.to === filter.to) {
        return true;
      }

      if (filter.value && tx.value === filter.value) {
        return true;
      }

      return false;
    });
  }
}

export default FilterService;
