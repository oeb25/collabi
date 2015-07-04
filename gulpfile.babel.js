import gulp from 'gulp';
import webpack from 'webpack';
import WDS from 'webpack-dev-server';
import clean from 'gulp-clean';
import runSequence from 'run-sequence';
import babel from 'gulp-babel';

let DEBUG = false;

gulp.task('babel', (cb) => {
  webpack({

    entry: './src/main.js',

    watch: DEBUG,

    output: {
      path: './build',
      filename: 'bundle.js'
    },

    module: {
      loaders: [
        { test: /\.js$/, loader: 'babel' }
      ]
    }

  }, (err, stats) => {
    console.log(stats.toString({
      colors: true
    }))

    if (!DEBUG)
      cb();
  });
});

gulp.task('static', () => {
  return gulp.src('static/*')
    .pipe(gulp.dest('build/'));
});

gulp.task('clean-client', () => {
  return gulp.src('build/*')
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

  runSequence(
    'clean-client',
    ['static', 'babel']
  );

  runSequence(
    'clean-server',
    'build-server'
  );

  gulp.watch('static/*', ['static']);
});
