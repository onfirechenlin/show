using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class admin_rpwd_list : System.Web.UI.Page
{
    Funs df = new Funs();
    dbConn dbc = new dbConn();
    SqlConnection conn = new dbConn().dklConnectDo();
    SqlCommand cmd;
    SqlDataReader dr;
    string sqls = "";
    string OutHtml = "";
    string fields = "";

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
            Bind();
    }

    public void Bind()
    {
        string ser_word = Request["ser_word"];//搜索
        string title = "";

        //分页设置开始
        page_nav PN = new page_nav();
        string pageindex = "";
        pageindex = Request["pageindex"];
        if (df.xlength(Request["pageindex"]) < 0)
            PN.pageindex = 1;
        else if (df.xlength(Request["pageindex"]) > 0 && df.IsNum(Request["pageindex"]) == true)
            PN.pageindex = Convert.ToInt32(Request["pageindex"]);   //当前页码
        else
            PN.pageindex = 1;
        PN.pagesize = -1;  //每页记录数,若为-1则默认是20,否则须设为正整数
        PN.condition = " and level2='A' and status <> '删除'";
        if (df.xlength(ser_word) <= 0)
            PN.condition += ""; //查询条件,无则留空
        else
            PN.condition += "   and wxname like '%" + ser_word + "%'"; //搜索条件查询,无则留空
        //分页设置结束
        fields = "*";

        dr = df.drcollect("member", fields, "uid desc", "1=1" + PN.condition, PN.SetPageSize(), PN.SetPageIndex(), out PN.totalrecord);

        OutHtml += "<table class='table'>";
        OutHtml += "    <thead class='table-header bg-primary'>";
        OutHtml += "        <tr>";
        OutHtml += "            <th style='width:5%;'>选择</th>";
        OutHtml += "            <th style='width:5%;'>修改</th>";
        OutHtml += "            <th style='width:60%;'>管理员</th>";
        OutHtml += "            <th style='width:15%;'>状态</th>";
        OutHtml += "            <th style='width:15%;'>添加时间</th>";
        OutHtml += "        </tr>";
        OutHtml += "    </thead>";
        OutHtml += "    <tbody>";
        while (dr.Read())
        {
            OutHtml += "    <tr>";
            OutHtml += "        <td><input type='checkbox' name='checkbox' value='" + dr["uid"] + "' /></td>";
            OutHtml += "        <td><a class='glyphicon glyphicon-pencil' href='rpwd-edit.aspx?flag=2&id=" + dr["uid"] + "'></a></td>";
            OutHtml += "        <td title=" + dr["wxname"].ToString() + ">" + dr["wxname"].ToString() + "</td>";
            OutHtml += "        <td>" + dr["status"] + "</td>";
            OutHtml += "        <td class='Consolas'>" + df.CountDate(dr["add_date"].ToString()) + "</td>";
            OutHtml += "    </tr>";
        }
        if (dr.HasRows == false)
        {
            OutHtml += "    <tr>";
            OutHtml += "       <td style='width: 200px;'>当前无相关数据~</td>";
            OutHtml += "    </tr>";
        }
        OutHtml += "    </tbody>";
        OutHtml += "</table>";
        c_list.InnerHtml = OutHtml;
        pagenav.InnerHtml = PN.showPageNav();   //设置分页导航
        dr.Dispose();
        dbc.CloseConn(conn);
    }
    protected void Serach_Click(object sender, EventArgs e)
    {
        Bind();
    }
}