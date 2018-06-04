import Parse from 'parse';
import ethers from 'ethers';

export const types = {
  SERVICE_CREATE_STARTED: 'SERVICE_CREATE_STARTED',
  SERVICE_CREATE_SUCCESS: 'SERVICE_CREATE_SUCCESS',
  SERVICE_CREATE_ERROR: 'SERVICE_CREATE_ERROR',
};

export const registerService = (values, history) => async (dispatch, getState) => {
  const state = getState();
  const { isSubmitting } = state.NewService;
  if (isSubmitting) return;
  dispatch({ type: types.SERVICE_CREATE_STARTED });
  try {
    const { mainPicture, acceptETH } = values;
    const parseFile = await new Parse.File(mainPicture.name, mainPicture).save();
    const result = await Parse.Cloud.run('createOrUpdateService', {
      ...values,
      parseFile,
      availableDays: [...values.availableDays],
    });

    if (acceptETH) {
      dispatch(deployContract(result, values, history));
    } else {
      dispatch({ type: types.SERVICE_CREATE_SUCCESS, payload: result });
      history.push(`/services/${result.id}`);
    }


  } catch (error) {
    if (error.errors) {
      dispatch({ type: types.SERVICE_CREATE_ERROR, payload: error.errors });
    }
  }
};

export const deployContract = (service, values, history) => async (dispatch, getState) => {
  const { pricePerSession, slots } = values;

  // retrieve most recent contract ID
  let ipfsContract = Parse.Object.extend("ipfsContract");
  let query = new Parse.Query(ipfsContract);
  query.descending("createdAt");
  let ipfsContractObject = await query.first();

  // automatically assign the contract version to service
  service.set("contractVersion", {"__type": "Pointer", "className": "ipfsContract", "objectId": ipfsContractObject.id});
  await service.save();

  // retrieve contract details from ipfsAPI end point (abi and bytecode)

  let lastContract = await Parse.Cloud.run("getLastContract");


  // start deploying contract to network

  var bytecode = lastContract.bytecode;
  var abi = JSON.stringify(lastContract.abi);
  var params = {};
  params.start = [0, 0, 0, 0, 0, 0, 0];
  params.end = [20, 20, 20, 20, 20, 20, 20];
  params.price = pricePerSession;
  params.ipfs = "efjisajefojseoifjwdjfoisjdfgjspdgfjoisdjgiosdjiofjsdiofjsiodhfgoishhj";
  params.maxAvailableSpots = slots;

  var network = ethers.providers.networks.ropsten
  var provider = new ethers.providers.InfuraProvider(network);
  let wallet = new ethers.providers.Web3Provider(window.web3.currentProvider, network).getSigner()
  let deployTransaction = ethers.Contract.getDeployTransaction(bytecode,
                                                                  abi,
                                                                  1,
                                                                  params.start,
                                                                  params.end,
                                                                  params.ipfs,
                                                                  params.price,
                                                                  params.maxAvailableSpots,
                                                                  [10, 15],
                                                                  [50, 70],
                                                                  ipfsContractObject.get("ratingsContractAddress"),
                                                                  ipfsContractObject.get("tokenRateAddress"),
                                                                  ipfsContractObject.get("delegateResolverAddress"),
                                                                  ipfsContractObject.get("bookingTimeUtilsAddress"),
                                                                  ipfsContractObject.get("eventHubAddress"));
  let estimate = await provider.estimateGas(deployTransaction);

  // send transaction
  let transaction = {
      // eslint-disable-next-line
      gasLimit: Math.round(parseInt(estimate) + parseInt(estimate) / 100 * 1) > 4512058 ? 4512058 : Math.round(parseInt(estimate) + parseInt(estimate) / 100 * 1),
      data: deployTransaction.data
  }

  let transactionResponse = await wallet.sendTransaction(transaction);

  // update contract address

  let newContractAddress = ethers.utils.getContractAddress(transactionResponse)
  service.set("contractAddress", newContractAddress);

  await service.save();

  dispatch({ type: types.SERVICE_CREATE_SUCCESS, payload: service });
  history.push(`/services/${service.id}`);
}
