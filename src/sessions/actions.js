import Parse from 'parse'

export const sessions_fetched = (session) => {
  return {
    type: 'SESSION_FETCHED',
    payload: session
  }
}


export const fetch_session = (email, password) => {
  return (dispatch) => {
    Parse.User.logIn(email, password).then(user =>{
      dispatch(sessions_fetched({session: user}))
    },error =>{
      console.log(error)
    })
  }
}
