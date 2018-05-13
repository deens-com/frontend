import Web3 from 'web3';

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
