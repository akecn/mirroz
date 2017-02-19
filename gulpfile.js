const gulp = require('gulp');
const babel = require('gulp-babel');
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const gulpCopy = require('gulp-copy');
const less = require('gulp-less');
const rename = require("gulp-rename");
const minifyCSS = require('gulp-csso');

const babelrcText = fs.readFileSync(path.resolve(__dirname, './.babelrc'));
const babelConfig = JSON.parse(babelrcText.toString());

babelConfig.plugins = [
  ["import", {
    "libraryName": "antd"
  }]
];

gulp.task('clean', () => {
  execSync('rm -rf lib');
});

gulp.task('babel', () => {
  return gulp.src('src/*/index.js')
    .pipe(babel(babelConfig))
    .pipe(gulp.dest('lib'));
});

gulp.task('less', () => {
  return gulp.src('src/*/style/index.less')
    .pipe(gulpCopy('lib', {prefix: 1}))
    .pipe(less({
      paths: [
        path.join(__dirname, 'node_modules/antd')
      ]
    }))
    .pipe(gulp.dest('lib'));
});

const theme = fs.readdirSync('./theme/').map(key => {
  return {name: path.basename(key, '.json'), variables: require(`./theme/${key}`)};
});

theme.forEach(item => {
  gulp.task(`theme:${item.name}`, () => {
    return gulp.src('src/index.less')
      .pipe(rename(`${item.name}.less`))
      .pipe(less({
        modifyVars: item.variables,
        paths: [
          path.join(__dirname, 'node_modules/antd')
        ]
      }))
      .pipe(minifyCSS())
      .pipe(gulp.dest('build'));
  });
});

gulp.task('theme', theme.map(it => `theme:${it.name}`));

gulp.task('generate', ['clean', 'babel', 'less']);
