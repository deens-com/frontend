import Parse from 'parse'

export const sessions_fetched = (session) => {
  return {
    type: 'SESSION_FETCHED',
    payload: session
  }
}


export const fetch_session = () => {
  return (dispatch) => {
    Parse.User.logIn('olivier@olivier.com', 'olivier@olivier.com').then(user =>{
      //let current_user = Parse.User.current()
      dispatch(sessions_fetched({session: user}))
    },error =>{
      console.log(error)
    })
  }
}
