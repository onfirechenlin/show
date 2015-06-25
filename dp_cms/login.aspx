<%@ Page Language="C#" AutoEventWireup="true" CodeFile="login.aspx.cs" Inherits="admin_login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>管理登录</title>
    <link href="/Content1/bootstrap.css" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="/Content1/register.css" />
    <link href="/Content1/style-admin.css" rel="stylesheet" />
    <link rel="stylesheet" href="/Content/custom.css" />
    <link href="/Content1/jquery-impromptu.css" rel="stylesheet" />
</head>

<body>
    <div class='signup_container'>
        <h1 class='signup_title'><asp:Literal ID="station_name" runat="server" />美丽大鹏管理登录</h1>
        <%--<img src='/images/xiaoqing2.png' id='admin' />--%>
        <div id="signup_forms" class="signup_forms clearfix">
            <div class="form_row first_row">
                <label for="signup_name">账号</label><!--<div class='tip ok'></div>-->
                <input type="text" id="signup_name" name="signup_name" autocomplete="off" maxlength="20" placeholder="账号" value="" data-required="required" />
            </div>
            <div class="form_row">
                <label for="signup_pwd">密码</label><!--<div class='tip error'></div>-->
                <input type="password" id="signup_pwd" autocomplete="off" name="signup_pwd" maxlength="20" placeholder="密码" value="" data-required="required" />
            </div>
            <div class="form_row">
                <label for="CheckCode">验证码</label><!--<div class='tip error'></div>-->
                <input type="text" id="CheckCode" style="float: left; width: 154px;" name="CheckCode" autocomplete="off" maxlength="4" placeholder="请输入验证码" data-required="required" />
            </div>
            <img src="/dp_cms/ValidateCode.aspx?ValidateCodeType=0&0.011150883024061309" onclick="this.src='/dp_cms/ValidateCode.aspx?ValidateCodeType=0&'+Math.random();" id="imgValidateCode" alt="点击刷新验证码" title="看不清？请点击" style="cursor: pointer;" />
        </div>


        <div class="login-btn-set">
            <div class='rem'>记住我</div>
            <a class="btn btn-info" onclick="login(this)" id="login-btn" style="width: 155px;">登录<span id="loading"></span></a>
        </div>
        <p class='copyright'><asp:Literal ID="foot_station_name" runat="server" /> 使用<a target="_blank" href="http://w.x.baidu.com/alading/anquan_soft_down_b/14744">谷歌浏览器</a>会达到最佳显示效果</p>
    </div>
    <div id="plugin"></div>


    <script type="text/javascript" src="/Scripts1/jquery.1.10.2.min.js"></script>
    <script type="text/javascript" src="/Scripts1/bootstrap.min.js"></script>
    <script type="text/javascript" src="/Scripts1/jquery.cookie.js"></script>
    <script type="text/javascript" src="/Scripts1/common.js"></script>
    <script type="text/javascript" src="/Scripts1/function.js"></script>
    <script type="text/javascript" src="/Scripts1/custom.js"></script>
    <script type="text/javascript" src="/Scripts1/jquery.tipsy.js"></script>
    <script src="/Scripts1/jquery-impromptu.js"></script>
    <script type="text/javascript">
        $(function () {
            $('.rem').click(function () {
                $(this).toggleClass('selected');
            })

            $('#signup_select').click(function () {
                $('.form_row ul').show();
                event.cancelBubble = true;
            })

            $('#d').click(function () {
                $('.form_row ul').toggle();
                event.cancelBubble = true;
            })

            $('body').click(function () {
                $('.form_row ul').hide();
            })

            $('.form_row li').click(function () {
                var v = $(this).text();
                $('#signup_select').val(v);
                $('.form_row ul').hide();
            })
        })
    </script>
</body>
</html>
