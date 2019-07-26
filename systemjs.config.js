/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {


  var SystemImport = System.import;
  System.import = function (name, options) {
    if (Object.prototype.toString.call(name) !== '[object Array]')
      return SystemImport.apply(this, arguments);
    var self = this;
    return Promise.all(name.map(function (name) {
      return SystemImport.call(self, name); // should i pass options ?
    }));

  };

  // map tells the System loader where to look for things
  var map = {
    'app':                        'dist/app', // 'dist',
    '@lib':                       'lib', // 'dist',
    '@ramda':                     'node_modules/ramda/dist', // 'dist',
    'ramda':                     'node_modules/ramda', // 'dist',
    '@angular':                   'node_modules/@angular',
    '@ngx-translate':             'node_modules/@ngx-translate',
    'ng2-translate':              'node_modules/ng2-translate',
    'socket.io-client':           'node_modules/socket.io-client',
    'dateformat':                 'node_modules/dateformat',
    'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    'rxjs':                       'node_modules/rxjs',
    'css': 'node_modules/systemjs-plugin-css/css.js',
    'aes-js' : 'node_modules/aes-js',
    'rxx': 'node_modules/rx/dist/rx.all.js',
    '@angular/platform-browser': 'node_modules/@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/animations': 'node_modules/@angular/animations/bundles/animations.umd.js',
    '@angular/platform-browser/animations': 'node_modules/@angular/platform-browser/bundles/platform-browser-animations.umd.js',
    '@angular/animations/browser': 'node_modules/@angular/animations/bundles/animations-browser.umd.js',

  };
  var packages = {
    'dateformat':                  { main: 'lib/dateformat.js',  defaultExtension: 'js' },
    'ramda':                      { main: 'dist/ramda.js',  defaultExtension: 'js' },
    'app':                        { main: 'init.js',  defaultExtension: 'js' },
    'ng2-translate':              { main: 'bundles/ng2-translate.umd.js',  defaultExtension: 'js' },
    'socket':                     {defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
    'aes-js': { main: 'index.js', defaultExtension: 'js' },
    'rxjs': {
      defaultExtension: 'js',
      map: {

      }
    },

  };
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    //'platform-browser',
  //  'platform-browser/animations',
    //'platform-browser-dynamic',
    'router',
    'http-loader',
    'upgrade',
    //'animations'
  ];
  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
    packages['ng2-translate/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }
  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.min.js', defaultExtension: 'js' };
    packages['ng2-translate/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  }

  console.log(packages)
  // Most environments should use UMD; some (Karma) need the individual index files
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);
  var config = {
    baseURL:'/',
    map: map,
    packages: packages,
    meta: {
        '*.css': { loader: 'css' }
    }
  };
  System.config(config);
})(this);
