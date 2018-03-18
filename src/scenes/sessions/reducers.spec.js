import reducers from "./reducers";

describe("sessions reducer", () => {
  it("should handle initial state", () => {
    expect(reducers(undefined, {})).toEqual({
      session: {},
      loginError: {}
    });
  });

  it("should handle LOGIN_ERROR", () => {
    expect(
      reducers(undefined, {
        type: "LOGIN_ERROR",
        payload: {
          code: 111,
          message: "Network error"
        }
      })
    ).toEqual({
      loginError: { code: 111, message: "Network error" },
      session: {}
    });
  });

  it("should handle SESSION_FETCHED", () => {
    expect(
      reducers(undefined, {
        type: "SESSION_FETCHED",
        payload: {
          session: {
            hello: "world"
          }
        }
      })
    ).toEqual({
      loginError: {},
      session: {
        hello: "world"
      }
    });
  });

  it("should clear the previous login error state when handle SESSION_FETCHED", () => {
    const initialState = {
      loginError: { code: 111, message: "Network error" },
      session: {}
    };
    expect(
      reducers(initialState, {
        type: "SESSION_FETCHED",
        payload: {
          session: {
            hello: "world"
          }
        }
      })
    ).toEqual({
      loginError: {},
      session: {
        hello: "world"
      }
    });
  });
});
