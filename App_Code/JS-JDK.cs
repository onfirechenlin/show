using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Data.SqlClient;
using System.Configuration;

/// <summary>
/// JS_JDK 的摘要说明
/// </summary>
public class JS_JDK
{
    dbConn dbc = new dbConn();
    Funs df = new Funs();
    //作者:陈有法
    //日期:2014-1-11
    //功能:获得访问令牌
    public string sapi_ticket()
    {
        string htmlstr;
        string sqls = "";
        string sapi_ticket = "";
        try
        {
            sqls = "select sapi_ticket from sapi_ticket where datetime >'" + DateTime.Now + "'";
            sapi_ticket = dbc.Execuse_onlyone(sqls);
            if (df.xlength(sapi_ticket) <= 0)   //当前访问令牌已过期,需要重新获取
            {
                WebClient wc = new WebClient();
                wc.Credentials = CredentialCache.DefaultCredentials;
                Byte[] pageData = wc.DownloadData("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + df.get_access_token() + "&type=jsapi");
                htmlstr = Encoding.Default.GetString(pageData);
                sapi_ticket =  df.get_json(htmlstr, "ticket");
                sqls = "delete from sapi_ticket;insert into sapi_ticket(sapi_ticket,datetime)values('" + sapi_ticket + "','" + DateTime.Now.AddSeconds(7200) + "')";
                dbc.Execuse32(sqls, 0);
            }
            return sapi_ticket;
        }
        catch
        {
            return "";
        }
        finally
        {

        }
    }

    public string groupstring(string url)
    {
        string jsapi_ticket = sapi_ticket();
        string noncestr = "2nDgiWM7gCxhL8v0";
        string timestamp = "1420774989";
        string sSourceData = "jsapi_ticket=" + jsapi_ticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;
        return SHA1(sSourceData).ToLower();
    }

    private static string SHA1(string text)
    {
        byte[] cleanBytes = Encoding.Default.GetBytes(text);
        byte[] hashedBytes = System.Security.Cryptography.SHA1.Create().ComputeHash(cleanBytes);
        return BitConverter.ToString(hashedBytes).Replace("-", "");
    }
}