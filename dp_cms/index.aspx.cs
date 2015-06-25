using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class admin_index : System.Web.UI.Page
{
    Funs df = new Funs();
    dbConn dbc = new dbConn();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            bind();
        }
    }

    private void bind()
    {
        df.check_login();
        HttpContext.Current.Response.Redirect("/dp_cms/dpapply-list.aspx");
    }
}