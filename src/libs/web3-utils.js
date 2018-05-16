import Web3 from 'web3';

import TransportU2F from "@ledgerhq/hw-transport-u2f";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";

import ProviderEngine from "web3-provider-engine/dist/es5";
import FetchSubprovider from "web3-provider-engine/dist/es5/subproviders/fetch";

/* ganache-cli --networkId 1337 */
const rpcUrl = process.env.REACT_APP_NETWORK_URL || "https://ropsten.infura.io/ncVw7Yywaql0109ntVNK";
const networkId = parseInt(process.env.REACT_APP_NETWORK_ID || "1337", 10);


let _web3Instance;
export async function getWeb3() {
  if (!_web3Instance) {
    const provider = Web3.givenProvider || (window.web3 && window.web3.currentProvider);
    if (!provider) {
      const error = new Error('Please Install MetaMask');
      error.showToUser = true;
      throw error;
    }

    _web3Instance = new Web3(provider);
  }
  return _web3Instance;
}

let _ledgerWeb3Instance;
export async function getLedgerWeb3() {
  if (!_ledgerWeb3Instance) {
    const engine = new ProviderEngine();
    const getTransport = () => TransportU2F.create();
    const ledger = createLedgerSubprovider(getTransport, {
      networkId,
      accountsLength: 5
    });
    engine.addProvider(ledger);
    engine.addProvider(new FetchSubprovider({ rpcUrl }));
    engine.start();
    _ledgerWeb3Instance = new Web3(engine);
  }
  return _ledgerWeb3Instance;
}

/**
 * Gets the public address of the user
 * @returns {string}
 */
export async function getPublicAddress() {
  const web3Instance = await getWeb3();
  const accounts = await web3Instance.eth.getAccounts();
  if (!accounts || !accounts.length) {
    const error = new Error('Please unlock MetaMask');
    error.showToUser = true;
    throw error;
  }

  return web3Instance.eth.getCoinbase();
}

/**
 * Given a string message it signs it using MetaMask
 * @param {string} msg The message to sign
 * @returns {Promise<{publicAddress, signature}>}
 */
export async function signMessage(msg) {
  const publicAddress = await getPublicAddress();
  const web3Instance = await getWeb3();
  const hexData = web3Instance.utils.utf8ToHex(msg);
  const signature = await web3Instance.eth.personal.sign(hexData, publicAddress);

  return { publicAddress, signature };
}


const promisify = (inner) =>
  new Promise((resolve, reject) =>
    inner((err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
);

export async function getLedgerPublicAddress() {
  const web3Instance = await getLedgerWeb3();
  const accounts = await promisify(cb => web3Instance.eth.getAccounts(cb));
  if (accounts.length === 0) throw new Error("no accounts found");

  return web3Instance.eth.getCoinbase();
}

export async function ledgerSignMessage(msg) {
  const publicAddress = await getLedgerPublicAddress();
  const web3Instance = await getLedgerWeb3();
  const hexData = web3Instance.utils.utf8ToHex(msg);
  const signature = await web3Instance.eth.personal.sign(hexData, publicAddress);

  return { publicAddress, signature };
}
