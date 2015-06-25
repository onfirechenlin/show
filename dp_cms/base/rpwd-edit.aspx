<%@ Page Language="C#" AutoEventWireup="true" CodeFile="rpwd-edit.aspx.cs" Inherits="admin_rpwd_edit" %>
<%@ Register TagPrefix="bar" TagName="bar" Src="../bar.ascx" %>
<%@ Register TagPrefix="header" TagName="header" Src="../header.ascx" %>
<%@ Register TagPrefix="footer" TagName="footer" Src="../footer.ascx" %>
<%@ Register TagPrefix="css" TagName="css" Src="../css.ascx" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>管理账户</title>
    <css:css runat="server" ID="css1" />
</head>

<body class="admin-page">
    <header:header runat="server" ID="header1" />
    <div class="page-container clearfix">
        <bar:bar runat="server" ID="bar1" />

        <article>
            <!-- 内容标题 -->
            <h4>管理账户</h4>
            <!-- 面包屑导航 -->
            <ol class="breadcrumb">
                <li><a href="manage.aspx">首页</a></li>
                <li class="active">管理账户编辑</li>
            </ol>
            
            <!-- 按钮 -->
            <section class="row">
                <div class="col-md-9">
                    <div class="bs-example Encircle">
                        <a href="rpwd-list.aspx">返回</a>
                        <a data-inset='reload'>刷新</a>
                    </div>
                </div>
            </section>

            <!-- 表格 -->
            <section>
                <form id="form1" class="form-horizontal" runat="server">
                    <div class="form-group">
                        <label for="oldpwd">账户名：</label>
                        <div>
                            <input type="text" id="username" name="username" readonly="true" runat="server" placeholder="输入账户名..." />
                        </div>
                        <span></span>
                    </div>
                    <div class="form-group">
                        <label for="oldpwd">原始密码：</label>
                        <div>
                            <input type="password" id="oldpwd" name="oldpwd" runat="server" maxlength="20" data-mandatory="true" placeholder="输入原始密码..." />
                        </div>
                        <span>必填项</span>
                    </div>
                    <div class="form-group">
                        <label for="newpwd1">新密码：</label>
                        <div>
                            <input type="password" id="newpwd1" name="newpwd1" runat="server" maxlength="20" data-mandatory="true" placeholder="输入新密码..." />
                        </div>
                        <span>必填项</span>
                    </div>
                    <div class="form-group">
                        <label for="newpwd2">确认新密码：</label>
                        <div>
                            <input type="password" id="newpwd2" name="newpwd2" runat="server" maxlength="20" data-mandatory="true" placeholder="确认新密码..." />
                        </div>
                        <span>必填项</span>
                    </div>
                    <div class="form-group">
                        <div>
                            <asp:Button ID="Button1" class="btn btn-success" runat="server" Text="确定" OnClick="add_data_command" />
                        </div>
                    </div>
                </form>
            </section>
        </article>
    </div>
    <footer:footer runat="server" ID="footer1" />
</body>
</html>

