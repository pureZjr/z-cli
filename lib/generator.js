const Metalsmith = require('metalsmith') // https://www.npmjs.com/package/metalsmith
const Handlebars = require('handlebars') // https://www.npmjs.com/package/handlebars
const rm = require('rimraf').sync // https://www.npmjs.com/package/rimraf

module.exports = function(metadata = {}, src = '.download-tmp', dest = '.') {
    if (!src) {
        return Promise.reject(new Error(`无效的source：${src}`))
    }

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
                const meta = metalsmith.metadata()
                Object.keys(files).forEach(fileName => {
                    const t = files[fileName].contents.toString()
                    files[fileName].contents = new Buffer.from(Handlebars.compile(t)(meta))
                })
                done()
            })
            .build(err => {
                rm(src)
                err ? reject(err) : resolve('创建成功')
            })
    })
}
