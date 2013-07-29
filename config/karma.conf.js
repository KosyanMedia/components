var sh = require('execSync');
var get_from_gem = function(gem_name){
  var result = sh.exec('bundle show ' + gem_name);
  var path_to_gem = result.stdout.replace('\n', '');
  return path_to_gem;
};

// base path, that will be used to resolve files and exclude
basePath = '../';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  get_from_gem('angularjs-rails') + '/vendor/assets/javascripts/angular.js',
  get_from_gem('angularjs-rails') + '/vendor/assets/javascripts/angular-mocks.js',
  get_from_gem('angularjs-rails') + '/vendor/assets/javascripts/angular-cookies.js',
  get_from_gem('jquery-rails') + '/vendor/assets/javascripts/jquery.js',
  'spec/javascripts/support/jasmine-jquery.js',

  'app/assets/javascripts/components/app.js',
  'app/assets/javascripts/components/services/*.js',
  'app/assets/javascripts/components/directives/*.js',

  'spec/javascripts/spec.js',
  'spec/javascripts/components/*_spec.*',
   {
      pattern: 'spec/javascripts/fixtures/*.html',
      watched: true,
      included: false,
      served: true
    }
];

// list of files to exclude
exclude = [
];

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['dots'];

// web server port
port = 9876;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = process.env.KARMA_BROWSER ? [process.env.KARMA_BROWSER] : ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
