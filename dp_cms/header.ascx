<%@ Control Language="C#" AutoEventWireup="true" CodeFile="header.ascx.cs" Inherits="admin_header" %>
<div class="navbar navbar-inverse navbar-youth navbar-fixed-top" role="navigation">
    <div class="content-wp">
    <div class="navbar-header">
        <div style="font-size:27px;margin-top:5px;color:white">美丽大鹏</div>
        <%--<img src="/images/img/logo.png" class="navbar-logo" />--%>
    </div>
    <div class="collapse navbar-collapse ">
    	<ul class="nav navbar-nav navbar-right">
    		<li><a><span class="glyphicon glyphicon-user"></span><asp:Literal ID="Admin" runat="server"></asp:Literal></a></li>
    		<li><a href="/dp_cms/logout.aspx"><span class="glyphicon glyphicon-off"></span>退出</a></li>
    	</ul>
    </div>
    
    <!--/.navbar-collapse --> 
    </div>
</div>
<div class="clearfix"></div>