import gulp from 'gulp';
import autoprefixer from 'autoprefixer';
import browserify from 'browserify';
import watchify from 'watchify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import eslint from 'gulp-eslint';
import babelify from 'babelify';
import uglify from 'gulp-uglify';
import rimraf from 'rimraf';
import notify from 'gulp-notify';
import browserSync, { reload } from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import postcss from 'gulp-postcss';
import nested from 'postcss-nested';
import vars from 'postcss-simple-vars';
import extend from 'postcss-simple-extend';
import cssnano from 'cssnano';
import htmlReplace from 'gulp-html-replace';
import image from 'gulp-image';
import runSequence from 'run-sequence';
import less from 'gulp-less';
import nodemon from 'gulp-nodemon';
import karma from 'karma';

const paths = {
  bundle: 'app.js',
  srcJsx: 'src/Index.js',
  srcScss: 'src/less/app.less',
  srcScssDir: 'src/less/**/*.less',
  srcFontsDir: ['node_modules/react-widgets/lib/fonts/**/*.{eot,svg,ttf,woff,woff2}', 'bower_components/bootstrap/fonts/**/*.{eot,svg,ttf,woff,woff2}', 'bower_components/font-awesome/fonts/**/*.{eot,svg,ttf,woff,woff2}'],
  srcImg: 'src/images/**',
  dist: 'dist',
  distJs: 'dist/js',
  distImg: 'dist/images'
};

// select prod/dev
let env = () => {
    return require(`./environment/${prod ? 'production' : 'development'}.js`);
};
let prod = false;

// -----clean-----
// deep deletion of the dist dir. squeaky.
gulp.task('clean', cb => {
    rimraf(`${prod ? '' : '.'}dist`, cb);
});

// -----browserSync-----
// run nodemon (auto refreshes the server on change in index.js)
gulp.task('browserSync', () => {
  nodemon({
    script: 'index.js'
  });
});

// -----watchify-----
// on update, recompiles browserify bundles
gulp.task('watchify', () => {
  let bundler = watchify(browserify(paths.srcJsx, watchify.args));

  function rebundle () {
    return bundler
      .bundle()
      .on('error', notify.onError())
      .pipe(source(paths.bundle))
      .pipe(gulp.dest(`${prod ? '' : '.'}${paths.distJs}`))
      .pipe(reload({stream: true}));
  }

  bundler.transform(babelify)
  .on('update', rebundle);
  return rebundle();
});

// -----browserify-----
// compress files, write to dist dir
gulp.task('browserify', () => {
  browserify(paths.srcJsx)
  .transform('babelify')
  .bundle()
  .pipe(source(paths.bundle))
  .pipe(buffer())
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(`${prod ? '' : '.'}${paths.distJs}`));
});

// -----styles-----
// convert less files to css in the dist styles dir
gulp.task('styles', () => {
  gulp.src(paths.srcScss)
  .pipe(sourcemaps.init())
  .pipe(less({
    paths: [__dirname + '/node_modules/fullcalendar/dist', __dirname + '/node_modules/react-widgets/lib/less', __dirname + '/bower_components/bootstrap/less', __dirname + '/bower_components/font-awesome/less']
  }).on('error', (err) => console.log(err)))
  .pipe(postcss([vars, extend, nested, autoprefixer, cssnano]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(`${prod ? '' : '.'}${paths.dist}` + '/styles'))
  .pipe(reload({stream: true}));
});

// -----fonts-----
// fonts -> dist dir
gulp.task('fonts', () => {
  gulp.src(paths.srcFontsDir)
  .pipe(gulp.dest(`${prod ? '' : '.'}${paths.dist}` + '/fonts'));
});

// -----htmlReplace-----
// replace build:css, js and env blocks in index.html
gulp.task('htmlReplace', () => {
  gulp.src('index.html')
  .pipe(htmlReplace({
    env: {
      src: null,
      tpl: `<script>window.env = ${JSON.stringify(env())}</script>`
    }, js: 'js/app.js',
    css: 'styles/app.css'
  }))
  .pipe(gulp.dest(`${prod ? '' : '.'}${paths.dist}`));
});

// -----images-----
// images -> dist dir
gulp.task('images', () => {
  gulp.src(paths.srcImg)
  .pipe(image())
  .pipe(gulp.dest(`${prod ? '' : '.'}${paths.distImg}`));
});

// -----lint-----
// lint js files
gulp.task('lint', () => {
  gulp.src(paths.srcJsx)
  .pipe(eslint())
  .pipe(eslint.format());
});

// -----prod-----
// switch to the prod env
gulp.task('prod', () => {
  prod = true;
});

// -----watchTask-----
// watch js and less files. run tasks lint or styles when changed
gulp.task('watchTask', () => {
  gulp.watch(paths.srcScssDir, ['styles']);
  gulp.watch(paths.srcJsx, ['lint']);
});

// -----test-----
// start the karma server. run tests on js file changes
gulp.task('test', cb => {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, cb).start();
});

// -----watch-----
// run all the tasks!
gulp.task('watch', cb => {
  let tasks = ['clean', ['htmlReplace', 'watchTask', 'watchify', 'fonts', 'styles', 'lint', 'images'], 'browserSync', 'test', cb];
  
  if (process.env.NODE_ENV === 'production') {
    let idx = tasks.indexOf('test');
    tasks.splice(idx, 1);
    tasks = ['prod'].concat(tasks);
  }
  runSequence.apply(null, tasks);
});

// -----build-----
// build prod
gulp.task('build', cb => {
  process.env.NODE_ENV = 'production';
  runSequence('prod', 'clean', ['browserify', 'styles', 'fonts', 'htmlReplace', 'images'], cb);
});
