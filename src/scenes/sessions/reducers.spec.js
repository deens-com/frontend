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
});
