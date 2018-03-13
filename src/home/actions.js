
export const services_fetched = (services) => {
  return {
    type: 'SERVICES_FETCHED',
    payload: services
  }
}


export const fetch_services = () => {
  return (dispatch) => {
    // Parse.getServices().then((response) => {
    //   dispatch(services_fetched({services: response.services}))
    // }).catch((error) => {
    //   console.log(error)
    // })
  }
}
