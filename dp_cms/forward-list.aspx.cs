using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class admin_forward_list : System.Web.UI.Page
{
    Funs df = new Funs();
    dbConn dbc = new dbConn();
    SqlConnection conn = new dbConn().dklConnectDo();
    SqlDataReader dr;
    StringJoiner OutHtml = "";
    StringJoiner fields = "";
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            Bind();
        } 
    }
    public void Bind()
    {
        try
        {
            string skeyword = Request["skeyword"];//搜索
            string thing = Request["thing"]; //搜索

            //分页设置开始
            page_nav PN = new page_nav();
            string pageindex = "";
            pageindex = Request["pageindex"];
            PN.pageindex = df.SetIndex(pageindex);
            PN.pagesize = -1;  //每页记录数,若为-1则默认是20,否则须设为正整数
            PN.condition = " and thing like '%'+'发送消息'+'%'"; //查询条件,无则留空
            //分页设置结束

            if (df.xlength(skeyword) > 0)
            {
                PN.condition += " and ((select top 1 name from apply_mate where openid=log.openid) like '%" + skeyword + "%' or (select top 1 wxname from member where openid=log.openid) like '%" + skeyword + "%' )"; //搜索条件查询,无则留空
            }
            if (df.xlength(thing) > 0)
            {
                PN.condition += " and thing='" + thing + "'"; 
            }

            fields = " id,thing,datetime,(select top 1 wxname from member where openid=log.openid) as wxname,";
            fields += " (select top 1 wxicon64 from member where openid=log.openid) as wxicon64,";
            fields += " (select top 1 wxicon from member where openid=log.openid) as wxicon,";
            fields += " (select mobi from apply_mate where openid=log.openid) as mobi,";
            fields += " (select name from apply_mate where openid=log.openid) as name";

            dr = df.drcollect("log", fields, "datetime desc", "1=1 " + PN.condition, PN.SetPageSize(), PN.SetPageIndex(), out PN.totalrecord);
            
            OutHtml += "<table class='table' style='table-layout:fixed;'>";
            OutHtml += "    <thead class='table-header bg-primary'>";
            OutHtml += "        <tr>";
            OutHtml += "            <th class='hide' style='width:4%;'>选择</th>";
            OutHtml += "            <th style='width:20%;'>昵称</th>";
            OutHtml += "            <th style='width:20%;'>姓名</th>";
            OutHtml += "            <th style='width:20%;'>电话</th>";
            OutHtml += "            <th style='width:20%;'>发送日志</th>";
            OutHtml += "            <th style='width:20%;'>发送日期</th>";
            OutHtml += "        </tr>";
            OutHtml += "    </thead>";
            OutHtml += "    <tbody>";
            while (dr.Read())
            {
                OutHtml += "    <tr>";
                OutHtml += "        <td class='hide'><input type='checkbox' name='checkbox' value='" + dr["id"].ToString()+ "' /></td>";
                OutHtml += "        <td><a onclick='showicon(this)' data-src='/GetIcon.ashx?url=" + dr["wxicon"].ToString() + "'><img src='/GetIcon.ashx?url=" + dr["wxicon64"].ToString() + "' class='icon16X16'></a>" + dr["wxname"].ToString() + "</td>";
                OutHtml += "        <td>" + dr["name"].ToString() + "</td>";
                OutHtml += "        <td>" + dr["mobi"].ToString() + "</td>";
                OutHtml += "        <td>" + dr["thing"].ToString() + "</td>";
                OutHtml += "        <td>" + df.CountDate(dr["datetime"].ToString()) + "</td>";
                OutHtml += "    </tr>";
            }
            OutHtml += "    </tbody>";
            OutHtml += "</table>";
            c_list.InnerHtml = OutHtml;
            OutHtml = "";
            pagenav.InnerHtml = PN.showPageNav();   //设置分页导航
            counting.InnerHtml = df.record_icon() + PN.totalrecord;
            dr.Dispose();
            dbc.CloseConn(conn);
        }
        finally
        {
            dbc.CloseConn(conn);
        }
    }
    //protected void Serach_Click(object sender, EventArgs e)
    //{
    //    Bind();
    //}
}