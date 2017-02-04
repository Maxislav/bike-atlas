/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {
  // map tells the System loader where to look for things
  var map = {
    'app':                        'dist/app', // 'dist',
    '@lib':                        'lib', // 'dist',
    '@ramda':                      'node_modules/ramda/dist', // 'dist',
    '@angular':                   'node_modules/@angular',
    'socket':                     'node_modules/socket.io-client/dist',
    'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    'rxjs':                       'node_modules/rxjs',
      'css': 'node_modules/systemjs-plugin-css/css.js'
    /*'rxjs/Subject':                       'dist/rx.min.js',
    'rxjs/Observable':                       'dist/rx.min.js',
    'rxjs/observable/PromiseObservable':                       'dist/rx.min.js',
    'rxjs/operator/toPromise':                       'dist/rx.min.js',
    '/rxjs/observable/from ' : 'dist/rx.min.js' ,
    '/rxjs/operator/every ' : 'dist/rx.min.js' ,
    '/rxjs/observable/of ' : 'dist/rx.min.js' ,
    '/rxjs/operator/map ' : 'dist/rx.min.js' ,
    '/rxjs/operator/mergeMap ' : 'dist/rx.min.js' ,
    '/rxjs/operator/mergeAll ' : 'dist/rx.min.js' ,
    '/rxjs/operator/reduce' : 'dist/rx.min.js' ,
    '/rxjs/operator/catch ' : 'dist/rx.min.js' ,
    '/rxjs/operator/concatAll ' : 'dist/rx.min.js' ,
    '/rxjs/operator/first' : 'dist/rx.min.js' ,
    '/rxjs/util/EmptyError' : 'dist/rx.min.js' ,
    '/rxjs/observable/fromPromise' : 'dist/rx.min.js' ,
    '/rxjs/operator/last' : 'dist/rx.min.js' ,
    '/rxjs/BehaviorSubject' : 'dist/rx.min.js'*/
  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'init.js',  defaultExtension: 'js' },
    'rxjs':                       { main : 'Rx.js', defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' }
  };
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
   // 'router-deprecated',
    'upgrade'
  ];
  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }
  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.min.js', defaultExtension: 'js' };
  }
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
