const path = require("path");
const download = require("download-git-repo"); // https://www.npmjs.com/package/download-git-repo
const ora = require("ora");
const Handlebars = require("handlebars");
const fs = require("fs");
const chalk = require("chalk");

module.exports = function(target, tplUrl) {
    target = path.join(target || ".", ".download-tmp");
    return new Promise((resolve, reject) => {
        try {
            const spinner = ora(`正在下载项目模板，源地址：${tplUrl}`);
            spinner.start();
            // 这里可以根据具体的模板地址设置下载的url，注意，如果是git，url后面的branch不能忽略
            download(tplUrl, target, { clone: true }, (err) => {
                if (err) {
                    spinner.fail();
                    reject(err);
                } else {
                    // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
                    spinner.succeed();
                    resolve(target);
                }
            });
        } catch (err) {
            console.log(err);
        }
    });
};