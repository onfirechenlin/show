using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;


public partial class admin_logout : System.Web.UI.Page
{
    Funs df = new Funs();

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
            bind();
    }

    public void bind()
    {
        df.delcookie("EF586FA914C811BF3EF586FA914C81BB56929646A");
        df.WriteLog(df.getcookie("EF586FA914C811BF3EF586FA914C81BB56929646A"));
        HttpContext.Current.Response.Redirect("/dp_cms");
    }
}