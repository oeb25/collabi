import gulp from 'gulp';
import gutil from 'gulp-util';
import webpack from 'webpack';
import WDS from 'webpack-dev-server';
import clean from 'gulp-clean';
import runSequence from 'run-sequence';
import babel from 'gulp-babel';
import livereload from 'gulp-livereload';

let DEBUG = false;

gulp.task('babel', (cb) => {
  webpack({

    entry: './app/src/main.js',

    watch: DEBUG,

    output: {
      path: './app/build',
      filename: 'bundle.js'
    },

    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel' }
      ]
    }

  }, (err, stats) => {
    if(err) throw new gutil.PluginError("webpack", err);
    /*
    console.log(stats.toString({
      colors: true
    }));
    */

    if (!DEBUG)
      cb();
  });
});

gulp.task('static', () => {
  return gulp.src('app/static/*')
    .pipe(gulp.dest('app/build/'));
});

gulp.task('clean-client', () => {
  return gulp.src('app/build/*')
    .pipe(clean());
});

gulp.task('clean-server', () => {
  return gulp.src('server/build/*')
    .pipe(clean());
});

gulp.task('build-server', () => {
  return gulp.src('server/src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('server/build/'));
});

gulp.task('watch', () => {
  DEBUG = true;

  livereload.listen();

  return runSequence(
    'watch-client',
    'watch-server'
  );
});

gulp.task('watch-client', () => {
  runSequence(
    'clean-client',
    ['static', 'babel']
  );

  if (DEBUG) {
    gulp.watch('app/static/*', ['static']);
    gulp.watch('app/build/*', ({ path }, b, c) => {
      livereload.changed(path);
    });
  }
});

gulp.task('watch-server', () => {
  runSequence(
    'clean-server',
    'build-server'
  );

  if (DEBUG) {
    gulp.watch('server/src/*', ['build-server']);
  }
});
