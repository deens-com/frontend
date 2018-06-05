import Parse from 'parse';
import ethers from 'ethers';
import fetch_helpers from '../../libs/fetch_helpers';

export const types = {
  SERVICE_CREATE_STARTED: 'SERVICE_CREATE_STARTED',
  SERVICE_CREATE_SUCCESS: 'SERVICE_CREATE_SUCCESS',
  SERVICE_CREATE_ERROR: 'SERVICE_CREATE_ERROR',

  SERVICE_FETCH_STARTED: 'EDIT/SERVICE_FETCH_STARTED',
  SERVICE_FETCH_SUCCESS: 'EDIT/SERVICE_FETCH_SUCCESS',
  SERVICE_FETCH_ERROR: 'EDIT/SERVICE_FETCH_ERROR',

  SERVICE_SAVE_STARTED: 'EDIT/SERVICE_SAVE_STARTED',
  SERVICE_SAVE_SUCCCESS: 'EDIT/SERVICE_SAVE_SUCCCESS',
  SERVICE_SAVE_ERROR: 'EDIT/SERVICE_SAVE_ERROR',
};

export const registerService = (values, history) => async (dispatch, getState) => {
  const state = getState();
  const { isSubmitting } = state.ServiceUpsert;
  if (isSubmitting) return;
  dispatch({ type: types.SERVICE_CREATE_STARTED });
  try {
    const { mainPicture, acceptETH } = values;
    let parseFile;
    if (mainPicture) {
      parseFile = await new Parse.File(mainPicture.name, mainPicture).save();
    }
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

export const fetchService = serviceId => async (dispatch, getState) => {
  if (!serviceId) return;
  const state = getState();
  const { isLoading } = state.ServiceUpsert;
  if (isLoading) return;
  dispatch({ type: types.SERVICE_FETCH_STARTED });
  try {
    const result = await fetch_helpers.build_query('Service').get(serviceId);
    const service = fetch_helpers.normalizeParseResponseData(result);
    dispatch({ type: types.SERVICE_FETCH_SUCCESS, payload: service });
  } catch (error) {
    dispatch({ type: types.SERVICE_FETCH_ERROR, payload: error });
  }
};

export const saveServiceChanges = (serviceId, values, history) => async (dispatch, getState) => {
  if (!serviceId) return;
  const state = getState();
  const { isLoading } = state.ServiceUpsert;
  if (isLoading) return;
  dispatch({ type: types.SERVICE_SAVE_STARTED });
  try {
    const rawService = await fetch_helpers.build_query('Service').get(serviceId);
    const service = fetch_helpers.normalizeParseResponseData(rawService);
    const input = {
      id: serviceId,
      ...service,
      ...values,
      availableDays: [...values.availableDays],
    };
    const result = await Parse.Cloud.run('createOrUpdateService', input);
    dispatch({ type: types.SERVICE_SAVE_SUCCCESS, payload: result });
    // TODO: @vlad update smart contract
    history.push(`/services/${result.id}`);
  } catch (error) {
    if (error.errors) {
      dispatch({ type: types.SERVICE_SAVE_ERROR, payload: error.errors });
    }
  }
};

export const deployContract = (service, values, history) => async (dispatch, getState) => {
  try {
    const { pricePerSession, slots } = values;

    // retrieve most recent contract ID
    let ipfsContract = Parse.Object.extend('ipfsContract');
    let query = new Parse.Query(ipfsContract);
    query.descending('createdAt');
    let ipfsContractObject = await query.first();

    // automatically assign the contract version to service
    service.set('contractVersion', { __type: 'Pointer', className: 'ipfsContract', objectId: ipfsContractObject.id });
    await service.save();

    // retrieve contract details from ipfsAPI end point (abi and bytecode)

    let lastContract = await Parse.Cloud.run('getLastContract');

    // start deploying contract to network

    var bytecode = lastContract.bytecode;
    var abi = JSON.stringify(lastContract.abi);
    var params = {};
    params.start = [0, 0, 0, 0, 0, 0, 0];
    params.end = [20, 20, 20, 20, 20, 20, 20];
    params.price = pricePerSession;
    params.ipfs = 'efjisajefojseoifjwdjfoisjdfgjspdgfjoisdjgiosdjiofjsdiofjsiodhfgoishhj';
    params.maxAvailableSpots = slots;

    var network = ethers.providers.networks.ropsten;
    var provider = new ethers.providers.InfuraProvider(network);
    let wallet = new ethers.providers.Web3Provider(window.web3.currentProvider, network).getSigner();
    let deployTransaction = ethers.Contract.getDeployTransaction(
      bytecode,
      abi,
      1,
      params.start,
      params.end,
      params.ipfs,
      params.price,
      params.maxAvailableSpots,
      [10, 15],
      [50, 70],
      ipfsContractObject.get('ratingsContractAddress'),
      ipfsContractObject.get('tokenRateAddress'),
      ipfsContractObject.get('delegateResolverAddress'),
      ipfsContractObject.get('bookingTimeUtilsAddress'),
      ipfsContractObject.get('eventHubAddress')
    );

    // we will use this later, hence I'll keep this line commented
    // let estimate = await provider.estimateGas(deployTransaction);

    // send transaction
    let transaction = {
      gasPrice: 20000000000,
      gasLimit: 4512058,
      data: deployTransaction.data,
    };

    let transactionResponse = await wallet.sendTransaction(transaction);

    // update contract address

    let newContractAddress = ethers.utils.getContractAddress(transactionResponse);
    service.set('contractAddress', newContractAddress);

    await service.save();

    dispatch({ type: types.SERVICE_CREATE_SUCCESS, payload: service });
    history.push(`/services/${service.id}`);
  } catch (e) {
    dispatch({ type: types.SERVICE_CREATE_ERROR, payload: "We could not deploy the smart contract. Please check if your ledger device or meta mask are connected properly." });
  }
};
