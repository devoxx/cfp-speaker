// Karma configuration

// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
    JASMINE,
    JASMINE_ADAPTER,
    'app/components/unstable-angular-complete/angular.js',
    'app/components/unstable-angular-complete/angular-cookies.js',
    'app/components/unstable-angular-complete/angular-mocks.js',
    'app/components/angular-bootstrap/ui-bootstrap-tpls.js',
    'app/config.js',
    'app/scripts/config.js',
    'app/scripts/services.js',
    'app/scripts/app.js',
    'app/scripts/generic_controllers.js',
    'app/scripts/*.js',
    'app/scripts/**/module.js',
    'app/scripts/**/services.js',
    'app/scripts/**/*.js',
    'test/mock/**/*.js',
    'test/spec/**/*.js'
];

// list of files to exclude
exclude = [
    'app/scripts/main.js',
    'app/scripts/not_in_karma/*.js'
];

// test results reporter to use
// possible values: dots || progress || growl
reporters = ['progress', 'coverage', 'junit'];

preprocessors = {
  '.tmp/scripts/**/*.js': 'coverage',
  '!(dist)/scripts/**/*.js': 'coverage'
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
