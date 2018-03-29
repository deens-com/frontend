import reducers from "./reducers";

const initialState = {
  services: {},
  trips: [],
  tags: [],
  popularPlaces: [],
  exciting_activities: [],
  delicious_foods: []
};

describe("homes reducer", () => {
  it("should handle initial state", () => {
    expect(reducers(undefined, {})).toEqual(initialState);
  });
});
