const fs = require("fs");
const https = require("https");
var schedule = require('node-schedule');

function download(i, callback) {
    //模拟发送http请求
    var request = require("request");
    //get请求
    request(`https://bing.com/HPImageArchive.aspx?format=js&idx=${i}&n=1`, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            let res = JSON.parse(body);
            let url;
            let copyright;
            res.images.forEach(item => {
                url = 'https://bing.com' + item.url;
                copyright = item.copyright;
            });
            callback(url, copyright);
        }
    });
}

var j = schedule.scheduleJob({ hour: 17, minute: 54, second: 50, dayOfWeek: 4 }, function() {
    console.log('每周四执行一次,拉取图片');
    runGetImg();
});

function runGetImg() {
    for (let i = 0; i <= 10; i++) {
        download(i, function(imgSrc, copyright) {
            if (imgSrc) {
                https.get(imgSrc, function(res) {
                    let imgData = "";
                    res.setEncoding("binary");
                    res.on("data", function(chunk) {
                        imgData += chunk;
                    });
                    res.on("end", function() {
                        let format = '';
                        if (imgSrc.search("jpg") != -1) {
                            format = 'jpg'
                        } else if (imgSrc.search("png") != -1) {
                            format = 'png'
                        } else if (imgSrc.search("jpeg") != -1) {
                            format = 'jpeg'
                        }
                        copyright = copyright.split('，')[0]
                        let imgPath = `${copyright}.${format}`;
                        let fireUrl = "c:/Users/yiduo/Pictures/" + imgPath
                        fs.writeFile(fireUrl, imgData, "binary", function(err) {
                            console.log('下载成功---');
                        })
                    })
                })
            }
        })
    }
}

runGetImg()