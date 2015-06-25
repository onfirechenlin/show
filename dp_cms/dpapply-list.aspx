<%@ Page Language="C#" AutoEventWireup="true" CodeFile="dpapply-list.aspx.cs" Inherits="dp_cms_dpapply_list" %>
<%@ Register TagPrefix="bar" TagName="bar" Src="bar.ascx" %>
<%@ Register TagPrefix="header" TagName="header" Src="header.ascx" %>
<%@ Register TagPrefix="footer" TagName="footer" Src="footer.ascx" %>
<%@ Register TagPrefix="css" TagName="css" Src="css.ascx" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>用户管理</title>
    <css:css runat="server" ID="css1" />
</head>
<body class="admin-page">
    <header:header runat="server" ID="header1" />
    <div class="page-container clearfix">
        <bar:bar runat="server" ID="bar1" />
        <article>
            <!-- 面包屑导航 -->
            <ol class="breadcrumb">
                <li class="active">大鹏报名列表</li>
            </ol>
            <form id="form1" runat="server">
                <!-- 按钮 -->
                <section class="row">
                    <div class="col-md-9">
                        <div class="bs-example Encircle">
                            <a class="hide">增加</a>
                            <a class="hide">取消</a>
                            <a data-inset='reload'>刷新</a>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="input-group">
                            <input type="text" id="skeyword" name="skeyword" class="form-control" placeholder="请输入姓名..." runat="server" />
                            <div class="input-group-btn">
                                <asp:Button ID="Button1" runat="server" CssClass="btn btn-primary" Text="搜索" tabindex="-1" OnClick="Serach_Click"/>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 表格 -->
                <section>
                    <input name="inputtxt" id="inputtxt" type="hidden" value="" />
                    <!--用于存放多选框勾选的值-->
                    <div id="c_list" runat="server"></div>
                    <div class="form-inline sp-solid-top row btn_box">
                        <div class="col-md-4">
                            <div class="checkbox">
                                <label class="mr-xs">
                                    <input id="allcbox" onclick="allcboxb()" type="checkbox" /> 全选
                                </label>
                            </div>
                            <a onclick="phone_charge()" class="btn btn-success btn-xs">一键充值话费<span id="loding"></span></a>
                            <a onclick="list_handle('删除','报名')">删除</a>
                            <a onclick="list_handle('激活','报名')">激活</a>
                            <a onclick="list_handle('冻结','报名')">冻结</a>
                            <asp:Button runat="server" CssClass="btn bgb-success btn-xs" ID="btnex"  Text="导出Excel" OnClick="btnex_Click"/>
                        </div>
                        <div class="col-md-8 text-right">
                            <ul id="pagenav" runat="server"></ul>
                            <span id="counting" runat="server"></span>
                        </div>
                    </div>
                </section>
                <div id="msg_write" style="display:none;">
                    <div><p>【政能量】感谢您对<span style="color:red;">变量一</span>活动的支持，<span style="color:red;">"系统生成"</span>元话费已落入您的口袋，快去看看吧。请您继续关注<span style="color:red;">变量二</span></p></div>
                    <input type="text" id="msg_value" class="form-control" style="margin-bottom:5px;display:none;" value="3116" runat="server"  />
                    <input type="text" id="vb1" class="form-control" style="margin-bottom:5px;" placeholder="变量一"  runat="server"  />
                    <input type="text" id="vb2" class="form-control" style="margin-bottom:5px;" placeholder="变量二"  runat="server"  />
                    <a onclick="recharge('rc_msg')" class="btn btn-success btn-xs">充值并发短信<span id="loding1"></span></a>
                    <a onclick="recharge('rc_msgcheck')" class="btn btn-info btn-xs">查看短信模板<span id="Span1"></span></a>
                    <a onclick="recharge('rc_msgdefault')" class="btn btn-warning btn-xs">取消</a>
                </div>
            </form>
        </article>
    </div>
    <div id="plugin"></div>
    <footer:footer runat="server"  ID="footer1" />
</body>
</html>