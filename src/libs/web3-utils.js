import Web3 from 'web3';

/**
 * Given a string message it signs it using MetaMask
 * @param {string} msg The message to sign
 * @returns {Promise<{publicAddress, signature}>}
 */
export async function signMessage(msg) {
  const provider = Web3.givenProvider || (window.web3 && window.web3.currentProvider);
  if (!provider) {
    const error = new Error('Please Install MetaMask');
    error.showToUser = true;
    throw error;
  }

  const web3Instance = new Web3(provider);
  const accounts = await web3Instance.eth.getAccounts();
  if (!accounts || !accounts.length) {
    const error = new Error('Please unlock MetaMask');
    error.showToUser = true;
    throw error;
  }

  const publicAddress = await web3Instance.eth.getCoinbase();
  const hexData = web3Instance.utils.utf8ToHex(msg);
  const signature = await web3Instance.eth.personal.sign(hexData, publicAddress);

  return { publicAddress, signature };
}
