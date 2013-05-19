// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'src/main/webapp/js/lib/angular.js',
  'src/main/webapp/js/lib/angular-cookies.js',
  'src/main/webapp/js/lib/angular-mocks.js',
  'src/main/webapp/js/lib/angular-resource.js',
  'src/main/webapp/js/ui-bootstrap-tpls-0.2.0.js',
  'src/main/webapp/js/app.js',
  'src/main/webapp/js/services.js',
  'src/main/webapp/js/generic_controllers.js',
  'src/main/webapp/js/directives.js',
  'src/main/webapp/js/config.js',
  'src/main/webapp/js/speaker/controllers.js',
  'src/test/js/**/*.js'
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress', 'coverage', 'junit'];

preprocessors = {
  '/src/main/webapp/js/**/*.js': 'coverage'
};

coverageReporter = {
  type : 'html',
  dir : 'coverage/'
}

// web server port
port = 8080;

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
browsers = ['Chrome'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 50000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;

junitReporter = {
  outputFile: 'test_out/unit.xml',
  suite: 'unit'
};
