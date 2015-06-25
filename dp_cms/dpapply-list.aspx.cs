using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class dp_cms_dpapply_list : System.Web.UI.Page
{
    Funs df = new Funs();
    Fans fans = new Fans();   //粉丝类
    dbConn dbc = new dbConn();
    SqlConnection conn = new dbConn().dklConnectDo();
    SqlDataReader dr;
    StringJoiner OutHtml = "";
    string fields = "";

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
            string skeyword = HttpUtility.UrlDecode(Request.Form["skeyword"]);//搜索

            //分页设置开始
            page_nav PN = new page_nav();
            string pageindex = "";
            pageindex = Request["pageindex"];
            PN.pageindex = df.SetIndex(pageindex);
            PN.pagesize = 100;  //每页记录数,若为-1则默认是20,否则须设为正整数
            PN.condition = " and status<>'删除'"; //查询条件,无则留空
            //分页设置结束

            if (df.xlength(skeyword) > 0)
            {
                PN.condition = " and name like '%" + skeyword + "%'"; //搜索条件查询,无则留空
            }

            fields = "id,name,mobi,addr,category,status,add_date,calls,recharge,send_msg";
            dr = df.drcollect("dp_message", fields, "id desc", "1=1 " + PN.condition, PN.SetPageSize(), PN.SetPageIndex(), out PN.totalrecord);

            fields = "";

            OutHtml += "<table class='table' style='table-layout:fixed;'>";
            OutHtml += "    <thead class='table-header bg-primary'>";
            OutHtml += "        <tr>";
            OutHtml += "            <th style='width:4%;'>选择</th>";
            OutHtml += "            <th style='width:10%;'>姓名</th>";
            OutHtml += "            <th style='width:10%;'>手机</th>";
            OutHtml += "            <th style='width:20%;'>地址</th>";
            OutHtml += "            <th style='width:8%;'>话费</th>";
            OutHtml += "            <th style='width:8%;'>分类</th>";
            OutHtml += "            <th style='width:10%;'>加入日期</th>";
            OutHtml += "            <th style='width:6%;'>状态</th>";
            OutHtml += "            <th style='width:10%;'>充值状态</th>";
            OutHtml += "            <th style='width:10%;'>短信状态</th>";
            OutHtml += "        </tr>";
            OutHtml += "    </thead>";
            OutHtml += "    <tbody>";
            while (dr.Read())
            {

                fans.add_date = dr["add_date"].ToString();
                fans.mobi = dr["mobi"].ToString();
                fans.truename = dr["name"].ToString();
                fans.addr = dr["addr"].ToString();
                fans.calls = dr["calls"].ToString();
                fans.id = dr["id"].ToString();
                fans.status = dr["status"].ToString();
                fans.category = dr["category"].ToString();

                OutHtml += "    <tr>";
                OutHtml += "        <td><input type='checkbox' name='checkbox' value='" + fans.id + "' /></td>";
                OutHtml += "        <td>" + fans.truename + "</td>";
                OutHtml += "        <td>" + fans.mobi + "</td>";
                OutHtml += "        <td>" + fans.addr + "</td>";
                OutHtml += "        <td>" + fans.calls + "</td>";
                OutHtml += "        <td>" + fans.category + "</td>";
                OutHtml += "        <td>" + fans.add_date + "</td>";
                OutHtml += "        <td>" + fans.status + "</td>";
                OutHtml += "        <td>" + dr["recharge"].ToString()+ "</td>";
                OutHtml += "        <td>" + dr["send_msg"].ToString() + "</td>";
                OutHtml += "    </tr>";
            }
            OutHtml += "    </tbody>";
            OutHtml += "</table>";
            c_list.InnerHtml = OutHtml;
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
    protected void Serach_Click(object sender, EventArgs e)
    {
        Bind();
    }
    protected void btnex_Click(object sender, EventArgs e)
    {
        string Title = "美丽大鹏报名名单";
        df.CoursetoExcel1(Context, Title);
    }
}