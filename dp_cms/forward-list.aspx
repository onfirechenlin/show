<%@ Page Language="C#" AutoEventWireup="true" CodeFile="forward-list.aspx.cs" Inherits="admin_forward_list" %>
<%@ Register TagPrefix="bar" TagName="bar" Src="bar.ascx" %>
<%@ Register TagPrefix="header" TagName="header" Src="header.ascx" %>
<%@ Register TagPrefix="footer" TagName="footer" Src="footer.ascx" %>
<%@ Register TagPrefix="css" TagName="css" Src="css.ascx" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>消息日志</title>
    <css:css runat="server" ID="css1" />
</head>
<body class="admin-page">
    <header:header runat="server" ID="header1" />
    <div class="page-container clearfix">
        <bar:bar runat="server" ID="bar1" />

        <article>
            <!-- 面包屑导航 -->
            <ol class="breadcrumb">
                <li class="active">消息日志</li>
            </ol>
            <form id="form1" method="get">
                <!-- 按钮 -->
                <section class="row">
                    <div class="col-md-8">
                        <div class="bs-example Encircle">
                            <a class="hide">增加</a>
                            <a class="hide">取消</a>
                            <a data-inset='reload'>刷新</a>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="input-group">
                            <select class="form-control" id="thing" runat="server" style="width:150px;float:left;margin:0px 20px;">
                                <option selected="selected" value="">--选择状态--</option>
                                <option value="发送消息失败">发送消息失败</option>
                                <option value="发送消息成功">发送消息成功</option>
                            </select>
                            <input type="text" id="skeyword" name="skeyword" style="width:191px;float:left;" class="form-control" placeholder="请输入昵称或姓名..." runat="server" />
                            <div class="input-group-btn">
                                <input type="submit" class="btn btn-primary" value="搜索" />
                               <%-- <asp:Button ID="Button1" runat="server" CssClass="btn btn-primary" Text="搜索" tabindex="-1" OnClick="Serach_Click"/>--%>
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
                            <div class="checkbox hide">
                                <label class="mr-xs">
                                    <input id="allcbox" onclick="allcboxb()" type="checkbox" /> 全选
                                </label>
                            </div>
                            <a class="hide" onclick="list_handle('删除','成员')">删除</a>
                            <a class="hide" onclick="list_handle('激活','成员')">激活</a>
                            <a class="hide" onclick="list_handle('冻结','成员')">冻结</a>
                        </div>
                        <div class="col-md-8 text-right">
                            <ul id="pagenav" runat="server"></ul>
                            <span id="counting" runat="server"></span>
                        </div>
                    </div>
                </section>
            </form>
        </article>
    </div>
    <div id="plugin"></div>
    <footer:footer runat="server" ID="footer1" />
</body>
</html>
