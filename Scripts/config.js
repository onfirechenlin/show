

var lightApp = "揭秘→当文化创意遇见山海大鹏";

//公众号APPID
var appid = "wx5c513fe4b06ae866";
//时间戳
var timeStamp = "1420774989";
//生成签名的随机串
var nonceStr = "2nDgiWM7gCxhL8v0";


//分享标题
var title = "揭秘→当文化创意遇见山海大鹏";
//描述
var desc = "旧厂房里生长着国际艺术街区，老工业区变身欧陆风情婚纱摄影基地……当文化创意遇见山海大鹏，当传统文化与创意艺术碰撞，想象无限，空间无极限，就差你的参与！";
//点击后要跳转的页面
var link = "http://beautiful-dp3.linjunihao.com/index.aspx";
//分享显示的图片
var imgUrl = "http://7xj65w.com2.z0.glb.qiniucdn.com/sharewb.png";

wx.config({
    debug: false,
    appId: appid,
    timestamp: timeStamp,
    nonceStr: nonceStr,
    signature: $("#signature").val(),
    jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
    ]
});

wx.ready(function () {
    var shareData = {
        title: title,
        desc: desc,
        link: link,
        imgUrl: imgUrl
    };
    wx.onMenuShareAppMessage(shareData);
    wx.onMenuShareTimeline(shareData);
});

wx.error(function (res) {

});



