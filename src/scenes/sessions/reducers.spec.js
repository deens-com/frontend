import reducers from './reducers';

describe('sessions reducer', () => {
  it('should handle initial state', () => {
    expect(reducers(undefined, {})).toEqual({
      session: {},
      loginError: {},
      metaMaskError: {},
      ledgerError: {},
      baseCurrency: { label: '$', value: 'USD', rates: {} },
      isLedgerLoaderDisplayed: false,
      updateError: {},
    });
  });

  it('should handle LOGIN_ERROR', () => {
    expect(
      reducers(undefined, {
        type: 'LOGIN_ERROR',
        payload: {
          code: 111,
          message: 'Network error',
        },
      }),
    ).toEqual({
      loginError: { code: 111, message: 'Network error' },
      session: {},
      metaMaskError: {},
      ledgerError: {},
      baseCurrency: { label: '$', value: 'USD', rates: {} },
      isLedgerLoaderDisplayed: false,
      updateError: {},
    });
  });

  it('should handle LOGIN_SUCCESS', () => {
    expect(
      reducers(undefined, {
        type: 'LOGIN_SUCCESS',
        payload: {
          session: {
            hello: 'world',
          },
        },
      }),
    ).toEqual({
      loginError: {},
      session: {
        hello: 'world',
      },
      metaMaskError: {},
      ledgerError: {},
      baseCurrency: { label: '$', value: 'USD', rates: {} },
      isLedgerLoaderDisplayed: false,
      updateError: {},
    });
  });

  it('should clear the previous login error state when handle LOGIN_SUCCESS', () => {
    const initialState = {
      loginError: { code: 111, message: 'Network error' },
      session: {},
    };
    expect(
      reducers(initialState, {
        type: 'LOGIN_SUCCESS',
        payload: {
          session: {
            hello: 'world',
          },
        },
      }),
    ).toEqual({
      loginError: {},
      session: {
        hello: 'world',
      },
    });
  });
});
