const path = require('path')
const download = require('download-git-repo') // https://www.npmjs.com/package/download-git-repo
const ora = require('ora')

module.exports = function(target) {
    target = path.join(target || '.', '.download-tmp')
    return new Promise((resolve, reject) => {
        const url = 'direct:git@github.com:pureZjr/z-tpl.git#master'
        const spinner = ora(`正在下载项目模板，源地址：${url}`)
        spinner.start()
        // 这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
        download(url, target, { clone: true }, err => {
            if (err) {
                spinner.fail()
                reject(err)
            } else {
                // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
                spinner.succeed()
                resolve(target)
            }
        })
    })
}
