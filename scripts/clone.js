/**
 * 仅用于初始创建 antd 相关的组件库。
 * 用统一的格式来引入 mirroz 包中。
 */

const fs = require('fs');
const mkdirp = require('mkdirp');
const execSync = require('child_process').execSync;

function getAntdComponentToMods() {
  const result = [];
  const prefixPath = `./node_modules/antd/lib/`;
  const exclude = ['_util', 'style', 'version'];

  fs.readdirSync(prefixPath).forEach(name => {
    const stat = fs.statSync(prefixPath + name);

    if(stat.isFile()) {
      return;
    }

    if(~exclude.indexOf(name)) {
      return;
    }

    const moduleName = name.charAt(0).toUpperCase() +
      name.slice(1).replace(/-(\w)/g, (m, n) => {
        return n.toUpperCase();
      });

    result.push({name, moduleName});
  });

  return result;
}

function cloneNormal(data) {
  const name = data.name;
  const moduleName = data.moduleName;

  const scriptText = `import {${moduleName}} from 'antd';
export default ${moduleName};`;

  const path = `./src/${name}`;

  mkdirp.sync(path);
  fs.writeFileSync(`${path}/index.js`, scriptText);

  const lessTargetPath = `node_modules/antd/lib/${name}/style/index.less`;
  const existsLessFile = fs.existsSync(lessTargetPath);
  mkdirp.sync(`${path}/style`);
  if(existsLessFile) {
    const lessText = `@import '../../../${lessTargetPath}';`;
    fs.writeFileSync(`${path}/style/index.less`, lessText);
  }
  // 构建 style/index.js ，用于支持 babel-plugin-import 的配置。
  fs.writeFileSync(`${path}/style/index.js`, `import '../../../node_modules/antd/lib/${name}/style/index.js';`);

  fs.writeFileSync(`${path}/README.md`, `component [${moduleName}](https://ant.design/components/${name}) from [Antd](https://ant.design)`);
}

function cloneEntry(list) {
  const entryText = [
    `export * from '../node_modules/antd/lib/index';`,
    `export default '../node_modules/antd/lib/index';`
  ];

  // list.forEach((data) => {
  //   const name = data.name;
  //   const moduleName = data.moduleName;
  //
  //   entryText.push(`export {default as ${moduleName}} from './${name}';`);
  // });

  entryText.push(`export {default as Version} from './version'`);

  fs.writeFileSync('src/index.js', entryText.join('\n'));
}

function cloneComponents() {
  const mods = getAntdComponentToMods();
  mods.forEach(cloneNormal);

  cloneEntry(mods);
}

function cloneStyleEntry() {
  const lessText = `@import '../node_modules/antd/lib/style/index.less';
@import '../node_modules/antd/lib/style/components.less';`;

  fs.writeFileSync('src/index.less', lessText);
}

function cloneThemeEntry() {
  const themes = ['default', 'green', 'blue'];

  mkdirp.sync('src/style/themes');

  themes.forEach(theme => {
    const lessText = `
@import './themes/${theme}.less';
@import '../../node_modules/antd/lib/style/core/index.less';
@import '../../node_modules/antd/lib/style/components.less';
`;

    fs.writeFileSync(`src/style/themes/${theme}.less`, '');
    fs.writeFileSync(`src/style/${theme}.less`, lessText);
  });
}

// clean all src files
// execSync('rm -rf src');

// create component base antd
cloneComponents();
// create style entry
cloneStyleEntry();

// create theme dir
// cloneThemeEntry();
