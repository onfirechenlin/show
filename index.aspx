<%@ Page Language="C#" AutoEventWireup="true" CodeFile="index.aspx.cs" Inherits="index" %>

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
    <script type="text/javascript" src="Scripts/PerfectLoad.js"></script>
    <script>
        $(function () {
            $.MyCommon.PageLoading({ sleep: 3000 });
        })
        var beforeload = (new Date()).getTime();
        
    </script>   
</head>
<body onclick="delayLoadPic();">
    <span id="load_time"></span>
    <div id="page-hd">
        <div id="music" style="visibility: visible;">
            <div class="music play"></div>
            <span>开启</span>
            <div class="musics"></div>
            <audio src="http://7xj65w.com2.z0.glb.qiniucdn.com/bg.mp3?id=2" loop="" autoplay id="bgmusic"></audio>
        </div>
        <img src="http://7xj65w.com2.z0.glb.qiniucdn.com/p_up.png" alt="" class="arrow-up pt-page-moveIconUp" id="hand">
    </div>
    <div id="page-content">
        <div class="page page-1 page-current" data-index="1">
        </div>
        <div class="page page-2 hide" id="page-2" data-go="1" data-index="2">
            <img class="fadeInLeft animated p2_1" src="http://7xj65w.com2.z0.glb.qiniucdn.com/p2_img1.png" />
            <img class="fadeInRight animated p2_2" src="http://7xj65w.com2.z0.glb.qiniucdn.com/p2_img2.png" />
            <img class="fadeInUp animated p2_3" src="http://7xj65w.com2.z0.glb.qiniucdn.com/p2_img3.png" />
        </div>
        <div class="page page-3 hide" data-index="3">
            <img class="fadeInUp animated p3_1" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p3_img1.png" src="none" />
            <img class="rotateIn animated p3_2" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p3_img2.png" src="none" />
        </div>
        <div class="page page-4 hide" data-index="4">
            <img class="fadeInUp animated p4_1" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p4_img1.png" src="none" />
            <img class="rollIn animated p4_2" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p4_img2.png" src="none" />
        </div>
        <div class="page page-5 hide" data-index="5">
            <img class="fadeInUp animated p5_1" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p5_img1.png" src="none" />
            <img class="zoomInLeft animated p5_2" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p5_img2.png" src="none" />
            <img class="zoomInRight animated p5_3" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p5_img3.png" src="none" />
        </div>
        <div class="page page-6 hide" data-index="6">
            <img class="fadeInUp animated p6_1" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p6_img1.png" src="none" />
            <img class="slideInLeft animated p6_2" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p6_img2.png" src="none" />
            <img class="slideInRight animated p6_3" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p6_img3.png" src="none" />
        </div>
        <div class="page page-7 hide" data-index="7">
            <img class="fadeInUp animated p7_1" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p7_img1.png" src="none" />
            <img class="bounceInLeft animated p7_2" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p7_img2.png" src="none" />
            <img class="bounceInRight animated p7_3" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p7_img3.png" src="none" />
        </div>
        <div class="page page-8 hide" data-index="8">
            <img class="fadeInUp animated p8_1" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p8_img1.png" src="none" />
            <img class="fadeInUp animated p8_2" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p8_img2.png" src="none" />
        </div>
        <div class="page page-9 hide" data-index="9">
            <img class="fadeInUp animated p9_1" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p9_img1.png" src="none" />
            <div class="form-group col-xs-12 p9_11">
                <div class="form-group p9">
                    <input type="text" class="p9_13 form-control" id="name"  placeholder="姓名:" maxlength="5" runat="server" />
                </div>
                <div class="form-group p9">
                    <input type="text" class="p9_13 form-control" id="mobi"  onkeyup='this.value=this.value.replace(/\D/gi,"")' maxlength="11" placeholder="联系方式:" runat="server" />
                </div>
                <div class="form-group p9">
                    <input type="text" class="p9_13 form-control" id="addr" placeholder="所在地：" maxlength="30" runat="server" />
                </div>
            </div>
            <img class="fadeInUp animated p9_2" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p9_img2.png" src="none" />
           <a onclick="submit_btn()" ><img class="fadeInUp animated p9_3" data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p9_img3.png" src="none" /></a>
            <img class="fadeInUp animated p9_4"  data-src="http://7xj65w.com2.z0.glb.qiniucdn.com/p9_img4.png" src="none" />
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