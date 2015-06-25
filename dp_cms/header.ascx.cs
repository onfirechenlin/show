using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class admin_header : System.Web.UI.UserControl
{
    Funs df = new Funs();
    dbConn dbc = new dbConn();
    SqlConnection conn = new dbConn().dklConnectDo();
    SqlDataReader dr;
    string sqls = "";
    string OutHtml = "";
    string fields = "";
    string _admin = "";

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
            Bind();
    }

    public void Bind()
    {
        if (df.check_admin(df.GetUid()) == false)  //非管理员
        {
            df.msgbox("您尚未登录或登录超时,请重新登录.", "gourl", "/admin");
            return;
        }
        sqls = "select wxname from member where uid="+df.GetUid();
        _admin = dbc.Execuse_onlyone(sqls);
        if (df.xlength(_admin)>0)
            Admin.Text = _admin;
        else
        {
            //df.delcookie("EF586FA914C811BF3EF586FA914C81BB56929646A");
            //Response.Redirect("/");
        }
    }
}