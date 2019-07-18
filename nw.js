let Service = require('node-windows').Service;
let svc = new Service({
    name: 'nodeGetBingyingImg',                //服务名称
    description: '下载bing图片',        //服务描述
    script: './index.js',                //启动的文件路径
    wait: '1',                        //程序崩溃重启时间间隔
    grow: '0.25',                    //重启等待时间的间隔 如1，第二次1.25
    maxRestarts: '40'                //60s内最大重启次数
});
//监听安装
svc.on('install', () => {
    svc.start();
    console.log('服务已开启')
});
//卸载
svc.on('uninstall', () => {
    console.log('已卸载');
});
//只安装一次
svc.on('alreadyinstalled', () => {
})
//存在就卸载。node nw.js 安装，再运行一次就是卸载
if (svc.exists) return svc.uninstall()
svc.install();    
