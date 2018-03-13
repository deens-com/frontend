
export const sessions_fetched = (session) => {
  return {
    type: 'SESSION_FETCHED',
    payload: session
  }
}


export const fetch_session = () => {
  return (dispatch) => {
    // Parse.getServices().then((response) => {
    //   dispatch(services_fetched({services: response.services}))
    // }).catch((error) => {
    //   console.log(error)
    // })
  }
}
