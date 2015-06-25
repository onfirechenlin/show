<%@ Page Language="C#" AutoEventWireup="true" CodeFile="winning.aspx.cs" Inherits="winning" %>

<!DOCTYPE html>

<html lang="zh-cn" class="no-js">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="Content-Type">
    <meta content="text/html; charset=utf-8">
    <meta charset="utf-8">
    <title>揭秘→当文化创意遇见山海大鹏</title>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <script type="text/javascript" src="Scripts/zepto.min.js"></script>
</head>
<body onclick="delayLoadPic();">
   <div id="mcover" onclick="close_guide();" style="display: none;">
        <img src="/images/share.png" />
    </div>
    <div id="page-hd">
        <div id="music" style="visibility: visible;">
            <div class="music play"></div>
            <span>开启</span>
            <div class="musics"></div>
            <audio src="http://7xj65w.com2.z0.glb.qiniucdn.com/bg.mp3?id=2" loop="" autoplay id="bgmusic"></audio>
        </div>
    </div>
       <div  >
        <div class="page page-win page-current" data-index="1">
            <img class="fadeInUp animated wp1_1" src="http://7xj65w.com2.z0.glb.qiniucdn.com/luck_13.png" />
            <img  onclick="guide()" class="fadeInUp animated wp1_2" src="http://7xj65w.com2.z0.glb.qiniucdn.com/luck_2.png" />
            <a href="index.aspx"><img class="fadeInUp animated wp1_3" src="http://7xj65w.com2.z0.glb.qiniucdn.com/rtfrist.png" /></a>  
        </div>
    </div>
    <div  class="<%=Request["num"]=="0"?"":"hide" %>">
        <div class="page page-win page-current" data-index="1">
            <img class="fadeInUp animated wp1_1" src="http://7xj65w.com2.z0.glb.qiniucdn.com/luck_13.png" />
            <img  onclick="guide()" class="fadeInUp animated wp1_2" src="http://7xj65w.com2.z0.glb.qiniucdn.com/luck_2.png" />
            <a href="index.aspx"><img class="fadeInUp animated wp1_3" src="http://7xj65w.com2.z0.glb.qiniucdn.com/rtfrist.png" /></a>  
        </div>
    </div>
        <div class="<%=Request["num"]=="1"?"":"hide" %>">
        <div class="page page-win page-current" data-index="1">
            <img class="fadeInUp animated wp2_1" src="http://7xj65w.com2.z0.glb.qiniucdn.com/luck_11.png" />
            <img onclick="guide()" class="fadeInUp animated wp2_2" src="http://7xj65w.com2.z0.glb.qiniucdn.com/luck_2.png" />
            <a href="index.aspx"><img class="fadeInUp animated wp2_3" src="http://7xj65w.com2.z0.glb.qiniucdn.com/rtfrist.png" /></a>  
        </div>
    </div>
       <div class="<%=Request["num"]=="5"?"":"hide" %>">
        <div class="page page-win page-current" data-index="1">
            <img class="fadeInUp animated wp3_1" src="http://7xj65w.com2.z0.glb.qiniucdn.com/luck_12.png" />
            <img  onclick="guide()" class="fadeInUp animated wp3_2" src="http://7xj65w.com2.z0.glb.qiniucdn.com/luck_2.png" />
            <a href="index.aspx"><img class="fadeInUp animated wp3_3" src="http://7xj65w.com2.z0.glb.qiniucdn.com/rtfrist.png" /></a>  
        </div>
    </div>
    <input id="signature" type="text" runat="server" style="display: none;" />
    <div id="share-wx">
        <p>
            <img src="http://7xj307.com2.z0.glb.qiniucdn.com/share.png" id="share-wx-img">
        </p>
    </div>
    <section id="copyright-box">
        <div id="copyright-box-content">
            <div id="power_div">
                <div style="padding:20px;">
                    <p style="margin: 10px 0px 20px 0px;">
                        <span style="margin-left: 10px;"><b><span style="color:red">政能量</span></b>专注政务游戏系列及政务新媒体运营</span><br><br>
                        <span style="margin-left: 10px;"><span>0755-29346636 / 137 1358 6591 </span></span>
                        <br><br>
                        <a title="在线咨询" target="_blank" href="http://wpa.qq.com/msgrd?v=3&amp;uin=314170772&amp;site=qq&amp;menu=yes">
                            <img style="margin: 0px 5px 0px 10px;" border="0" src="http://wpa.qq.com/pa?p=2:314170772:52" alt="陆经理"><span style="color: #468847;">陆经理</span>
                        </a>
                    </p>
                </div>
                <div id="close_copyright" style="background:#f6f6f6;height:40px;line-height:40px;text-align:center;cursor:pointer;">
                    关闭
                </div>        
            </div> 
        </div>
    </section>

</body>
</html>

<link rel="stylesheet" type="text/css" href="Content/PageLoading.css">
<link rel="stylesheet" type="text/css" href="Content/animations.css">
<link rel="stylesheet" type="text/css" href="Content/page.css">
<link rel="stylesheet" type="text/css" href="Content/custom.css?id=3">
<link rel="stylesheet" type="text/css" href="Content/animate.min.css">
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script type="text/javascript" src="Scripts/config.js"></script>
<script type="text/javascript" src="Scripts/load_js.js"></script>
<script>
    function guide() {
        $("#share-wx").css({
            "position": "absolute",
            "display": "block",
            "z-index": "1"
        });
    }

</script>