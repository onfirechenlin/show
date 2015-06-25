using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data.SqlClient;

public partial class admin_footer : System.Web.UI.UserControl
{
    Funs df = new Funs();
    SqlConnection conn;
    dbConn dbc = new dbConn();
    string sqls = "";

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            bind();
        }
    }

    private void bind()
    {
        //station_name.InnerText = df.getstation_name() + " " + df.getVersion();
    }
}