using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;
using System.Web.Security;

public partial class admin_rpwd_edit : System.Web.UI.Page
{
    Funs df = new Funs();
    dbConn dbc = new dbConn();
    SqlConnection conn = new dbConn().dklConnectDo();
    SqlDataReader dr;
    string sqls = "";
    string OutHtml = "";
    string Fields_Values = "";
    int AffRows = 0;
    string sep = "";

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
            Bind();
    }

    public void Bind()
    {
        string flag = Request["flag"];
        string uid = Request["id"];

        if (flag.Length <= 0)
        {
            df.msgbox("参数错误！", "back", "");
            return;
        }
        if (flag == "2")
        {
            if (df.xlength(uid) <= 0)
            {
                df.msgbox("参数错误！", "back", "");
                return;
            }
            sqls = "select uid from member where uid=" + uid;
            if (dbc.Execuse_iCount(sqls) <= 0)
            {
                df.msgbox("数据不存在！", "back", "");
                return;
            }
            sqls = "select * from member where uid=" + uid;
            dr = df.drtable(conn, sqls);
            if (dr.Read())
            {
                username.Value = dr["wxname"].ToString();
            }
            dr.Dispose();
        }
        dbc.CloseConn(conn);
    }
    protected void add_data_command(object sender, EventArgs e)
    {
        string flag = Request["flag"];
        string wxname = Request["username"];
        string oldpwd = FormsAuthentication.HashPasswordForStoringInConfigFile(Request["oldpwd"], "MD5");
        string newpwd1 = Request["newpwd1"];
        string newpwd2 = Request["newpwd2"];
        string uid = df.GetUid();

        if (flag.Length <= 0)
        {
            df.msgbox("参数错误！", "back", "");
            return;
        }
        if (df.xlength(wxname) <= 0 || df.xlength(oldpwd) <= 0 || df.xlength(newpwd1) <= 0 || df.xlength(newpwd2) <= 0)
        {
            df.msgbox("填充数据不能为空！", "back", "");
            return;
        }

        sqls = "select password from member where uid = " + uid;
        if (dbc.Execuse_onlyone(sqls).ToString().ToLower() != oldpwd.ToLower())
        {
            df.msgbox("原始密码错误！", "back", "");
            return;
        }
        if (newpwd1.ToString() != newpwd2.ToString())
        {
            df.msgbox("两次密码输入不一致！", "back", "");
            return;
        }

        newpwd2 = FormsAuthentication.HashPasswordForStoringInConfigFile(newpwd2, "MD5");
        Response.Write(newpwd2);
        if (flag == "1")
        {
            //sqls = "select id from gray_word where kword='" + kword + "'";
            //if (dbc.Execuse_iCount(sqls) > 0)
            //{
            //    df.msgbox("该记录已经存在啦,请勿重复添加.", "back", "");
            //    return;
            //}
            //sqls = "insert into gray_word(kword) values ('" + kword + "')";
        }
        else if (flag == "2")
        {
            sqls = "update member set password='" + newpwd2 + "' where uid=" + uid;
        }
        AffRows = dbc.Execuse32(sqls, 0);
        if (AffRows > 0)
        {
            Response.Redirect("rpwd-list.aspx");
        }
        else
        {
            df.msgbox("操作失败！", "back", "");
        }
    }
}