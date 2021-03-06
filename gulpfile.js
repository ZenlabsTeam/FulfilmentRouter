const gulp = require('gulp');
const ts = require('gulp-typescript');
const nodemon = require('gulp-nodemon');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];
const TEST_JSON_FILES = ['test/*.json'];
// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
    const tsResult = tsProject.src()
        .pipe(tsProject());
    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['scripts'], () => {
    gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('assets', function() {
    return gulp.src(JSON_FILES)
        .pipe(gulp.dest('dist/src/'));
});
gulp.task('assetsTest', function() {
    return gulp.src(TEST_JSON_FILES)
        .pipe(gulp.dest('dist/test/'));
});
gulp.task('set-dev-node-env', function() {
    return process.env.NODE_ENV = 'development';
});
gulp.task('serve', ['watch', 'assets', 'set-dev-node-env'], function() {
    return nodemon({
            script: './dist/src/index.js',
        })
        .on('restart', function() {
            console.log('restarted');
        })
})

gulp.task('default', ['scripts', 'assets', 'assetsTest']);