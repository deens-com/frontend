import reducers from "./reducers";

const initialState = {
  services: [],
  trips: [],
  tags: [],
  popularPlaces: []
};

describe("homes reducer", () => {
  it("should handle initial state", () => {
    expect(reducers(undefined, {})).toEqual(initialState);
  });
});
