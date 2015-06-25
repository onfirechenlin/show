using System;
using System.Data;
using System.Configuration;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Web.SessionState;
using System.Data.SqlClient;
using System.Text;
using System.IO;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Drawing;
using System.Net;
using System.Text.RegularExpressions;
using System.Diagnostics;
//using NPOI.HSSF.UserModel;
//using NPOI.SS.UserModel;
using System.Threading;

public class weixinfuns
{

    #region 写常规微信事件日志
    ///写常规微信事件日志
    ///徐进钊
    ///2015-01-05
    public void WxLog(string thing)
    {
        dbConn dbc = new dbConn();
        string sqls = "";
        try
        {
            sqls = "insert into poststr(poststr) values ('" + thing + "')";
            dbc.Execuse32(sqls, 0);
        }
        catch
        { }
    }
    #endregion


    #region 获得访问令牌
    //作者:徐进钊
    //日期:2014-1-11
    //功能:获得访问令牌
    public string get_access_token()
    {
        Funs df = new Funs();
        dbConn dbc = new dbConn();
        string htmlstr;
        string sqls = "";
        string access_token = "";

        try
        {
            //张宝媛加上类别2015-3-11
            sqls = "select access_token from access_token where category='服务号' and datetime>'" + DateTime.Now + "'";
            access_token = dbc.Execuse_onlyone(sqls);
            if (df.xlength(access_token) <= 0)   //当前访问令牌已过期,需要重新获取
            {
                //BY-刘俊研优化
                WebClient wc = new WebClient();
                wc.Credentials = CredentialCache.DefaultCredentials;
                Byte[] pageData = wc.DownloadData("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + df.getAppid() + "&secret=" + df.getAppSecret());
                htmlstr = System.Text.Encoding.Default.GetString(pageData);
                sqls = "delete from access_token where category='服务号';insert into access_token(access_token,datetime,category)values('" + df.get_json(htmlstr, "access_token") + "','" + DateTime.Now.AddSeconds(7200) + "','服务号')";
                dbc.Execuse32(sqls, 0);
            }
            return access_token;
        }
        catch
        {
            return "";
        }
    }
    #endregion

    #region 通知相关人员管理或审核活动,为真则通知成功,否则通知失败
    //作者:徐进钊
    //日期:2014-2-10
    //功能:通知相关人员管理或审核活动,为真则通知成功,否则通知失败
    public bool notice_weixin(string openid, string texting)
    {
        Funs df = new Funs();
        dbConn dbc = new dbConn();
        string htmlstr;
        string url = "";
        string JSONData;
        string[] array;
        string[] array2;
        string errcode = "";  //错误代码

        if (df.xlength(openid) < 20)
            openid = df.GetOpenID();

        if (df.xlength(openid) < 20)
            return false;

        if (df.xlength(texting) <= 0)   //如果没有特别的信息则用默认
        {
            texting = "";
        }
        
        url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + get_access_token();
        JSONData = " { \"touser\": \"" + openid + "\", \"msgtype\": \"text\", \"text\": { \"content\": \"" + texting + "\" } }";
        //return JSONData;
        byte[] bytes = Encoding.UTF8.GetBytes(JSONData);
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
        request.Method = "POST";
        request.ContentLength = bytes.Length;
        request.ContentType = "text/xml";
        Stream reqstream = request.GetRequestStream();
        reqstream.Write(bytes, 0, bytes.Length);

        //声明一个HttpWebRequest请求
        request.Timeout = 90000;
        //设置连接超时时间
        request.Headers.Set("Pragma", "no-cache");
        HttpWebResponse response = (HttpWebResponse)request.GetResponse();
        Stream streamReceive = response.GetResponseStream();
        Encoding encoding = Encoding.UTF8;

        StreamReader streamReader = new StreamReader(streamReceive, encoding);
        string strResult = streamReader.ReadToEnd();
        htmlstr = strResult;
        streamReceive.Dispose();
        streamReader.Dispose();

        //获得发送是否成功
        //errcode=0为成功,否则不成功
        htmlstr = htmlstr.Replace("\"", "");
        htmlstr = htmlstr.Replace("{", "");
        htmlstr = htmlstr.Replace("}", "");
        if (htmlstr.IndexOf(",") >= 0)
        {
            array = htmlstr.Split(',');
            for (int i = 0; i < array.Length - 1; i++)
            {
                if (array[i].IndexOf(":") >= 0)
                {
                    array2 = array[i].Split(':');
                    if (array2[0] == "errcode")
                        errcode = array2[1];
                }
            }
        }

        if (df.IsNum(errcode) == true)
        {
            if (Convert.ToInt32(errcode) > 0)  //发送不成功
            {
                df.log("发送审核通知失败" + openid, "0", "", "");
                return false;
            }
            else  //发送成功
            {
                df.log("发送审核通知成功" + openid, "0", "", "");
                return true;
            }
        }
        return false;
    }
    #endregion

    #region 根据参数获得二维码的ticket,参数即是scene_id,范围是1-100000
    //作者:徐进钊
    //日期:2014-1-21
    //功能:根据参数获得二维码的ticket,参数即是scene_id,范围是1-100000
    public string get_ticket(string scene_id)
    {
        Funs df = new Funs();
        dbConn dbc = new dbConn();
        string htmlstr;
        string[] array;
        string url = "";
        string ticket = "";
        string sep = df.getsep();
        string JSONData;

        try
        {
            url = "https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=" + get_access_token();

            JSONData = "{\"action_name\": \"QR_LIMIT_SCENE\", \"action_info\": {\"scene\": {\"scene_id\": \"" + scene_id + "\"}}}";
            //return JSONData;
            byte[] bytes = Encoding.UTF8.GetBytes(JSONData);
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.ContentLength = bytes.Length;
            request.ContentType = "text/xml";
            Stream reqstream = request.GetRequestStream();
            reqstream.Write(bytes, 0, bytes.Length);

            //声明一个HttpWebRequest请求
            request.Timeout = 90000;
            //设置连接超时时间
            request.Headers.Set("Pragma", "no-cache");
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream streamReceive = response.GetResponseStream();
            Encoding encoding = Encoding.UTF8;

            StreamReader streamReader = new StreamReader(streamReceive, encoding);
            string strResult = streamReader.ReadToEnd();
            htmlstr = strResult;
            streamReceive.Dispose();
            streamReader.Dispose();

            htmlstr = htmlstr.Replace("\"", "");
            htmlstr = htmlstr.Replace("{", "");
            htmlstr = htmlstr.Replace("}", "");

            if (htmlstr.IndexOf(":") >= 0)
            {
                array = htmlstr.Split(':');
                if (array[0] == "ticket")
                {
                    ticket = array[1];
                }
            }
            return HttpContext.Current.Server.UrlEncode(ticket);
        }
        catch
        {
            return "";
        }
    }
    #endregion

    #region 根据code获得网页授权openid
    //作者:徐进钊
    //日期:2014-1-11
    //功能:根据code获得网页授权openid
    public string get_oauth2_openid(string code)
    {
        Funs df = new Funs();
        dbConn dbc = new dbConn();
        string htmlstr;
        string[] array;
        string[] array2;
        string url = "";
        string openid = "";
        string sep = df.getsep();

        try
        {
            url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + df.getAppid() + "&secret=" + df.getAppSecret() + "&code=" + code + "&grant_type=authorization_code";
            WebClient wc = new WebClient();
            wc.Credentials = CredentialCache.DefaultCredentials;
            Byte[] pageData = wc.DownloadData(url);
            htmlstr = System.Text.Encoding.GetEncoding("utf-8").GetString(pageData);
            htmlstr = df.right(htmlstr, htmlstr.Length - htmlstr.IndexOf("{"));
            //HttpContext.Current.Response.Write(htmlstr);
            htmlstr = htmlstr.Replace("\"", "");
            htmlstr = htmlstr.Replace("{", "");
            htmlstr = htmlstr.Replace("}", "");

            if (df.Count_Char(htmlstr, ",") >= 4)
            {
                array = htmlstr.Split(',');
                for (int i = 0; i <= array.Length - 1; i++)
                {
                    if (array[i].IndexOf(":") >= 0)
                    {
                        array2 = array[i].Split(':');
                        if (array2[0] == "openid")
                        {
                            openid = array2[1];
                        }
                    }
                }
            }
            return openid;
        }
        catch
        {
            return "";
        }
    }
    #endregion

    #region 根据openid获得个人信息
    //作者:徐进钊
    //日期:2014-1-11
    //功能:根据openid获得个人信息
    public void get_personal_info(string openid)
    {
        Funs df = new Funs();
        dbConn dbc = new dbConn();
        string sqls = "select openid from member where openid='" + openid + "'";
        if (dbc.Execuse_iCount(sqls) > 0)
            return;
        string htmlstr;
        string url = "";
        string Fields_Values = "";
        string sep = df.getsep();
        try
        {
            url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + get_access_token() + "&openid=" + openid;
            WebClient wc = new WebClient();
            wc.Credentials = CredentialCache.DefaultCredentials;
            Byte[] pageData = wc.DownloadData(url);
            htmlstr = System.Text.Encoding.GetEncoding("utf-8").GetString(pageData);
            if (df.Count_Char(htmlstr, ",") >= 9)
            {
                //BY-刘俊研
                //是否订阅标识
                Fields_Values += "subscribe=" + df.get_json(htmlstr, "subscribe") + sep;
                //用户openid
                Fields_Values += "openid=" + df.get_json(htmlstr, "openid") + sep;
                //用户微信昵称
                Fields_Values += "wxname=" + df.get_json(htmlstr, "nickname") + sep;
                //用户性别
                Fields_Values += "sex=" + df.get_json(htmlstr, "sex") + sep;
                //使用语言
                Fields_Values += "language=" + df.get_json(htmlstr, "language") + sep;
                //所在城市
                Fields_Values += "city=" + df.get_json(htmlstr, "city") + sep;
                //所在省份
                Fields_Values += "province=" + df.get_json(htmlstr, "province") + sep;
                //所处国家
                Fields_Values += "country=" + df.get_json(htmlstr, "country") + sep;
                //用户大头像(640*640)与小头像(64*64)
                if (df.xlength(df.get_json(htmlstr, "headimgurl")) > 10)
                {
                    Fields_Values += "wxicon=" + df.get_json(htmlstr, "headimgurl") + sep;
                    Fields_Values += "wxicon64=" + df.get_json(htmlstr, "headimgurl").Substring(0, df.get_json(htmlstr, "headimgurl").Length - 1) + "64" + sep;
                }
                //用户关注时间
                Fields_Values += "subscribe_time=" + df.unix2dt(df.get_json(htmlstr, "subscribe_time")) + sep;
                df.DoDb("insert", "member", Fields_Values, "", 0);
            }
            else
            {
                Fields_Values = ""
                + "openid=" + openid + sep;
                df.DoDb("insert", "member", Fields_Values, "", 0);
                df.log("获取个人信息失败2,只存openid", "", "member", openid);  //写日志
            }
        }
        catch
        {
            Fields_Values = ""
            + "openid=" + openid + sep;
            df.DoDb("insert", "member", Fields_Values, "", 0);
            df.log("获取个人信息失败1,只存openid", "", "member", openid);  //写日志
        }
    }
    #endregion

    #region 用于多媒体文件的上传,并返回新的Media
    //作者:刘俊研
    //日期:2014-04-02
    //功能:用于多媒体文件的上传,并返回新的Media
    //注意:新的Media有效期为3天
    public string UploadMedia(string fileurl, string type)
    {
        WebClient Wbc = new WebClient();
        string file = HttpContext.Current.Server.MapPath(@"" + fileurl + "");
        byte[] result = Wbc.UploadFile(new Uri(String.Format("http://file.api.weixin.qq.com/cgi-bin/media/upload?access_token={0}&type={1}", get_access_token(), type)), file);
        string jsonStr = Encoding.Default.GetString(result);

        //以下截取所要的字符串
        jsonStr = jsonStr.Replace("\"", "");
        string bstr = "media_id:";
        string estr = ",created_at";
        int bIndex = jsonStr.IndexOf(bstr) + bstr.Length;
        int eIndex = jsonStr.IndexOf(estr);
        jsonStr = jsonStr.Substring(bIndex, eIndex - bIndex);

        return jsonStr;
    }
    #endregion

    #region 用于多媒体文件的下载
    //作者:刘俊研
    //日期:2014-04-02
    //功能:用于多媒体文件的下载
    public void DownloadMedia(string MediaId)
    {
        WebClient Wbc = new WebClient();
        string file = HttpContext.Current.Server.MapPath(@"/upload/" + MediaId + ".amr");
        string url = String.Format("http://file.api.weixin.qq.com/cgi-bin/media/get?access_token={0}&media_id={1}", get_access_token(), MediaId);
        Wbc.DownloadFile(url, file);
    }
    #endregion

    #region 用于发送音频消息
    //作者:徐进钊(刘俊研修改)
    //日期:2014-2-10
    //功能:用于发送音频消息
    public bool service_voice_msg(string openid, string MediaId)
    {
        Funs df = new Funs();
        dbConn dbc = new dbConn();
        string htmlstr;
        string url = "";
        string JSONData;
        string[] array;
        string[] array2;
        string errcode = "";  //错误代码

        if (df.xlength(openid) < 20)
        {
            return false;
        }

        if (df.xlength(MediaId) <= 0)   //如果没有特别的信息则失败
        {
            return false;
        }
        url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + get_access_token();

        JSONData = " { \"touser\": \"" + openid + "\", \"msgtype\": \"voice\", \"voice\": { \"media_id\": \"" + MediaId + "\" } }";
        //return JSONData;
        byte[] bytes = Encoding.UTF8.GetBytes(JSONData);
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
        request.Method = "POST";
        request.ContentLength = bytes.Length;
        request.ContentType = "text/xml";
        Stream reqstream = request.GetRequestStream();
        reqstream.Write(bytes, 0, bytes.Length);

        //声明一个HttpWebRequest请求
        request.Timeout = 90000;
        //设置连接超时时间
        request.Headers.Set("Pragma", "no-cache");
        HttpWebResponse response = (HttpWebResponse)request.GetResponse();
        Stream streamReceive = response.GetResponseStream();
        Encoding encoding = Encoding.UTF8;

        StreamReader streamReader = new StreamReader(streamReceive, encoding);
        string strResult = streamReader.ReadToEnd();
        htmlstr = strResult;
        streamReceive.Dispose();
        streamReader.Dispose();

        //获得发送是否成功
        //errcode=0为成功,否则不成功
        htmlstr = htmlstr.Replace("\"", "");
        htmlstr = htmlstr.Replace("{", "");
        htmlstr = htmlstr.Replace("}", "");
        if (htmlstr.IndexOf(",") >= 0)
        {
            array = htmlstr.Split(',');
            for (int i = 0; i < array.Length - 1; i++)
            {
                if (array[i].IndexOf(":") >= 0)
                {
                    array2 = array[i].Split(':');
                    if (array2[0] == "errcode")
                    {
                        errcode = array2[1];
                    }
                }
            }
        }

        if (Convert.ToInt32(errcode) > 0)  //发送不成功
        {
            df.log("发送审核通知失败" + openid, "0", "", "");
            return false;
        }
        else  //发送成功
        {
            df.log("发送审核通知成功" + openid, "0", "", "");
            return true;
        }
    }
    #endregion

    #region 检查用户数据库头像是否最新，不是即更新
    //作者:刘俊研
    //日期:2014-09-19
    //功能:检查用户数据库头像是否最新，不是即更新
    public void Update_wxicon(string openid)
    {
        Funs df = new Funs();
        dbConn dbc = new dbConn();
        string sqls = "select openid from member where openid='" + openid + "'";
        if (dbc.Execuse_iCount(sqls) < 0)
            return;
        sqls = "select uid from member where DATEDIFF(DAY,icon_date,getdate())=0 and openid='" + openid + "'";//判断今天是否已更新，为避免重复获取用户信息一天更新一次
        if (dbc.Execuse_iCount(sqls) > 0)
            return;
        string htmlstr;
        string url = "";
        string Fields_Values = "";
        string sep = df.getsep();
        try
        {
            url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=" + get_access_token() + "&openid=" + openid;
            WebClient wc = new WebClient();
            wc.Credentials = CredentialCache.DefaultCredentials;
            Byte[] pageData = wc.DownloadData(url);
            htmlstr = System.Text.Encoding.GetEncoding("utf-8").GetString(pageData);
            if (df.Count_Char(htmlstr, ",") >= 9)
            {
                //BY-刘俊研
                //更新用户大头像(640*640)与小头像(64*64)
                if (df.xlength(df.get_json(htmlstr, "headimgurl")) > 10)
                {
                    sqls = "select wxicon from member where openid='" + openid + "'";
                    if (dbc.Execuse_onlyone(sqls) != df.get_json(htmlstr, "headimgurl")) //如果和数据库存在的头像URL不相同即更新
                    {
                        Fields_Values += "wxicon=" + df.get_json(htmlstr, "headimgurl") + sep;
                        Fields_Values += "wxicon64=" + df.get_json(htmlstr, "headimgurl").Substring(0, df.get_json(htmlstr, "headimgurl").Length - 1) + "64" + sep;
                        Fields_Values += "icon_date=" + DateTime.Now + sep;
                        df.DoDb("update", "member", Fields_Values, "openid='" + openid + "'", 0);
                    }
                    else
                    {
                        Fields_Values += "icon_date=" + DateTime.Now + sep;
                        df.DoDb("update", "member", Fields_Values, "openid='" + openid + "'", 0);
                    }
                }
            }
            else
            {
                df.log("头像更新失败1", "", "member", openid);
            }
        }
        catch
        {
            df.log("头像更新失败2", "", "member", openid);
        }
    }
    #endregion

    //作者:刘俊研
    //日期:2014-09-22
    //功能:按照两经纬度返回两者之间的距离
    private const double EARTH_RADIUS = 6378.137;
    private static double rad(double d)
    {
        return d * Math.PI / 180.0;
    }
    public double GetDistance(Point from, Point to)
    {
        double radLat1 = rad(from.X);
        double radLat2 = rad(to.X);
        double a = radLat1 - radLat2;
        double b = rad(from.Y) - rad(to.Y);
        double s = 2 * Math.Asin(Math.Sqrt(Math.Pow(Math.Sin(a / 2), 2) +
         Math.Cos(radLat1) * Math.Cos(radLat2) * Math.Pow(Math.Sin(b / 2), 2)));
        s = s * EARTH_RADIUS;
        s = Math.Round(s * 10000) / 10000;
        return s;
    }

    //作者:徐进钊
    //日期:2014-1-19
    //功能:千米友好显示
    public string formatKM(double km)
    {
        if (km < 1000)
            return String.Format("{0:N0}", km) + "米";
        else
            km = km / 1000;
        return String.Format("{0:N2}", km) + "千米";
    }



    //作者:张宝媛
    //日期:2014-10-28
    //功能:资讯预览功能,为真则通知成功,否则通知失败
    //openid为接收者openid，id为选中政策法规的id
    public bool  PreviewInfo(string openid, string id)
    {

        string sqls = "";
        Funs df = new Funs();
        dbConn dbc = new dbConn();
        SqlConnection conn = new dbConn().dklConnectDo();
        SqlDataReader dr;
        string htmlstr;
        string url = "";
        string JSONData;
        string[] array;
        string[] array2;
        string errcode = "";  //错误代码
        string pic = "";
        string title = "";
        string intro = "";

        if (df.xlength(openid) < 20)
        {
            openid = df.GetOpenID();
        }

        if (df.xlength(openid) < 20)
        {
            return false;
        }

        if (df.xlength(id) < 1)
        {
            return false;
        }

        url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=" + get_access_token();


        JSONData = "{" +
            "\"touser\":\"" + openid + "\"," +
            "\"msgtype\":\"news\"," +
            "\"news\":{" +
            "\"articles\": [";
        //选中的第一条记录
        id = df.farmat_ids(id);
        //sqls = "select id,title,intro,publishunit,intro_edit from news where id in (" + id + ") and status='激活' order by publishtime desc,hot desc";
        sqls = "select id,title,intro,pic from threads where id='" + id + "'"; 
        dr = df.drtable(conn, sqls);
        while (dr.Read())
        {
            title = dr["title"].ToString().Replace("\n", "").Replace("\r", "");
            df.WriteLog(df.xlength(dr["pic"].ToString()).ToString());
            pic = df.xlength(dr["pic"].ToString()) > 5 ? dr["pic"].ToString() : df.getrooturl() + "/images/1.jpg";
            intro = df.left(df.NoHTML(dr["intro"].ToString().Replace("\n", "").Replace("\r", "")), 60) + "...";

            JSONData += "{" +
                "\"title\":\"" + title + "\"," +
                "\"description\":\"" + intro + "\"," +
                "\"url\":\"" + df.getrooturl() + "/news-detail.aspx?id=" + dr["id"] + "\"," +
                "\"picurl\":\"" + pic + "\"" +
                "},";
        }
        if (df.right(JSONData, 1) == ",")
        {
            JSONData = df.left(JSONData, JSONData.Length);
        }
        dr.Dispose();
        JSONData += "]" +
                    "}" +
                    "}";
        dbc.CloseConn(conn);
        //JSONData = " { \"touser\": \"" + openid + "\", \"msgtype\": \"text\", \"text\": { \"content\": \"" + texting + "\" } }";
        //return JSONData;
        byte[] bytes = Encoding.UTF8.GetBytes(JSONData);
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
        request.Method = "POST";
        request.ContentLength = bytes.Length;
        request.ContentType = "text/xml";
        Stream reqstream = request.GetRequestStream();
        reqstream.Write(bytes, 0, bytes.Length);

        //声明一个HttpWebRequest请求
        request.Timeout = 90000;
        //设置连接超时时间
        request.Headers.Set("Pragma", "no-cache");
        HttpWebResponse response = (HttpWebResponse)request.GetResponse();
        Stream streamReceive = response.GetResponseStream();
        Encoding encoding = Encoding.UTF8;

        StreamReader streamReader = new StreamReader(streamReceive, encoding);
        string strResult = streamReader.ReadToEnd();
        htmlstr = strResult;
        streamReceive.Dispose();
        streamReader.Dispose();

        //获得发送是否成功
        //errcode=0为成功,否则不成功
        htmlstr = htmlstr.Replace("\"", "");
        htmlstr = htmlstr.Replace("{", "");
        htmlstr = htmlstr.Replace("}", "");
        if (htmlstr.IndexOf(",") >= 0)
        {
            array = htmlstr.Split(',');
            for (int i = 0; i < array.Length - 1; i++)
            {
                if (array[i].IndexOf(":") >= 0)
                {
                    array2 = array[i].Split(':');
                    if (array2[0] == "errcode")
                        errcode = array2[1];
                }
            }
        }

        if (df.IsNum(errcode) == true)
        {
            if (Convert.ToInt32(errcode) > 0)  //发送不成功
            {
                df.log("发送预览失败" + openid, "0", "", "");
                return false;
            }
            else  //发送成功
            {
                df.log("发送预览成功" + openid, "0", "", "");
                return true;
            }
        }
        return false;
    }
}







