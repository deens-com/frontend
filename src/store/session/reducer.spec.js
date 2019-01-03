import reducer from './reducer';

describe('sessions reducer', () => {
  it('should handle initial state', () => {
    expect(reducer(undefined, {})).toEqual({
      session: {},
      loginError: {},
      loggedIn: null,
      metaMaskError: {},
      ledgerError: {},
      baseCurrency: { label: '$', value: 'USD', rates: {} },
      isLedgerLoaderDisplayed: false,
      updateError: {},
      isUploadingAvatar: false,
      isLoading: false,
    });
  });

  it('should handle LOGIN_ERROR', () => {
    expect(
      reducer(undefined, {
        type: 'LOGIN_ERROR',
        payload: {
          code: 111,
          message: 'Network error',
        },
      }),
    ).toEqual({
      loginError: { code: 111, message: 'Network error' },
      loggedIn: false,
      session: {},
      metaMaskError: {},
      ledgerError: {},
      baseCurrency: { label: '$', value: 'USD', rates: {} },
      isLedgerLoaderDisplayed: false,
      updateError: {},
      isUploadingAvatar: false,
      isLoading: false,
    });
  });

  it('should handle LOGIN_SUCCESS', () => {
    expect(
      reducer(undefined, {
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
      loggedIn: true,
      metaMaskError: {},
      ledgerError: {},
      baseCurrency: { label: '$', value: 'USD', rates: {} },
      isLedgerLoaderDisplayed: false,
      updateError: {},
      isUploadingAvatar: false,
      isLoading: false,
    });
  });

  it('should clear the previous login error state when handle LOGIN_SUCCESS', () => {
    const initialState = {
      loginError: { code: 111, message: 'Network error' },
      session: {},
    };
    expect(
      reducer(initialState, {
        type: 'LOGIN_SUCCESS',
        payload: {
          session: {
            hello: 'world',
          },
        },
      }),
    ).toEqual({
      loggedIn: true,
      isLoading: false,
      loginError: {},
      session: {
        hello: 'world',
      },
    });
  });
});
