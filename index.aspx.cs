using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class index : System.Web.UI.Page
{
    dbConn dbc = new dbConn();
    string sqls = "";
    public string sky = "";
    public string water = "";
    public string rain = "";

    protected void Page_Load(object sender, EventArgs e)
    {
        Context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        if (!IsPostBack)
        {
            Bind();
        }
    }
    public void Bind()
    {
        Context.Response.Cache.SetCacheability(HttpCacheability.NoCache);
        JS_JDK jdk = new JS_JDK();
        string rqsurl = HttpContext.Current.Request.Url.ToString();
        signature.Value = jdk.groupstring(rqsurl);
    }
}