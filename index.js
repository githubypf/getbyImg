const fs = require("fs");
const https = require("https");
var schedule = require('node-schedule');

function download(url, callback) {
    https.get(url, function (res) {
        let data = "";
        res.on("data", function (chunk) {
            data += chunk;
        });
        res.on("end", function () {
            data = JSON.parse(data)
            let copyright = data.images[0].copyright;
            let imgSrc = 'https://www.bing.com' + data.images[0].url
            copyright = copyright.trim().split(" ");
            callback(imgSrc, copyright[0])
        })
    }).on("error", function (err) {
        console.log(err)
    })
}

var j = schedule.scheduleJob({hour: 17, minute: 54,second:50, dayOfWeek: 4}, function(){
    console.log('每周四执行一次,拉取图片');
    for (let i = -1; i <= 10; i++) {
        const option = {
            hostname: 'bird.ioliu.cn',
            path: `https://bird.ioliu.cn/v1/?url=https://www.bing.com/HPImageArchive.aspx?format=js&idx=${i}&n=1`,
            headers: {
                'User-Agent': 'PostmanRuntime/7.15.2', // 必须设置
                'Cache-Control': "no-cache",
                'Host': 'bird.ioliu.cn',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip,deflate',
                'Connection': 'keep-alive',
            }
        };
        download(option, function (imgSrc, copyright) {
            if (imgSrc) {
                https.get(imgSrc, function (res) {
                    let imgData = "";
                    res.setEncoding("binary");
                    res.on("data", function (chunk) {
                        imgData += chunk;
                    });
                    res.on("end", function () {
                        let format = '';
                        if (imgSrc.search("jpg") != -1) {
                            format = 'jpg'
                        } else if (imgSrc.search("png") != -1) {
                            format = 'png'
                        } else if (imgSrc.search("jpeg") != -1) {
                            format = 'jpeg'
                        }
                        let imgPath = `/${copyright}.${format}`;
                        // C:\Users\嘲风\Pictures __dirname + "/imgs"
                        fs.writeFile("C:/Users/嘲风/Pictures" + imgPath, imgData, "binary", function (err) {
                            console.log('下载成功---');
                        })
                    })
                })
            }
        })
    }
    
    
  });


