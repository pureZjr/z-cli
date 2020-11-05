const Metalsmith = require("metalsmith"); // https://www.npmjs.com/package/metalsmith
const Handlebars = require("handlebars"); // https://www.npmjs.com/package/handlebars
const rm = require("rimraf").sync; // https://www.npmjs.com/package/rimraf
const fs = require("fs");
const path = require("path");

module.exports = function(metadata = {}, src = ".download-tmp", dest = ".") {
    if (!src) {
        return Promise.reject(new Error(`无效的source：${src}`));
    }
    const packagePath = path.join(process.cwd(), dest, "package.json");

    return new Promise((resolve, reject) => {
        Metalsmith(process.cwd())
            // 获取元信息
            .metadata(metadata)
            // 写入前不删除目标目录
            .clean(false)
            .source(src)
            .destination(dest)
            // 中间操作，使用handlebars进行模板解析
            .use((files, metalsmith, done) => {
                done();
            })
            .build((err) => {
                rm(src);
                if (fs.existsSync(packagePath)) {
                    const content = fs.readFileSync(packagePath).toString();
                    const template = Handlebars.compile(content);
                    const result = template(metadata);
                    fs.writeFileSync(packagePath, result);
                }
                err ? reject(err) : resolve("创建成功");
            });
    });
};