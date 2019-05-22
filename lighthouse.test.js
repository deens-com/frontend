const lighthouse = require('lighthouse'); // Node CLI for Lighthouse https://www.npmjs.com/package/lighthouse#using-the-node-cli
const chromeLauncher = require('chrome-launcher'); // Launch Chrome from node

jest.setTimeout(60000);

const launchChromeAndRunLighthouse = (url, opts = { chromeFlags: [] }, config = null) =>
  chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => chrome.kill().then(() => results));
  });

test('Meaningful first paint score', () =>
  launchChromeAndRunLighthouse(`https://deens-master.now.sh`, undefined, {
    extends: 'lighthouse:default',
    settings: {
      throttlingMethod: 'devtools',
      onlyCategories: ['performance'],
    },
  }).then(({ lhr: { audits } }) => {
    console.log(audits);
    console.log(audits['first-meaningful-paint'].score);
  }));
