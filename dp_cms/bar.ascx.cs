using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class admin_bar : System.Web.UI.UserControl
{
    Funs df = new Funs();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
            bind();
    }

    private void bind()
    {
        df.check_login();
        if (df.check_admin(df.GetUid()) == false)  //非管理员
        {
            df.msgbox("您尚未登录或登录超时,请重新登录.", "gourl", "/admin/index.aspx");
            return;
        }
    }
}