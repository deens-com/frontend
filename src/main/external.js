const initSegment = function() {
  var analytics = (window.analytics = window.analytics || []);
  if (analytics.initialize) return;
  if (analytics.invoked) {
    if (window.console && console.error) {
      console.error('Segment snippet included twice.');
    }
    return;
  }
  analytics.invoked = true;
  analytics.methods = [
    'trackSubmit',
    'trackClick',
    'trackLink',
    'trackForm',
    'pageview',
    'identify',
    'reset',
    'group',
    'track',
    'ready',
    'alias',
    'debug',
    'page',
    'once',
    'off',
    'on',
  ];
  analytics.factory = function(method) {
    return function() {
      var args = Array.prototype.slice.call(arguments);
      args.unshift(method);
      analytics.push(args);
      return analytics;
    };
  };
  for (var i = 0; i < analytics.methods.length; i++) {
    var key = analytics.methods[i];
    analytics[key] = analytics.factory(key);
  }
  analytics.load = function(key, options) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js';
    var first = document.getElementsByTagName('script')[0];
    first.parentNode.insertBefore(script, first);
    analytics._loadOptions = options;
  };
  analytics.SNIPPET_VERSION = '4.1.0';
  const environment = '%REACT_APP_NODE_ENV%';
  if (environment === 'production') {
    analytics.load('EeTG9XHL50pFZXCYUOyBaZjtqkXDS4o3');
  } else {
    analytics.load('JS7vZSv3cvBCHvMbVM3TSxR7pAhlKEAb');
  }
};
function initOneSignal() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://cdn.onesignal.com/sdks/OneSignalSDK.js';
  var first = document.getElementsByTagName('script')[0];
  first.parentNode.insertBefore(script, first);
  const environment = '%REACT_APP_NODE_ENV%';
  if (environment === 'production') {
    var OneSignal = window.OneSignal || [];
    OneSignal.push(function() {
      OneSignal.init({
        appId: 'b8c79061-209a-4902-832d-62d4fd02d18b',
      });
    });
  }
}
function initGoogleMaps() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src =
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyBzMYIINQ6uNANLfPeuZn5ZJlz-8pmPjvc&libraries=places&language=en';
  // Insert our script next to the first script element.
  var first = document.getElementsByTagName('script')[0];
  first.parentNode.insertBefore(script, first);
}
const initLibsScript = function() {
  initGoogleMaps();
  initSegment();
  initOneSignal();
};

window.addEventListener('load', initLibsScript);
