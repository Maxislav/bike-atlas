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
    '@lib':                        'lib', // 'dist',
    '@ramda':                      'node_modules/ramda/dist', // 'dist',
    '@angular':                   'node_modules/@angular',
    '@ngx-translate':             'node_modules/@ngx-translate',
    'ng2-translate':              'node_modules/ng2-translate',
    'socket':                     'node_modules/socket.io-client/dist',
    'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    'rxjs':                       'node_modules/rxjs',
    'css': 'node_modules/systemjs-plugin-css/css.js',
    'aes-js' : 'node_modules/aes-js',
    'rxx': 'node_modules/rx/dist/rx.all.js'
  };
  var packages = {
    'app':                        { main: 'init.js',  defaultExtension: 'js' },
    'ng2-translate':              { main: 'bundles/ng2-translate.umd.js',  defaultExtension: 'js' },
      'socket': {defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
    'aes-js': { main: 'index.js', defaultExtension: 'js' },
    'rxjs': {
      defaultExtension: 'js',
      map: {
       // './Observable.js': 'node_modules/rx/dist/rx.all.js',
        /*'./observable/forkJoin.js': 'node_modules/rx/dist/rx.all.js',
         './observable/fromPromise.js': 'rxx',
         './operator/map.js': 'node_modules/rx/dist/rx.all.js',
         './Subject.js': 'node_modules/rx/dist/rx.all.js',
         './BehaviorSubject.js': 'node_modules/rx/dist/rx.all.js',
         './observable/of.js': 'node_modules/rx/dist/rx.all.js',
         './operator/concatMap.js': 'node_modules/rx/dist/rx.all.js',
         './operator/mergeMap.js': 'node_modules/rx/dist/rx.all.js',

         './observable/from.js': 'node_modules/rx/dist/rx.all.js',
         './operator/concatAll.js': 'node_modules/rx/dist/rx.all.js',
         './operator/catch.js': 'node_modules/rx/dist/rx.all.js',
         './operator/first.js': 'node_modules/rx/dist/rx.all.js',
         './util/EmptyError.js': 'node_modules/rx/dist/rx.all.js',
         './operator/every.js': 'node_modules/rx/dist/rx.all.js',
         './operator/last.js': 'node_modules/rx/dist/rx.all.js',
         './operator/mergeAll.js': 'node_modules/rx/dist/rx.all.js',
         './operator/reduce.js': 'node_modules/rx/dist/rx.all.js',
         './operator/filter.js': 'node_modules/rx/dist/rx.all.js',
         './observable/merge.js': 'node_modules/rx/dist/rx.all.js',
         './operator/share.js': 'node_modules/rx/dist/rx.all.js',
         './Subscription.js': 'node_modules/rx/dist/rx.all.js',
         './add/observable/of.js': 'node_modules/rx/dist/rx.all.js',
         './add/operator/map.js': 'node_modules/rx/dist/rx.all.js',
         './add/operator/merge.js': 'node_modules/rx/dist/rx.all.js',
         './add/operator/share.js': 'node_modules/rx/dist/rx.all.js',
         './add/operator/take.js': 'node_modules/rx/dist/rx.all.js',
         './add/operator/toArray.js': 'node_modules/rx/dist/rx.all.js',*/

      }
    },
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
    'http-loader',
   // 'router-deprecated',
    'upgrade'
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
