// Karma configuration
// Generated on Sun May 19 2013 15:24:38 GMT+0200 (West-Europa (zomertijd))


// base path, that will be used to resolve files and exclude
basePath = '';


/*
    <script type="text/javascript" src="js/vendor/modernizr-2.6.2.min.js"></script>

    <script type="text/javascript" src="js/vendor/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="js/lib/angular.js"></script>
    <script type="text/javascript" src="js/lib/angular-cookies.js"></script>
    <script type="text/javascript" src="js/lib/angular-resource.js"></script>
    <!--<script type="text/javascript" src="js/lib/bootstrap-2.3.1.js"></script>-->
    <script type="text/javascript" src="js/ui-bootstrap-tpls-0.2.0.js"></script>
    <script type="text/javascript" src="js/angular-strap.min.js"></script>
    <script type="text/javascript" src="js/services.js"></script>
    <script type="text/javascript" src="js/app.js"></script>
    <script type="text/javascript" src="js/directives.js"></script>
    <script type="text/javascript" src="js/filters.js"></script>
    <script type="text/javascript" src="js/generic_controllers.js"></script>
    <script type="text/javascript" src="js/speaker/controllers.js"></script>

    <!--<script src="js/vendor/jquery-1.9.1.min.js"></script>-->
    <!--<script>window.jQuery || document.write('<script src="js/vendor/jquery-1.9.1.min.js"><\/script>')</script>-->
    <script type="text/javascript" src="js/vendor/jquery.meanmenu.2.0.min.js"></script>
    <script type="text/javascript" src="js/vendor/jquery.uniform.min.js"></script>
    <script type="text/javascript" src="js/vendor/jquery.bxslider.min.js"></script>
    <script type="text/javascript" src="js/main.js"></script>
*/

// list of files / patterns to load in the browser
files = [
    JASMINE,
    JASMINE_ADAPTER,
    '../../main/webapp/js/vendor/modernizr-2.6.2.min.js',
    '../../main/webapp/js/vendor/jquery-1.9.1.min.js',
    '../../main/webapp/js/vendor/jquery.meanmenu.2.0.min.js',
    '../../main/webapp/js/vendor/jquery.uniform.min.js',
    '../../main/webapp/js/vendor/jquery.bxslider.min.js',
    '../../main/webapp/js/lib/angular.js',
    '../../main/webapp/js/lib/angular-cookies.js',
    '../../main/webapp/js/lib/angular-resource.js',
    '../../main/webapp/js/lib/ui-bootstrap-tpls-0.2.0.js',
    '../../main/webapp/js/lib/angular-strap.min.js',
    '../../main/webapp/js/*.js',
    '../../main/webapp/js/speaker/*.js',
    'lib/angular-mocks.js',
    '**/*Spec.js',
    '**/*Test.js'
];


// list of files to exclude
exclude = [

];

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


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
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
