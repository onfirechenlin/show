using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class admin_login : System.Web.UI.Page
{
    Funs df = new Funs();
    AES aes = new AES();
    dbConn dbc = new dbConn();
    SqlConnection conn = new dbConn().dklConnectDo();
    SqlCommand cmd;
    SqlDataReader dr;
    string sqls = "";
    int AffRow = 0;
    string uid = "";
    string level2 = "";

    protected void Page_Load(object sender, EventArgs e)
    {
        uid = df.GetUid();
        if (!IsPostBack)
        {
            if (df.xlength(uid) > 0)
            {
                sqls = "select level2 from member where status='激活' and uid=" + uid;
                level2 = dbc.Execuse_onlyone(sqls);
                df.WriteLog(level2);
                if (level2 == "A")
                {

                    HttpContext.Current.Response.Redirect("/dp_cms/dpapply-list.aspx");
                }

                Page.Title = "管理登录 - " +df.getstation_name();
            }

            station_name.Text = df.getstation_name();
            foot_station_name.Text = df.getstation_name();
        }
    }
    protected void Submit_Click(object sender, EventArgs e)
    {
        string uid = "";
        string signup_name = Request["signup_name"].Trim();
        string signup_pwd = Request["signup_pwd"].Trim();
        string CheckCode = Request["CheckCode"].Trim();

        if (df.xlength(signup_name) <= 0)
        {
            df.msgbox("警告：管理账号不能为空！", "back", "");
            return;
        }

        if (df.xlength(signup_pwd) <= 0)
        {
            df.msgbox("警告：管理密码不能为空！", "back", "");
            return;
        }

        if (Session["CheckCode"] == null)
        {
            df.msgbox("验证码输入有误！请检查.", "back", "");
            return;
        }

        if (CheckCode.ToLower() != Session["CheckCode"].ToString().ToLower())
        {
            df.msgbox("验证码输入有误！请检查.", "back", "");
            return;
        }

        sqls = "select uid from member where truename='" + signup_name + "' and status='激活'";

        if (dbc.Execuse_iCount(sqls) <= 0)
        {
            df.msgbox("用户名或密码错误！", "back", "");
            return;
        }

        signup_pwd = FormsAuthentication.HashPasswordForStoringInConfigFile(signup_pwd, "MD5");
        sqls = "select uid from member where truename ='" + signup_name + "' and password = '" + signup_pwd + "' and status='激活'";
        uid = dbc.Execuse_onlyone(sqls);


        if (df.xlength(uid) > 0)
        {
            df.setcookie("EF586FA914C811BF3EF586FA914C81BB56929646A", aes.EncryptAES(uid, df.GetAESKey()) + df.GetAttach(), 0);
            HttpContext.Current.Response.Redirect("/dp_cms/index.aspx");
        }
        else
        {
            df.msgbox("用户名或密码错误！", "back", "");
            return;
        }
    }
}