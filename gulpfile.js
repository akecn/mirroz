const gulp = require('gulp');
const babel = require('gulp-babel');
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const gulpCopy = require('gulp-copy');
const less = require('gulp-less');
const rename = require("gulp-rename");
const minifyCSS = require('gulp-csso');
const mkdirp = require('mkdirp');

const babelrcText = fs.readFileSync(path.resolve(__dirname, './.babelrc'));
const babelConfig = JSON.parse(babelrcText.toString());

babelConfig.plugins = [
  ["import", {
    "libraryName": "antd"
  }]
];

gulp.task('clean:lib', () => {
  execSync('rm -rf lib');
});
gulp.task('clean:build', () => {
  execSync('rm -rf build');
});

gulp.task('clean', ['clean:lib', 'clean:build']);

gulp.task('babel', () => {
  return gulp.src('src/**/index.js')
    .pipe(babel(babelConfig))
    .pipe(gulp.dest('lib'));
});

gulp.task('less', () => {
  // todo generate theme less entries to lib
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

theme.unshift({name: 'index', variables: {}})

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

gulp.task('version', () => {
  const pkg = require('./package.json');
  const pkgAntd = require('./node_modules/antd/package.json');
  mkdirp.sync('src/version');
  fs.writeFileSync(`src/version/index.js`, `export default {version: "${pkg.version}", antd: "${pkgAntd.version}"};`);
});

gulp.task('generate', ['clean:lib', 'version', 'babel', 'less']);
