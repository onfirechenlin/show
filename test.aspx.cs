using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class test : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        XmlHandler xh = new XmlHandler();
        string xml = MapPath("jdk_cache.xml");
        string token = xh.ReadXmlReturnNode(xml, "tokenval");
        string tokendate = xh.ReadXmlReturnNode(xml, "tokendate");
        string ticket = xh.ReadXmlReturnNode(xml, "sapiticketval");
        string ticketdate = xh.ReadXmlReturnNode(xml, "sapiticketdate");
        try
        {
            if (DateTime.Now >= DateTime.Parse(tokendate))
            {
                DateTime _pasttime = DateTime.Now.AddSeconds(7200);
                xh.XmlNodeReplace(xml, "jdk/item/tokendate", _pasttime.ToString());
            }
        }
        catch
        {
            DateTime _pasttime = DateTime.Now.AddSeconds(7200);
            xh.XmlNodeReplace(xml, "jdk/item/tokendate", _pasttime.ToString());
        }
        //Response.Write(token + tokendate + ticket + ticketdate);

        //Response.Write(df);
    }
}