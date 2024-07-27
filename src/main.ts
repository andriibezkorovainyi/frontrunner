import BloxrouteService from './services/bloxroute.service';
import configDotenv from 'dotenv';
import Web3Service from './services/web3.service';
configDotenv.configDotenv();

function main() {
  const bloxrouteService = new BloxrouteService();
  const web3Service = new Web3Service();

  console.log(bloxrouteService.getBloxrouteData());
}

main();
