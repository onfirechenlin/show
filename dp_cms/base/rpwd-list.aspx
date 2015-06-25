<%@ Page Language="C#" AutoEventWireup="true" CodeFile="rpwd-list.aspx.cs" Inherits="admin_rpwd_list" %>
<%@ Register TagPrefix="bar" TagName="bar" Src="../bar.ascx" %>
<%@ Register TagPrefix="header" TagName="header" Src="../header.ascx" %>
<%@ Register TagPrefix="footer" TagName="footer" Src="../footer.ascx" %>
<%@ Register TagPrefix="css" TagName="css" Src="../css.ascx" %>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>修改密码</title>
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
				<li class="active">管理账户</li>
			</ol>
		
			<form id="form1" runat="server">
				<!-- 按钮 -->
				<section class="row">
					<div class="col-md-9">
						<div class="bs-example Encircle">
							<a data-inset='reload'>刷新</a>
						</div>
					</div>
					<div class="col-md-3">
						<div class="input-group">
							<input type="text" id="ser_word" name="ser_word" class="form-control" placeholder="请输入管理名..." runat="server" />
							<div class="input-group-btn">
								<asp:Button ID="Button1" type="button" runat="server" class="btn btn-primary" Text="搜索" tabindex="-1" OnClick="Serach_Click"/>
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
                            <a onclick="list_handle('激活','成员')">激活</a>
                            <a onclick="list_handle('冻结','成员')">冻结</a>
						</div>
						<div class="col-md-8 text-right">
							<ul id="pagenav" runat="server"></ul>
						</div>
					</div>
				</section>
			</form>
		</article>
	</div>
	<footer:footer runat="server" ID="footer1" />
</body>
</html>