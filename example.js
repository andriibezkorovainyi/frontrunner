/**
 * @file example.js
 * @description This script listens to pending transactions on the Ethereum network and decodes transactions related to Uniswap's SwapRouter.
 */

const { abi: SwapRouterAbi } = require('@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json');
const ethers = require("ethers");
require('dotenv').config();

const contractInterface = new ethers.utils.Interface(SwapRouterAbi);
const provider = new ethers.providers.WebSocketProvider(process.env.WEBSOCKET_URL);

/**
 * Main function to start listening to pending transactions.
 */
const main = async () => {
    provider.on('pending', async (hash) => {
        getTransaction(hash);
    });
};

/**
 * Utility function to create a delay.
 * @param {number} ms - Milliseconds to delay.
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const UNISWAP_ADDRESSES = [
    '0xE592427A0AEce92De3Edee1F18E0157C05861564', // swap router
];

let txIdx = 0;

/**
 * Fetches and processes a transaction by its hash.
 * @param {string} transactionHash - The hash of the transaction.
 */
const getTransaction = async (transactionHash) => {
    for (let attempt = 1; attempt <= 3; attempt++) {
        const tx = await provider.getTransaction(transactionHash);
        if (tx) {
            if (UNISWAP_ADDRESSES.includes(tx.to)) {
                txIdx += 1;
                const data = tx.data;
                decodeTransaction(data, txIdx);
                break;
            }
        }
        await delay(1000);
    }
};

/**
 * Decodes the transaction input data and logs the relevant information.
 * @param {string} txInput - The input data of the transaction.
 * @param {number} txIdx - The index of the transaction.
 * @param {boolean} [isMulticall=false] - Indicates if the transaction is part of a multicall.
 */
const decodeTransaction = (txInput, txIdx, isMulticall = false) => {
    const decodedData = contractInterface.parseTransaction({ data: txInput });
    const functionName = decodedData.name;
    const args = decodedData.args;
    const params = args.params;
    const data = args.data;

    logFunctionName(functionName, txIdx, isMulticall);

    if (functionName === 'exactInputSingle') { return logExactInputSingle(params); }
    if (functionName === 'exactOutputSingle') { return logExactOutputSingle(params); }
    if (functionName === 'exactInput') { return logExactInput(params); }
    if (functionName === 'exactOutput') { return logExactOutput(params); }
    if (functionName === 'selfPermit') { return logSelfPermit(args); }
    if (functionName === 'refundETH') { return logRefundETH(args); }
    if (functionName === 'unwrapWETH9') { return logUnwrapWETH9(args); }
    if (functionName === 'multicall') { return parseMulticall(data, txIdx); }

    console.log('ADD THIS FUNCTION:', functionName);
    console.log('decodedData:', decodedData);
};

/**
 * Logs the function name of the transaction.
 * @param {string} functionName - The name of the function.
 * @param {number} txIdx - The index of the transaction.
 * @param {boolean} isMulticall - Indicates if the transaction is part of a multicall.
 */
const logFunctionName = (functionName, txIdx, isMulticall) => {
    if (isMulticall) {
        console.log();
        console.log('-------', `Fn: ${txIdx}`, functionName);
        return;
    }

    console.log();
    console.log('======================================================================================');
    console.log('==============================', `Tx: ${txIdx} - ${functionName}`, '==============================');
    console.log('======================================================================================');
};

/**
 * Parses and decodes transactions within a multicall.
 * @param {Array} data - The array of transaction data.
 * @param {number} txIdx - The index of the transaction.
 */
const parseMulticall = (data, txIdx) => {
    data.forEach((tx, fnIdx) => {
        decodeTransaction(tx, fnIdx, true);
    });
};

/**
 * Logs the details of an unwrapWETH9 transaction.
 * @param {Object} args - The arguments of the transaction.
 */
const logUnwrapWETH9 = (args) => {
    console.log('amountMinimum:    ', args.amountMinimum);
    console.log('recipient:        ', args.recipient);
};

/**
 * Logs the details of an exactInputSingle transaction.
 * @param {Object} params - The parameters of the transaction.
 */
const logExactInputSingle = (params) => {
    console.log('tokenIn:          ', params.tokenIn);
    console.log('tokenOut:         ', params.tokenOut);
    console.log('fee:              ', params.fee);
    console.log('recipient:        ', params.recipient);
    console.log('deadline:         ', params.deadline);
    console.log('amountIn:         ', params.amountIn);
    console.log('amountOutMinimum: ', params.amountOutMinimum);
    console.log('sqrtPriceLimitX96:', params.sqrtPriceLimitX96);
};

/**
 * Logs the details of an exactOutputSingle transaction.
 * @param {Object} params - The parameters of the transaction.
 */
const logExactOutputSingle = (params) => {
    console.log('tokenIn:          ', params.tokenIn);
    console.log('tokenOut:         ', params.tokenOut);
    console.log('fee:              ', params.fee);
    console.log('recipient:        ', params.recipient);
    console.log('deadline:         ', params.deadline);
    console.log('amountOut:        ', params.amountOut);
    console.log('amountInMaximum:  ', params.amountInMaximum);
    console.log('sqrtPriceLimitX96:', params.sqrtPriceLimitX96);
};

/**
 * Logs the details of an exactInput transaction.
 * @param {Object} params - The parameters of the transaction.
 */
const logExactInput = (params) => {
    console.log('path:             ', params.path);
    console.log('recipient:        ', params.recipient);
    console.log('deadline:         ', params.deadline);
    console.log('amountIn:         ', params.amountIn);
    console.log('amountOutMinimum: ', params.amountOutMinimum);
};

/**
 * Logs the details of an exactOutput transaction.
 * @param {Object} params - The parameters of the transaction.
 */
const logExactOutput = (params) => {
    console.log('path:             ', params.path);
    console.log('recipient:        ', params.recipient);
    console.log('deadline:         ', params.deadline);
    console.log('amountOut:        ', params.amountOut);
    console.log('amountInMaximum:  ', params.amountInMaximum);
};

/**
 * Logs the details of a selfPermit transaction.
 * @param {Object} params - The parameters of the transaction.
 */
const logSelfPermit = (params) => {
    console.log('token:            ', params.token);
    console.log('value:            ', params.value);
    console.log('deadline:         ', params.deadline);
};

/**
 * Logs the details of a refundETH transaction.
 * @param {Object} params - The parameters of the transaction.
 */
const logRefundETH = (params) => {
    console.log('Nothing to log');
};

main();

/*
    node scripts/03_listenMempool.js
*/