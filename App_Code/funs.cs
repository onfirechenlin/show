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
using System.Threading;
using System.Web.Script.Serialization;




/// <summary>
/// 函数集
/// </summary>
public class Funs
{
    public string appcategory = ConfigurationManager.AppSettings["AppCategory"];

    weixinfuns wx = new weixinfuns();

    #region 判断字符是否是正整数字
    //使用方法
    //DklFuns fc = new DklFuns();
    //TextBox2.Text =Convert.ToString(fc.IsNumberic("a"));
    public bool IsNum(string oText)
    {
        try
        {
            if (xlength(oText) <= 0)
            {
                return false;
            }
            int var1 = Convert.ToInt32(oText);
            return true;
        }
        catch
        {
            return false;
        }
    }
    #endregion

    #region 判断是否是数字,带小数
    public bool IsFloat(string oText)
    {
        try
        {
            Double var1 = Convert.ToDouble(oText);
            return true;
        }
        catch
        {
            return false;
        }
    }
    #endregion

    #region 得到某字符串的长度,先检查是否为空值.能检测三种类型,布尔,字符串,数字
    public int xlength(object para)
    {
        try
        {
            string gtype = Convert.ToString(para.GetType());
            if (gtype == "System.Boolean")
            {
                if ((Boolean)para == true) { return 1; }                //检测布尔值为真则返回1,否则返回0
                else if ((Boolean)para == false) { return 0; }
            }
            else if (gtype == "System.String")
            {
                if ((String)para == null) { return 0; }                //检测字符串为空则返回0,否则返回实际长度
                else if ((Boolean)para.Equals(DBNull.Value)) { return 0; }
                else { return para.ToString().Length; }
            }
            else if (gtype == "System.Int32")
            {
                return (Int32)para.ToString().Length;                //检测数值返回实际长度
            }
        }
        catch
        {
            return 0; //无法检测
        }
        return 0; //无法检测
    }
    #endregion

    #region 代替response.write.
    //作者:徐进钊
    //日期:2013-8-29
    //功能:代替response.write.
    //参数:para要输出的内容
    public void ToWrite(object para)
    {
        HttpContext.Current.Response.Write(para);
    }
    #endregion

    #region 判断日期是否是合法
    //使用方法
    //DklFuns df = new DklFuns();
    //df.IsDate("2012-1-1")
    public bool IsDate(string str)
    {
        try
        {
            Convert.ToDateTime(str);
            return true;
        }
        catch
        {
            return false;
        }
    }
    #endregion

    #region 生成N位随机数
    public string RndNum(int VcodeNum) //生成N位随机数
    {
        string Vchar = "0,1,2,3,4,5,6,7,8,9";
        string[] VcArray = Vchar.Split(',');
        string VNum = "";//由于字符串很短，就不用StringBuilder了 
        int temp = -1;//记录上次随机数值，尽量避免生产几个一样的随机数 
        //采用一个简单的算法以保证生成随机数的不同 
        Random rand = new Random();
        for (int i = 1; i < VcodeNum + 1; i++)
        {
            if (temp != -1) { rand = new Random(i * temp * unchecked((int)DateTime.Now.Ticks)); }
            //int t = rand.Next(35) ; 
            int t = rand.Next(9);
            if (temp != -1 && temp == t) { return RndNum(VcodeNum); }
            temp = t;
            VNum += VcArray[t];
        }
        return VNum;
    }
    #endregion
    /// <summary>
    /// 随机家园卡
    /// return char(6)
    /// </summary>
    /// <returns></returns>
    public string getidcard()
    {
        dbConn dbc = new dbConn();
        SqlConnection conn = new dbConn().dklConnectDo();
        string idcard;
        string sep = getsep();
        string sqls = "";
        int affword;
        while (true)
        {
            idcard = RndNum(6);
            sqls = "select uid from member where idcard=@idcard";
            affword = dbc.PExecuse_iCount(conn, sqls, "@idcard" + sep + idcard + sep + "nvarchar" + sep + "50");
            if (affword <= 0 && idcard.Substring(0, 1) != "0")
            {
                break;
            }
        }
        dbc.CloseConn(conn);
        return idcard;
    }
    #region 生成N位随机数,有字母
    public string RndNum2(int VcodeNum) //生成N位随机数,有字母
    {
        string Vchar = "a,b,c,3,4,8,9,d,f,e,f,0,1,2,g,h,i,5,6,7,j";
        string[] VcArray = Vchar.Split(',');
        string VNum = "";//由于字符串很短，就不用StringBuilder了 
        int temp = -1;//记录上次随机数值，尽量避免生产几个一样的随机数 
        //采用一个简单的算法以保证生成随机数的不同 
        Random rand = new Random();
        for (int i = 1; i < VcodeNum + 1; i++)
        {
            if (temp != -1) { rand = new Random(i * temp * unchecked((int)DateTime.Now.Ticks)); }
            //int t = rand.Next(35) ; 
            int t = rand.Next(20);
            if (temp != -1 && temp == t) { return RndNum(VcodeNum); }
            temp = t;
            VNum += VcArray[t];
        }
        return VNum;
    }
    #endregion

    #region 得到会员动态
    //作者:徐进钊
    //日期:2013-3-7
    //功能:得到会员动态
    //参数:uid是会员的id;
    //参数:category是动态类型有(1.发表书评,2.发表文章,3.参加活动,4.加入小站,5.发表贴子,6.创建了小站,7.发布活动.)
    //参数:xid为相关数据表id
    //参数:sid为小站的id
    public void dynimic(string uid, string category, string xid, string sid)
    {
        dbConn dbc = new dbConn();
        string sep = "|";
        string Fields_Values = "";
        string thing = "";
        string sqls = "";
        string sqls2 = "";
        string sqls3 = "";

        if (xlength(uid) <= 0)
            return;
        switch (category)
        {
            case "发表书评":
                sqls = "select title from bookreview where id='" + xid + "'";
                thing = "发表了书评 <a href=\"/read-subject-review.aspx?id=" + xid + "\">" + dbc.Execuse_onlyone(sqls) + "</a>";
                break;
            case "发表文章":
                break;
            case "参加活动":
                sqls = "select title from active where id='" + xid + "'";
                sqls2 = "select sid from active where id='" + xid + "'";
                thing = "参加了活动 <a href='play-subject.aspx?aid=" + xid + "&sid=" + dbc.Execuse_onlyone(sqls2) + "'>" + dbc.Execuse_onlyone(sqls) + "</a>";
                break;
            case "加入小站":
                sqls = "select stationname from station where id='" + xid + "'";
                thing = "加入了小站 <a href='site.aspx?sid=" + xid + "'>" + dbc.Execuse_onlyone(sqls) + "</a>";
                break;
            case "发表贴子":
                sqls = "select title from threads where id='" + xid + "'";
                sqls2 = "select sid from threads where id='" + xid + "'";
                sqls3 = "select aid from threads where id='" + xid + "'";
                thing = "发表了贴子 <a href=\"forum-review.aspx?id=" + xid + "&sid=" + dbc.Execuse_onlyone(sqls2) + "&aid=" + dbc.Execuse_onlyone(sqls3) + "\">" + dbc.Execuse_onlyone(sqls) + "</a>";
                break;
            case "创建了小站":
                sqls = "select stationname from station where id='" + xid + "'";
                thing = "创建了小站 <a href='site.aspx?sid=" + xid + "'>" + dbc.Execuse_onlyone(sqls) + "</a>";
                break;
            case "发布活动":
                sqls = "select title from active where id='" + xid + "'";
                sqls2 = "select sid from active where id='" + xid + "'";
                thing = "加入了小站 <a href='play-subject.aspx?aid=" + xid + "&sid=" + dbc.Execuse_onlyone(sqls2) + "'>" + dbc.Execuse_onlyone(sqls) + "</a>";
                break;
        }
        if (xlength(thing) > 0)
        {
            Fields_Values = ""
            + "uid=" + uid + sep
            + "sid=" + sid + sep
            + "category=" + category + sep
            + "xid=" + xid + sep
            + "thing=" + HttpContext.Current.Server.UrlEncode(thing) + sep;
            DoDb("insert", "dynamic", Fields_Values, "", 0);
        }
    }
    #endregion

    #region 图片缩略图
    //作者:刘俊研
    //日期:2013-5-23
    //功能:图片缩略图
    //参数:sourcePath 源文件路径；targetPath 输出文件目录 
    //参数:swidth,sheight为按原始外观比例缩放的设定值
    //E.G.:MakeThumbnail("/image/1.jpg","/image/",100,100)
    public string MakeThumbnail(string sourcePath, string targetPath, int swidth, int sheight)
    {
        string spathtmp = sourcePath;   //解决图片过小路径问题
        string pathtmp = targetPath;

        //判断保存路径来自服务器目录，还是本地目录
        if (targetPath.IndexOf(":") == 1) //找到： 为绝对路径
        { }
        else
        {
            targetPath = HttpContext.Current.Server.MapPath(targetPath);    //服务器路径
            sourcePath = HttpContext.Current.Server.MapPath(sourcePath);
        }
        System.Drawing.Image ig = System.Drawing.Image.FromFile(sourcePath);
        if (ig.Width < swidth && ig.Height < sheight)
            return spathtmp;
        int towidth = 0;
        int toheight = 0;
        if (ig.Width > ig.Height)
        {
            toheight = (int)(((double)(ig.Height) / ((double)(ig.Width) / (double)(swidth))));
            towidth = swidth;
        }
        else if (ig.Width <= ig.Height)
        {
            toheight = sheight;
            towidth = (int)(((double)(ig.Width) / ((double)(ig.Height) / (double)(sheight))));
        }
        int x = 0;
        int y = 0;
        int ow = ig.Width;
        int oh = ig.Height;
        if ((double)ig.Width / (double)ig.Height > (double)towidth / (double)toheight)
        {
            oh = ig.Height;
            ow = ig.Height * towidth / toheight;
            y = 0;
            x = (ig.Width - ow) / 2;
        }
        else
        {
            ow = ig.Width;
            oh = ig.Width * toheight / towidth;
            x = 0;
            y = (ig.Height - oh) / 2;
        }
        System.Drawing.Image bitmap = new System.Drawing.Bitmap(towidth, toheight);
        System.Drawing.Graphics g = System.Drawing.Graphics.FromImage(bitmap);
        g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.High;
        g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
        g.Clear(System.Drawing.Color.Transparent);
        g.DrawImage(ig, new System.Drawing.Rectangle(0, 0, towidth, toheight), new System.Drawing.Rectangle(x, y, ow, oh), System.Drawing.GraphicsUnit.Pixel);
        try
        {
            Random ro1 = new Random(1000000000);
            Random ro2 = new Random();
            int name = ro1.Next(10, 1000000000) + ro2.Next(10, 1000000000);
            targetPath = targetPath + name.ToString() + ".jpg";
            pathtmp = pathtmp + name.ToString() + ".jpg";
            bitmap.Save(targetPath, System.Drawing.Imaging.ImageFormat.Jpeg);

            return pathtmp;
        }
        catch
        {
            return "Error.";
        }
        finally
        {
            ig.Dispose();
            bitmap.Dispose();
            g.Dispose();
            //File.Delete(sourcePath); //删除源文件
        }
    }
    #endregion

    #region 小站,活动,文章,首页,相册,相片,书评,论坛贴子
    //点击数增1
    //小站,活动,文章,首页,相册,相片,书评,论坛贴子
    public void addhits(string category, string xid)
    {
        string sqls = "";
        int id = Convert.ToInt32(xid);
        dbConn dbc = new dbConn();

        switch (category)
        {
            case "活动":
                sqls = "update active set hits=hits+1 where id='" + id + "'";
                break;
            case "成语":
                sqls = "update idiom set hits=hits+1 where id='" + id + "'";
                break;
            case "图书":
                sqls = "update book set hits=hits+1 where id='" + id + "'";
                break;
            case "书友活动":
                sqls = "update active set hits=hits+1 where id='" + id + "'";
                break;
        }

        if (xlength(sqls) > 5)
        {
            dbc.Execuse(sqls);
        }
    }
    #endregion

    #region 根据当前时间，返回几秒、几分钟前，相差2天以上返回日期（03-08），异年返回年份日期（12-03-08）。
    //作者:刘俊研
    //日期:2013-3-9
    //功能:根据当前时间，返回几秒、几分钟前，相差2天以上返回日期（03-08），异年返回年份日期（12-03-08）。
    public string CountDate(string indate)
    {
        int second, day = 0;
        string retime = ""; //返回的时间
        if (IsDate(indate) == false)  //非合法日期
            return "";
        DateTime dt = Convert.ToDateTime(indate);
        indate = (dt.ToString("yyyy-MM-dd HH:mm:ss"));//格式化日期
        try               //防出错
        {
            DateTime dt1 = Convert.ToDateTime(indate);
            DateTime dt2 = Convert.ToDateTime(DateTime.Now.ToString());
            DateTime dt4 = Convert.ToDateTime(DateTime.Today.ToString());
            DateTime dt3 = Convert.ToDateTime(indate.Substring(0, 10));//只取日期
            TimeSpan ts = dt2 - dt1;
            TimeSpan td = dt4 - dt3;//注意：输出字符样式为：0.00:00:00
            second = int.Parse(ts.TotalSeconds.ToString());
            if (td.ToString().IndexOf(".") > 0)//判断是否取到 "."
            {
                day = int.Parse(td.ToString().Substring(0, td.ToString().IndexOf(".")));
                if (day > 1 && dt4.Year == dt3.Year)
                {
                    retime = indate.Substring(5, 11);   //两天前
                }
                else if (day < -1 && dt4.Year == dt3.Year)
                {
                    retime = indate.Substring(5, 11);
                }
                else
                {
                    retime = indate.Substring(0, 16);
                }
            }
            else
            {
                retime = "今天" + indate.Substring(indate.IndexOf(" ") + 1, 5);
            }
            if (second < 60 && second > 0)
            {
                retime = second.ToString("0") + "秒前";
            }
            else if (second > -60 && second < 0)
            {
                retime = (second * -1).ToString("0") + "秒后";
            }
            else if (second >= 60 && second < 60 * 60)
            {
                retime = (second / 60).ToString("0") + "分钟前";
            }
            else if (second <= -60 && second > -60 * 60)
            {
                retime = (second / -60).ToString("0") + "分钟后";
            }
            else if (day == 1)
            {
                retime = "昨天" + indate.Substring(indate.LastIndexOf(" ") + 1, 5);
            }
            else if (day == -1)
            {
                retime = "明天" + indate.Substring(indate.LastIndexOf(" ") + 1, 5);
            }
        }
        catch
        {
            return indate.Substring(0, 16);
        };
        return retime;
    }
    #endregion

    #region 转换格式日期为（如：2012/02/30 2012.02.30）至：2012-02-30此种格式。
    //作者:刘俊研
    //日期:2013-3-6
    //功能:转换格式日期为（如：2012/02/30 2012.02.30）至：2012-02-30此种格式。
    //style为1时有时分秒，为0时仅日期
    public string FormatDate(string indate, int style)
    {
        try
        {
            string redate = ""; //返回转换的日期
            DateTime dt = Convert.ToDateTime(indate);
            if (dt.Hour == 0 || style == 0)//判断传入日期参数是否有：时分秒
                redate = (dt.ToString("yyyy-MM-dd"));//可自定义（如："yyyy年MM月dd日）
            else if (style == 1)
                redate = (dt.ToString("yyyy-MM-dd HH:mm"));//可自定义（如："yyyy年MM月dd日 HH小时mm分ss秒"注意大小写）
            return redate;
        }
        catch
        {
            return "";
        }
    }
    #endregion

    #region 登录前保存当前URL到cookie,以便登录后返回.
    public void saveurl()
    {
        setcookie("url", HttpContext.Current.Request.Url.ToString(), 1);
    }
    #endregion

    #region 去除HTML标记
    public string NoHTML(string Htmlstring)
    {
        //删除脚本   
        Htmlstring = Regex.Replace(Htmlstring, @"<script[^>]*?>.*?</script>", "", RegexOptions.IgnoreCase);
        //删除HTML   
        Htmlstring = Regex.Replace(Htmlstring, @"<(.[^>]*)>", "", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"([\r\n])[\s]+", "", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"-->", "", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"<!--.*", "", RegexOptions.IgnoreCase);

        Htmlstring = Regex.Replace(Htmlstring, @"&(quot|#34);", "\"", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(amp|#38);", "&", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(lt|#60);", "<", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(gt|#62);", ">", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(nbsp|#160);", "   ", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(iexcl|#161);", "\xa1", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(cent|#162);", "\xa2", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(pound|#163);", "\xa3", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&(copy|#169);", "\xa9", RegexOptions.IgnoreCase);
        Htmlstring = Regex.Replace(Htmlstring, @"&#(\d+);", "", RegexOptions.IgnoreCase);

        Htmlstring.Replace("<", "");
        Htmlstring.Replace(">", "");
        Htmlstring.Replace("\r\n", "");
        Htmlstring = HttpContext.Current.Server.HtmlEncode(Htmlstring).Trim();

        return Htmlstring;
    }
    #endregion

    #region 根据获取上传图片的像素宽高，判断上传的图片是否为真实图片
    //作者:刘俊研
    //日期:2013-3-7
    //功能:根据获取上传图片的像素宽高，判断上传的图片是否为真实图片
    //参数:Fdir 为上传文件的路径
    public bool IsImg(string Fdir)
    {
        try
        {
            int Pxwd, Pxhg;
            Fdir = HttpContext.Current.Server.MapPath(Fdir);
            Pxwd = System.Drawing.Image.FromFile(Fdir).Width;//如果获取不到会导致异常：内存不足
            Pxhg = System.Drawing.Image.FromFile(Fdir).Height;
            return true;
        }
        catch
        {
            File.Delete(Fdir);//根据上传路径删除上传图片
            return false;
        }
    }
    #endregion

    #region 设置cookies函数,三个参数，一个是cookie的名字，一个是值,一个是cookie 将被保存天数
    //设置cookies函数,三个参数，一个是cookie的名字，一个是值,一个是cookie 将被保存天数
    public void setcookie(string cname, string value, int exdays)
    {
        delcookie(cname);
        if (exdays > 0)  //0则是会话
            HttpContext.Current.Response.Cookies[cname].Expires = DateTime.Now.AddDays(exdays);
        HttpContext.Current.Response.Cookies[cname].Value = HttpUtility.UrlEncode(value, System.Text.Encoding.GetEncoding("utf-8"));
    }
    public string getcookie(string cname)
    {
        if (HttpContext.Current.Request.Cookies[cname] != null)
        {
            return HttpUtility.UrlDecode(HttpContext.Current.Request.Cookies[cname].Value, System.Text.Encoding.GetEncoding("utf-8"));
        }
        return "";
    }
    public void delcookie(string cname)
    {
        HttpCookie cok = HttpContext.Current.Request.Cookies[cname];
        if (cok != null)
        {
            TimeSpan ts = new TimeSpan(-1, 0, 0, 0);
            cok.Expires = DateTime.Now.Add(ts);//删除整个Cookie，只要把过期时间设置为现在
            HttpContext.Current.Response.AppendCookie(cok);
        }
    }
    #endregion

    #region 检查当前uid是否为管理员
    //检查当前uid是否为管理员
    public bool check_admin(string uid)
    {
        if (xlength(uid) <= 0)
            return false;
        dbConn dbc = new dbConn();
        if (getdeveloping() == "1")
            return true;
        string sqls = "select uid from member where uid='" + uid + "' and level2='A'";
        if (dbc.Execuse_iCount(sqls) > 0)
            return true;
        return false;
    }
    #endregion

    #region 格式化ids集合,如1,,2,3,格式化结果为:1,2,3
    //作者：徐进钊
    //日期：2013-08-06
    //功能：格式化ids集合,如1,,2,3,格式化结果为:1,2,3
    public string farmat_ids(string ids)
    {
        if (xlength(ids) <= 0)
            return "";
        ids = ids.Replace(",,", ",");
        ids = ids.Replace(",,,", ",");
        if (ids.Substring(ids.Length - 1, 1) == ",")
            ids = left(ids, ids.Length - 1);
        return ids;
    }
    #endregion

    #region 从字符串里取年月日，不要时间
    //作者：徐进钊
    //日期：2013-07-29
    //功能：从字符串里取年月日，不要时间
    public string NoTime(string dt)
    {
        if (xlength(dt) <= 0)
        {
            return "";
        }
        else if (dt.IndexOf("天") > 0)
        {
            return left(dt, dt.IndexOf("天") + 1);
        }
        else if (dt.IndexOf("分") > 0)
        {
            return "今天";
        }
        else if (dt.IndexOf("时") > 0)
        {
            return "今天";
        }
        else if (dt.IndexOf("秒") > 0)
        {
            return "今天";
        }
        else if (dt.IndexOf(" ") <= 0)
        {
            return dt;
        }
        else
        {
            return left(dt, dt.IndexOf(" "));
        }
    }
    #endregion

    #region 从字符串里取时间，不要年月日
    //作者：徐进钊
    //日期：2013-07-29
    //功能：从字符串里取时间，不要年月日
    public string NoDate(string dt)
    {
        if (xlength(dt) <= 0)
        {
            return "";
        }
        else if (dt.IndexOf(" ") <= 0)
        {
            return dt;
        }
        else
        {
            return right(dt, dt.Length - dt.IndexOf(" "));
        }
    }
    #endregion

    #region 取整,1.1为2;2.9为3
    //取整,1.1为2;2.9为3
    public Int32 Gint(Double a)
    {
        a = a + 0.999999;
        int b = (int)a;
        return b;
    }
    #endregion

    #region 格式化将要插入数据库表的单引号'
    //作者:刘俊研
    //日期:2013-4-2
    //功能:格式化将要插入数据库表的单引号'
    //参数:instr为要格式化的字符串
    //例子:Format_single_quotes("ab'c")
    public string Format_single_quotes(string instr)
    {
        if (xlength(instr) <= 0)
        {
            return "";
        }
        int len = instr.Length;
        string restr = "", tmp = "";
        for (int i = 0; i < len; i++)
        {
            tmp = instr.Substring(i, 1);
            if (tmp == "'")
            {
                tmp = tmp + "'";
            }
            restr = restr + tmp;
        }
        return restr;
    }
    #endregion

    #region 将目标图片复制到指定文件夹内并重命名。
    //作者：刘俊研 
    //日期：2013-05-31
    //功能：将目标图片复制到指定文件夹内并重命名。
    //参数：sourcePath：源图片("\images\1.jpg"),targetPath：存放目录("\images\")
    //返回值：相对路径("\images\**.jpg")
    public string Move_img(string sourcePath, string targetPath)
    {

        string imgN = "";
        string Mpath = "";          //目标目录路径
        string tPath = targetPath;  //记录初始目标目录
        string extension = Path.GetExtension(sourcePath);
        //判断保存路径来自服务器目录，还是本地目录
        if (targetPath.IndexOf(":") == 1) //找到"："为绝对路径
        {
            imgN = sourcePath.Substring(sourcePath.LastIndexOf(@"\") + 1, sourcePath.Length - sourcePath.LastIndexOf(@"\") - 1);
            Mpath = sourcePath.Replace(imgN, "");
        }
        else
        {
            targetPath = HttpContext.Current.Server.MapPath(targetPath);    //服务器路径
            sourcePath = HttpContext.Current.Server.MapPath(sourcePath);
            imgN = sourcePath.Substring(sourcePath.LastIndexOf(@"\") + 1, sourcePath.Length - sourcePath.LastIndexOf(@"\") - 1);
            Mpath = sourcePath.Replace(imgN, "");


        }

        DirectoryInfo di = new DirectoryInfo(Mpath);
        foreach (FileInfo fi in di.GetFiles(imgN))  //可以用 di.GetFiles("*.jpg") 只移动jpg文件
        {
            //执行重命名
            Random ro1 = new Random(1000000000);
            Random ro2 = new Random();
            int name = ro1.Next(10, 100000000) + ro2.Next(10, 100000000);
            targetPath = targetPath + name.ToString() + extension;
            tPath = tPath + name.ToString() + extension;
            fi.CopyTo(targetPath, true);
        }

        return tPath;
    }
    #endregion

    #region 获得ip地址
    public string getip()
    {
        return HttpContext.Current.Request.UserHostAddress;
    }
    #endregion

    #region 根据ip获得城市
    public string getcity(string ip)  //根据ip获得城市
    {
        string htmlstr;
        int endnum = 0;

        try
        {
            WebClient wc = new WebClient();
            wc.Credentials = CredentialCache.DefaultCredentials;
            Byte[] pageData = wc.DownloadData("http://www.ip138.com/ips138.asp?ip=" + ip);
            htmlstr = System.Text.Encoding.Default.GetString(pageData);

            htmlstr = htmlstr.Substring(htmlstr.IndexOf("<ul class=\"ul1\"><li>"), 50);
            htmlstr = htmlstr.Substring(htmlstr.IndexOf("<li>"));
            endnum = htmlstr.IndexOf("</");
            htmlstr = htmlstr.Substring(htmlstr.IndexOf(">") + 1, endnum - 4);
            htmlstr = htmlstr.Replace("本站主数据：", "");
            return htmlstr;
        }
        catch
        {
            return "";
        }
    }
    #endregion

    #region 站内信发送器
    //站内信发送器
    //classid 有两类,一类是信息,一类是请求,请求要求回复.
    //send_id为0则为系统,其余则从会员表里识别身份
    //category 为请求的类型,目前有好友,小站成员.
    //xid为活动或小站，图书推送，相册推送，文章推送等的id
    public int sendmessages(string send_id, string re_id, string content, string classid, string category, string xid)
    {
        try
        {
            if (send_id == re_id) //不能给自己发信息
            { return -1; }
            else
            {
                string prefix;
                string title;
                int AffRows = 0;
                string sep = getsep();

                prefix = "";
                title = "";

                string Fields_Values = ""
                + "prefix=" + prefix + sep
                + "title=" + title + sep
                + "content=" + content + sep
                + "sender_id=" + send_id + sep
                + "receiver=" + re_id + sep
                + "xid=" + xid + sep
                + "category=" + Format_single_quotes(category) + sep
                + "classid=" + classid + sep;

                AffRows = DoDb("insert", "messages", Fields_Values, "", 0);
                return AffRows; //大于0则表示成功
            }
        }
        catch
        {
            return -2; //未知错误
        }
    }
    #endregion

    #region thing为操作简述；OID为被操作的ID,dbtable为被操作的表
    //thing为操作简述；OID为被操作的ID,dbtable为被操作的表
    public void log(string thing, string oid, string dbtable, string openid)  //写日志
    {
        string sep = getsep();
        string ip = this.getip();

        if (oid == null) { oid = ""; }
        if (thing == null) { thing = ""; }
        if (dbtable == null) { dbtable = ""; }

        string Fields_Values = ""
        + "uid=" + this.getcookie("uid") + sep
        + "ip=" + ip + sep
        + "city=" + this.getcity(ip) + sep
        + "thing=" + thing + sep
        + "dbtable=" + dbtable + sep
        + "openid=" + openid + sep
        + "oid=" + oid.Replace("'", "") + sep;
        this.DoDb("insert", "log", Fields_Values, "", 0);
    }
    #endregion

    #region 从左往右截取指定长度的字符
    //函数功能：从左往右截取指定长度的字符
    public string left(string str, int i)
    {
        if (i <= str.Length)
            str = str.Substring(0, i);
        return str;
    }
    #endregion

    #region 从右往左截取指定长度的字符
    //函数功能：从右往左截取指定长度的字符
    public string right(string str, int i)
    {
        if (i <= str.Length)
            str = str.Substring(str.Length - i, i);
        return str;
    }
    #endregion

    #region C#里的msgbox提示框
    //C#里的msgbox提示框
    //使用方法
    //DklFuns df = new DklFuns();
    //df.msgbox("这是提示","","");   //仅仅提示
    //df.msgbox("这是提示","gourl","http://www.baidu.com");   //提示后转向链接
    //df.msgbox("这是提示","close","");   //提示后关闭当前页
    public void msgbox(object str, string style, string url)
    {
        System.Web.UI.Page CurPage = (System.Web.UI.Page)HttpContext.Current.Handler;
        System.Web.UI.ClientScriptManager cs = CurPage.ClientScript;
        string waring = "<script language=javascript>";
        waring += "alert('" + str + "');";
        switch (style)
        {
            case "back":
                waring += "history.go(-1);";
                break;
            case "gourl":
                waring += "window.location='" + url + "'";
                break;
            case "close":
                waring += "window.close()";
                break;
            case "back_call":               //对话框后的回调函数,在参数url里.
                waring += url;
                break;
            case "back_refresh":               //返回前一页并刷新
                waring += "wbox_close();history.go(-1);";
                break;
            case "refresh":               //返回前一页并刷新
                waring += "window.location.reload();";
                break;
        }
        waring = waring + "</script>";
        cs.RegisterStartupScript(cs.GetType(), "", waring);
    }
    #endregion

    #region 判断用户是否已登录
    //判断用户是否已登录
    public bool IsLogined()
    {
        if ((System.Web.HttpContext.Current.Session["member"].ToString()).Length == 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    #endregion

    #region 返回按时间+随机生成的文件名
    //返回按时间+随机生成的文件名
    public string ByDateFileName()
    {
        DateTime dateTime = DateTime.Now;
        string DateNumber = Convert.ToString(dateTime.Year) + Convert.ToString(dateTime.Month) + Convert.ToString(dateTime.Day) + Convert.ToString(dateTime.Hour) + Convert.ToString(dateTime.Minute) + Convert.ToString(dateTime.Second);
        DateNumber = DateNumber + RndNum(5);
        return DateNumber;
    }
    #endregion

    #region 操作数据库
    public int DoDb(string OperaTe, string TableName, string Fields_Values, string Condition, int n) //操作数据库
    {
        //功能:操作数据库
        //共4个参数,OperaTe是操作方式,如insert,delete,update;
        //TableName是表名;
        //Fields_Values是字段+值;
        //Condition是条件.
        //n=1时,得到最新id;n=0时,得到受影响行数.
        //dbtype为0时,操作dkl;为1操作kiiids.

        dbConn dbc = new dbConn();
        Object field2 = "";
        string sqls = "";
        string sqlst = "";
        string Field_coll = "";
        string Value_coll = "";
        string[] FV;
        string[] FVin;
        string sep = getsep();
        int DER = -1;

        if (n < 0 && n > 1)
        { n = 1; }

        try
        {
            if (OperaTe == "insert")
            {
                sqls = "insert into " + TableName + "";
                FV = Regex.Split(Fields_Values, sep, RegexOptions.IgnoreCase); //分解字段和值
                for (int i = 0; i < FV.Length; i++)
                {
                    if (FV[i].Length > 1)
                    {
                        FVin = FV[i].Split('=');
                        for (int ii = 2; ii < FVin.Length; ii++)
                        {
                            FVin[1] += "=" + FVin[ii];
                        }
                        Field_coll = Field_coll + Convert.ToString(FVin[0]) + ",";
                        if (Convert.ToString(FVin[1]).ToUpper() == "TRUE" || Convert.ToString(FVin[1]).ToUpper() == "FALSE")
                        {
                            sqlst = "select " + Convert.ToString(FVin[0]) + " from " + TableName;
                            field2 = dbc.Execuse_onlyone(sqlst);
                            if (xlength(field2) > 0)
                            {
                                if (Convert.ToString(field2.GetType()) == "System.Boolean")
                                {
                                    if (Convert.ToString(FVin[1]) == "True")
                                        Value_coll = Value_coll + 1 + ",";
                                    else if (Convert.ToString(FVin[1]) == "False")
                                        Value_coll = Value_coll + 0 + ",";
                                }
                                else
                                    Value_coll = Value_coll + "N'" + Format_single_quotes(Convert.ToString(HttpContext.Current.Server.UrlDecode(FVin[1]))) + "'" + ",";
                            }
                        }
                        else
                            Value_coll = Value_coll + "N'" + Format_single_quotes(Convert.ToString(HttpContext.Current.Server.UrlDecode(FVin[1]))) + "'" + ",";
                    }
                }
                Field_coll = Field_coll.Substring(0, Field_coll.Length - 1);
                Value_coll = Value_coll.Substring(0, Value_coll.Length - 1);
                sqls = sqls + "(" + Field_coll + ")" + " values(" + Value_coll + ");";

                //WriteLog(sqls);
                //ToWrite(sqls);
            }
            else if (OperaTe == "update")
            {
                if (Condition.Length == 0)
                {
                    return -2;  //返回数-1为更新拒绝执行,因为更新和删除可能影响很多记录,必须有条件,如果不需要,可以是1=1,但不可不填
                }
                sqls = "update " + TableName + " set ";
                FV = Regex.Split(Fields_Values, sep, RegexOptions.IgnoreCase); //分解字段和值
                //ToWrite(Fields_Values+"<br>");
                for (int i = 0; i < FV.Length; i++)
                {
                    if (FV[i].Length > 1)
                    {
                        FVin = FV[i].Split('=');
                        for (int ii = 2; ii < FVin.Length; ii++)
                        {
                            FVin[1] += "=" + FVin[ii];
                        }

                        if (Convert.ToString(FVin[1]).ToUpper() == "TRUE" || Convert.ToString(FVin[1]).ToUpper() == "FALSE")
                        {
                            sqlst = "select " + Convert.ToString(FVin[0]) + " from " + TableName;
                            field2 = dbc.Execuse_onlyone(sqlst);
                            if (xlength(field2) > 0)
                            {
                                if (Convert.ToString(field2.GetType()) == "System.Boolean")
                                {
                                    if (Convert.ToString(FVin[1]) == "True")
                                        Field_coll = Field_coll + Convert.ToString(FVin[0]) + "=" + 1 + ",";
                                    else if (Convert.ToString(FVin[1]) == "False")
                                        Field_coll = Field_coll + Convert.ToString(FVin[0]) + "=" + 0 + ",";
                                }
                                else
                                    Field_coll = Field_coll + Convert.ToString(FVin[0]) + "=" + "N'" + Format_single_quotes(Convert.ToString(HttpContext.Current.Server.UrlDecode(FVin[1]))) + "'" + ",";
                            }
                        }
                        else
                            Field_coll = Field_coll + Convert.ToString(FVin[0]) + "=" + "N'" + Format_single_quotes(Convert.ToString(HttpContext.Current.Server.UrlDecode(FVin[1]))) + "'" + ",";
                    }
                }
                Field_coll = Field_coll.Substring(0, Field_coll.Length - 1);
                sqls = sqls + Field_coll + " where " + Condition;
                //ToWrite(sqls);
            }
            else if (OperaTe == "delete")
            {
                if (Condition.Length == 0)
                {
                    return -2;  //返回数-1为更新拒绝执行,因为更新和删除可能影响很多记录,必须有条件,如果不需要,可以是1=1,但不可不填
                }
                sqls = "delete from " + TableName;
                sqls = sqls + " where " + Condition;
                //HttpContext.Current.Response.Write(sqls);
            }

            if (OperaTe == "insert" || OperaTe == "update" || OperaTe == "delete")
            {
                try
                {
                    DER = dbc.Execuse32(sqls, n); //执行并返回受影响数,如果是插入则返回最新id
                    return DER;
                }
                catch
                {
                    return -1;  //返回数-1为出错
                }
            }
            else
            {
                return -3; //不可识别的操作
            }
        }
        finally
        {

        }
    }
    #endregion

    #region 根据返回的受影响记录数或结果判断sql是否执行成功.
    public bool DoDbBack(string opc, int AffRows)  //根据返回的受影响记录数或结果判断sql是否执行成功.
    {
        if (AffRows > 0)
        {
            //HttpContext.Current.Response.Write("<script>alert("+opc + "记录成功."+")</script>");
            return true;
        }
        if (AffRows == 0)
        {
            ToWrite("没有记录受到影响.");
            return false;
        }
        else if (AffRows == -1)
        {
            ToWrite(opc + "记录失败,请联系管理员报错.");
            return false;
        }
        else if (AffRows == -2)
        {
            ToWrite("无限制条件拒绝执行SQL语句,请检查语句.");
            return false;
        }
        else if (AffRows == -3)
        {
            ToWrite("不可识别的操作,请检查语句.");
            return false;
        }
        return true;
    }
    #endregion

    #region 发送短信
    public void sendsms(string url)  //发送短信
    {
        WebClient wc = new WebClient();
        wc.Credentials = CredentialCache.DefaultCredentials;
        Byte[] pageData = wc.DownloadData(url);
    }
    #endregion

    #region 保存模块id到cookie,以便相应的标识.
    //保存模块id到cookie,以便相应的标识.
    public void savebtn(int b)
    {
        setcookie("btn", Convert.ToString(b), 1);
    }
    #endregion

    #region 查询分页存储过程1,无distinct,参数如下
    //tablename,            --表名
    //fields,               --字段名(全部字段为*)
    //orderstr,             --排序字段(必须!支持多字段不用加order by)
    //@condition,           --条件语句(不用加where)
    //@pagesize,            --每页多少条记录
    //PageIndex             --第几页
    //@totalrecord          --返回总记录数
    public SqlDataReader drcollect(string tablename, string fields, string orderstr, string condition, Int32 pagesize, Int32 pageindex, out Int32 totalrecord)
    {
        SqlDataReader drcet;
        SqlConnection conn = new dbConn().dklConnectDo();
        SqlCommand cmd;

        cmd = new SqlCommand("proce_pagechange", conn);
        cmd.CommandType = CommandType.StoredProcedure;

        //如果存储过程有带参数的话,就如下为参数赋值         

        cmd.Parameters.AddWithValue("@TableName", tablename);
        cmd.Parameters.AddWithValue("@ReFieldsStr", fields);
        if (xlength(orderstr) == 0)
        {
            cmd.Parameters.AddWithValue("@OrderString", "order_num desc,id desc");   //默认排序是按排序号大到小,id大小
        }
        else
        {
            cmd.Parameters.AddWithValue("@OrderString", orderstr);
        }
        cmd.Parameters.AddWithValue("@WhereString", condition);
        cmd.Parameters.AddWithValue("@PageSize", pagesize);
        cmd.Parameters.AddWithValue("@PageIndex", pageindex);
        cmd.Parameters.Add(new SqlParameter("@TotalRecord", SqlDbType.Int));
        //cmd.Parameters.AddWithValue("@TotalRecord", totalrecord);
        cmd.Parameters["@TotalRecord"].Direction = ParameterDirection.Output;
        //cmd.Parameters["Returnvalue"].Direction = ParameterDirection.ReturnValue;

        //WriteLog(condition);

        drcet = cmd.ExecuteReader();

        drcet.NextResult();
        totalrecord = (int)cmd.Parameters["@TotalRecord"].Value;

        drcet.Dispose();
        drcet = cmd.ExecuteReader();
        return drcet;
    }
    #endregion

    ///设置分页里的页码
    ///pageindex:客户端传来的页码
    ///徐进钊
    ///2014-11-29
    public int SetIndex(string pageindex)
    {
        if (xlength(pageindex) > 0 && IsNum(pageindex) == true)
        {
            return Convert.ToInt32(pageindex);   //当前页码
        }
        else
        {
            return 1;
        }
    }


    #region 查询分页存储过程2,distinct,参数如下
    //tablename,            --表名
    //fields,               --字段名(全部字段为*)
    //orderstr,             --排序字段(必须!支持多字段不用加order by)
    //@condition,           --条件语句(不用加where)
    //@pagesize,            --每页多少条记录
    //PageIndex             --第几页
    //dist                  --是否使用DISTINCT
    //action                --0表示返回查询结果和总数，1表示只返回查询结果，2表示只返回总数
    //@totalrecord          --返回总记录数
    public SqlDataReader drcollect2(string tablename, string fields, string orderstr, string condition, Int32 pagesize, Int32 pageindex, bool dist, Int32 action, out Int32 totalrecord)
    {
        SqlDataReader drcet;
        SqlConnection conn = new dbConn().dklConnectDo();
        SqlCommand cmd;

        cmd = new SqlCommand("P_CommonPagination", conn);
        cmd.CommandType = CommandType.StoredProcedure;

        //如果存储过程有带参数的话,就如下为参数赋值         

        cmd.Parameters.AddWithValue("@Table", tablename);
        cmd.Parameters.AddWithValue("@Fields", fields);
        cmd.Parameters.AddWithValue("@Order", orderstr);
        cmd.Parameters.AddWithValue("@Where", condition);
        cmd.Parameters.AddWithValue("@PageSize", pagesize);
        cmd.Parameters.AddWithValue("@PageIndex", pageindex);

        cmd.Parameters.AddWithValue("@UseDistinct", dist);
        cmd.Parameters.AddWithValue("@Action", action);

        cmd.Parameters.Add(new SqlParameter("@TotalCount", SqlDbType.Int));
        //cmd.Parameters.AddWithValue("@TotalRecord", totalrecord);
        cmd.Parameters["@TotalCount"].Direction = ParameterDirection.Output;
        //cmd.Parameters["Returnvalue"].Direction = ParameterDirection.ReturnValue;

        drcet = cmd.ExecuteReader();

        drcet.NextResult();
        totalrecord = (int)cmd.Parameters["@TotalCount"].Value;

        drcet.Dispose();
        drcet = cmd.ExecuteReader();
        return drcet;
    }
    #endregion

    #region 查询分页存储过程3,支持group by,参数如下
    //作者：徐进钊
    //日期：2013-8-5
    //查询分页存储过程3,支持group by,参数如下
    //@TableName varchar(100),                  -- 表名  
    //@GetFields varchar(4000) = '*',              -- 字段名(全部字段为*)  
    //@OrderField varchar(3000),                -- 排序字段(必须!支持多字段)  
    //@WhereCondition varchar(5000) = Null,     -- 条件语句(不用加where) 
    //@PageIndex int = 1 ,                      -- 指定当前为第几页  
    //@PageSize int = 20,                       -- 每页多少条记录   
    //@GroupBy varchar(200),	                --分组语句(不用加Group by)
    //@RecordCount int = 0 output               --返回总记录条数
    public SqlDataReader drcollect3(string tablename, string fields, string OrderField, string WhereCondition, Int32 pageindex, Int32 pagesize, string GroupBy, out Int32 RecordCount)
    {
        SqlDataReader drcet;
        SqlConnection conn = new dbConn().dklConnectDo();
        SqlCommand cmd;

        cmd = new SqlCommand("sp_PageList2008", conn);
        cmd.CommandType = CommandType.StoredProcedure;

        //如果存储过程有带参数的话,就如下为参数赋值         

        cmd.Parameters.AddWithValue("@TableName", tablename);
        cmd.Parameters.AddWithValue("@GetFields", fields);
        cmd.Parameters.AddWithValue("@OrderField", OrderField);
        cmd.Parameters.AddWithValue("@WhereCondition", WhereCondition);
        cmd.Parameters.AddWithValue("@PageIndex", pageindex);
        cmd.Parameters.AddWithValue("@PageSize", pagesize);
        cmd.Parameters.AddWithValue("@GroupBy", GroupBy);

        cmd.Parameters.Add(new SqlParameter("@RecordCount", SqlDbType.Int));
        cmd.Parameters["@RecordCount"].Direction = ParameterDirection.Output;

        drcet = cmd.ExecuteReader();

        drcet.NextResult();
        RecordCount = (int)cmd.Parameters["@RecordCount"].Value;

        drcet.Dispose();
        drcet = cmd.ExecuteReader();

        return drcet;
    }
    #endregion

    #region 执行sql返回table
    //例子:dr = drtable(conn,sqls);
    public SqlDataReader drtable(SqlConnection cn, string sqls)
    {
        try
        {
            SqlCommand cmd = new SqlCommand(sqls, cn);
            SqlDataReader drt = cmd.ExecuteReader();
            cmd.Dispose();
            return drt;
        }
        catch
        {
            return null;
        }
    }
    #endregion

    #region 参数化查询返回记录集
    //作者：刘俊研
    //日期：2014-08-21
    //功能：参数化查询返回记录集
    //示例：sqls = "select nickname,uid from member where (nickname=@usernm or mobi=@usernm  or email=@usernm ) and password=@passwd and status='激活'";
    //     dr = df.Pdrtable(conn, sqls, "@usernm{!|!}值{!|!}type{!|!}NULL or Int", "@password{!|!}值{!|!}type{!|!}NULL or Int")
    public SqlDataReader Pdrtable(SqlConnection conn, string sqls, params string[] par)
    {
        dbConn dbc = new dbConn();
        SqlCommand cmd = new SqlCommand();
        string[] arr;
        try
        {
            cmd.Connection = conn;
            cmd.CommandText = sqls;
            foreach (string pars in par)
            {
                arr = Regex.Split(pars, @"\{\!\|\!\}", RegexOptions.IgnoreCase);
                cmd.Parameters.Add(new SqlParameter(arr[0], dbc.Get_SDT(arr[2]), int.Parse(arr[3])) { Value = arr[1] });
            }
            SqlDataReader drt = cmd.ExecuteReader();
            cmd.Dispose();
            return drt;
        }
        finally
        {
            cmd.Dispose();
        }
    }
    #endregion

    #region 用于计算字符串中某个字符出现的次数
    //作者:刘俊研
    //日期:2013-3-21
    //功能:用于计算字符串中某个字符出现的次数
    //参数:source包括的字符串,target要查找次数的字符串
    //例子:Count_Char("abac","a")
    public int Count_Char(string source, string target)
    {
        int i, num = 0, len;
        len = target.Length;
        string soc;
        if (target.Length == 1)
        {
            for (i = 0; i < source.Length; i++)
            {
                if (len != 0)
                {
                    soc = source.Substring(i, 1);
                    if (target == soc)
                    {
                        num++;
                    }
                }
            }
        }
        else
        {
            for (i = 0; i <= source.Length - len; i++)
            {
                if (len != 0)
                {
                    soc = source.Substring(i, len);
                    if (target == soc)
                    {
                        num++;
                    }
                }
            }
        }
        return num;
    }
    #endregion

    #region 检查用户是否存在数据库里
    //检查用户是否存在数据库里
    public bool checkuid(string uid)
    {
        if (xlength(uid) <= 0)
            return false;
        else
        {
            dbConn dbc = new dbConn();
            string sqls = "select uid from member where uid='" + uid + "'";
            if (dbc.Execuse_iCount(sqls) > 0)
                return true;
            else
                return false;
        }
    }
    #endregion

    #region 查看活动人数是否超限
    //查看活动人数是否超限
    public bool checklimitnum(string aid)
    {
        if (xlength(aid) <= 0 || aid == "0")
            return false;

        dbConn dbc = new dbConn();
        string sqls1 = "select count(*) from activemember where aid=" + aid;
        string sqls2 = "select limit_num from active where id=" + aid;

        Int32 limit_num = Convert.ToInt32(dbc.Execuse_onlyone(sqls2));

        if (limit_num > 0)
        {
            if ((Convert.ToInt32(dbc.Execuse_onlyone(sqls1)) + 1) > limit_num)
                return false;
            else
                return true;
        }
        return true;
    }
    #endregion

    #region 将手机号或者邮箱号部分替换成*,手机号(139****7788)四位，邮箱(1234****@qq.com)@前四位。
    //作者：刘俊研 
    //日期：2013-05-17
    //功能：将手机号或者邮箱号部分替换成*,手机号(139****7788)四位，邮箱(1234****@qq.com)@前四位。
    public string format_star(string str)
    {
        if (str.IndexOf("@") > 0) //隐藏邮箱
        {
            string[] arrstr = str.Split('@');
            if (arrstr[0].Length >= 4)
            {
                string tmp = str.Substring(str.IndexOf("@") - 4, 4);
                str = str.Replace(tmp, "****");
                return str;
            }
            else if (arrstr[0].Length == 3)
            {
                string tmp = str.Substring(str.IndexOf("@") - arrstr[0].Length, arrstr[0].Length);
                str = str.Replace(tmp, "***");
                return str;
            }
            else
                return str;
        }
        else if (str.Length == 11)  //隐藏手机号
        {
            string tmp = str.Substring(3, 4);
            str = str.Replace(tmp, "****");
            return str;
        }
        else
            return str;
    }
    #endregion

    #region 根据id得到发贴者
    //根据id得到发贴者
    public string get_thread_creator(string id)
    {
        if (xlength(id) <= 0)
            return "";
        string sqls = "select uid from threads where id=" + id;
        dbConn dbc = new dbConn();
        return dbc.Execuse_onlyone(sqls);
    }
    #endregion

    #region 根据id得到贴子回复者
    //根据id得到贴子回复者
    public string get_post_creator(string id)
    {
        if (xlength(id) <= 0)
            return "";
        string sqls = "select uid from posts where id=" + id;
        dbConn dbc = new dbConn();
        return dbc.Execuse_onlyone(sqls);
    }
    #endregion

    #region 添加选项到下拉框,如果已存在则不添加,已免重复
    //作者:徐进钊
    //日期:2013-10-17
    //功能:添加选项到下拉框,如果已存在则不添加,已免重复
    //参数:droplist:网页的下拉对象;val:值;text:文字.
    //参数:droplist_add(dropdownlist1,"1","平湖分站")
    public void droplist_add(HtmlSelect droplist, string val, string text)
    {
        bool f = false;
        ListItem item = new ListItem();

        for (int i = 0; i < droplist.Items.Count; i++)
        {
            if (droplist.Items[i].Value == val && droplist.Items[i].Text == text.Trim())
            {
                f = true;  //已存在该值
                break;
            }
        }

        if (f == false)
        {
            item = new ListItem(text, val);
            droplist.Items.Add(item);
        }
    }
    public void droplist_add1(HtmlSelect droplist, string val, string text)
    {
        bool f = false;
        ListItem item = new ListItem();

        for (int i = 0; i < droplist.Items.Count; i++)
        {
            if (droplist.Items[i].Value == val && droplist.Items[i].Text == text.Trim())
            {
                f = true;  //已存在该值
                break;
            }
        }

        if (f == false)
        {
            item = new ListItem(text, val);
            droplist.Items.Add(item);
        }
    }
    #endregion

    #region 从已有的选项里选择默认值
    //作者:徐进钊
    //日期:2013-10-17
    //功能:从已有的选项里选择默认值
    //参数:droplist:网页的下拉对象;val:值;text:文字.
    //参数:droplist_select(dropdownlist1,"1","平湖分站")
    public void droplist_select(HtmlSelect droplist, string val, string text)
    {
        for (int i = 0; i < droplist.Items.Count; i++)
        {
            if (droplist.Items[i].Value == val && droplist.Items[i].Text == text)
            {
                droplist.SelectedIndex = i;  //选择该选项
                break;
            }
        }
    }
    public void droplist_select1(HtmlSelect droplist, string val, string text)
    {
        for (int i = 0; i < droplist.Items.Count; i++)
        {
            if (droplist.Items[i].Value == val && droplist.Items[i].Text == text)
            {
                droplist.SelectedIndex = i;  //选择该选项
                break;
            }
        }
    }
    #endregion

    #region 关键字高亮显示
    //作者:徐进钊
    //日期:2013-9-30
    //功能:关键字高亮显示
    //参数:keycontent:原始内容;k:关键字，支持多关键字,多个用空格分隔;css:高亮显示的css类.
    //例子:Highlight("abce", "a c", "FF0000") 
    public string Highlight(string keycontent, string k, string css)
    {
        string resultstr = keycontent;

        if (xlength(keycontent) <= 0 || xlength(k) <= 0)
            return resultstr;

        if (k.Trim().IndexOf(' ') > 0)
        {
            string[] myArray = k.Split(' ');
            for (int i = 0; i < myArray.Length; i++)
            {
                resultstr = resultstr.Replace(myArray[i].ToString(), "<span class='hlc'>" + myArray[i].ToString() + "</span>");
            }
            return resultstr;
        }
        else
        {
            return resultstr.Replace(k, "<span class='hlc'>" + k + "</span>");
        }
    }
    #endregion

    #region 获得sep的值
    //sep的值
    public string getsep()
    {
        return ConfigurationManager.AppSettings["sep"];
    }
    #endregion

    #region 获得当前网站状态,开发为1,发布为0
    //获得当前网站状态,开发为1,发布为0
    public string getdeveloping()
    {
        return ConfigurationManager.AppSettings["developing"];
    }
    #endregion

    #region 成员加入活动
    //成员加入活动
    //返回true表示加入成功或已加入
    //返回false表示加入失败
    public bool join_ative(string aid, string uid)
    {
        string ap_flag = ""; //是否需要申请的标志
        string sep = getsep();
        string Fields_Values = "";
        int AffRows = 0;

        if (xlength(aid) <= 0 || xlength(uid) <= 0)
        {
            return false;
        }

        string sqls = "select id from activemember where uid='" + uid + "' and aid='" + aid + "'";
        dbConn dbc = new dbConn();
        if (dbc.Execuse_iCount(sqls) > 0)
        {
            return true;
        }

        //查看该活动是否要申请
        sqls = "select ap_flag from active where id=" + aid + "";
        ap_flag = dbc.Execuse_onlyone(sqls);

        Fields_Values = ""
        + "aid=" + aid + sep
        + "uid=" + uid + sep;
        if (ap_flag == "True")
        {
            Fields_Values += "status=" + "冻结" + sep;
        }
        AffRows = DoDb("insert", "activemember", Fields_Values, "", 0);
        if (AffRows > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    #endregion

    #region 检查当前uid是否为活动成员
    public bool checkua(string uid, string aid)
    {
        if (xlength(uid) <= 0 || xlength(aid) <= 0)
        {
            return false;
        }
        dbConn dbc = new dbConn();
        string sqls = "select id from activemember where uid='" + uid + "' and aid='" + aid + "' and status='激活'";
        if (dbc.Execuse_iCount(sqls) > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    #endregion

    #region 加上勋章

    //加上勋章
    public string medal(string uid)
    {
        SqlConnection conn = new dbConn().dklConnectDo();
        SqlDataReader dr;
        dbConn dbc = new dbConn();
        string sqls = "";
        string OutHtml = "";
        TimeSpan ts = new TimeSpan();

        try
        {
            if (xlength(uid) <= 0)
                return "";
            else
            {
                sqls = "select * from member_medal where status='激活' and uid=" + uid;
                dr = drtable(conn, sqls);
                while (dr.Read())
                {
                    if (xlength(dr["medal"].ToString()) > 0)
                    {
                        if (dr["category"].ToString() == "永久")
                        {
                            sqls = "select icon from medal where category='" + dr["medal"].ToString() + "'";
                            OutHtml += "<img alt='" + dr["medal"].ToString() + "' title='" + dr["medal"].ToString() + "' src='" + dbc.Execuse_onlyone(sqls) + "'>";
                        }
                        else
                        {
                            ts = Convert.ToDateTime(dr["enddatetime"].ToString()) - Convert.ToDateTime(DateTime.Now);
                            if (left(ts.TotalSeconds.ToString(), 1) != "-")   //还没有过期
                            {
                                sqls = "select icon from medal where category='" + dr["medal"].ToString() + "'";
                                OutHtml += "<img alt='" + dr["medal"].ToString() + "' title='" + dr["medal"].ToString() + "' src='" + dbc.Execuse_onlyone(sqls) + "'>";
                            }
                        }
                    }
                }
                dbc.CloseConn(conn);
                return OutHtml;
            }
        }
        catch
        {
            dbc.CloseConn(conn);
            return "0";
        }
        finally
        {
            dbc.CloseConn(conn);
        }
    }
    #endregion

    #region 检查活动状态 冻结/激活
    //检查活动状态 冻结/激活
    public bool get_active_status(string aid)
    {
        if (xlength(aid) <= 0 || aid == "0")
            return false;
        dbConn dbc = new dbConn();
        string sqls = "select re_flag from active where id='" + aid + "'";
        if (dbc.Execuse_onlyone(sqls) == "False")
        {
            return false;
        }
        else
        {
            return true;
        }
    }
    #endregion

    #region 后台验证是否登录
    //作者:刘俊研
    //日期:2014-1-10
    //功能:后台验证是否登录
    public void check_login()
    {
        string uid = GetUid();
        if (xlength(uid) <= 0)
        {
            delcookie("EF586FA914C811BF3EF586FA914C81BB56929646A");
            HttpContext.Current.Response.Redirect("/dp_cms/login.aspx");
        }
    }
    #endregion

    #region 获得解密后的UID
    //获得解密后的UID
    public string GetUid()
    {
        AES aes = new AES();
        try
        {
            if (getdeveloping() == "1")
            {
                return "4";
            }
            return aes.DecryptAES(getcookie("EF586FA914C811BF3EF586FA914C81BB56929646A").Replace(GetAttach(), ""), GetAESKey());
        }
        catch
        {
            return "";
        }
    }
    #endregion

    #region 获得解密后的openid
    //获得解密后的openid
    public string GetOpenID()
    {
        //return "ofcxBtz96Dp-9in45KRfttkyNT9U";  //由于没有高级接口.暂时用这个
        AES aes = new AES();
        string openid = "";
        try
        {
            if (getdeveloping() == "1")
            {
                if (xlength(getcookie("testopenid")) > 0)
                {
                    return getcookie("testopenid");
                }
                return "ofcxBtz96Dp-9in45KRfttkyNT9U";
            }

            openid = aes.DecryptAES(getcookie("openid").Replace(GetAttach(), ""), GetAESKey());
            if (xlength(openid) > 20)
            {
                dbConn dbc = new dbConn();
                string sqls = "select uid from member where openid='" + openid + "'";
                if (dbc.Execuse_iCount(sqls) <= 0)
                {
                    wx.get_personal_info(openid);
                    log("关注未获取个人信息，已补偿获取", "", "member", openid);  //写日志
                }
                return openid;
            }
            else
                return "";
        }
        catch
        {
            return "";
        }
    }
    #endregion

    #region 设置openid
    //设置openid
    public void SetOpenID(string openid)
    {
        AES aes = new AES();
        try
        {
            if (xlength(openid) > 20)
            {
                openid = aes.EncryptAES(openid, GetAESKey()) + GetAttach();
                setcookie("openid", openid, 10000);
            }
        }
        catch
        { }
    }
    #endregion

    #region 设置管理员uid
    //设置管理员uid
    public void SetUid(string uid)
    {
        AES aes = new AES();
        try
        {
            uid = aes.EncryptAES(uid, GetAESKey()) + GetAttach();
            setcookie("EF586FA914C811BF3EF586FA914C81BB56929646A", uid, 10000);
        }
        catch
        { }
    }
    #endregion

    #region 获得AES密钥
    //获得AES密钥
    public string GetAESKey()
    {
        return ConfigurationManager.AppSettings["cookiekey"];
    }
    #endregion

    #region 获得attach cookie附加符
    //获得attach cookie附加符
    public string GetAttach()
    {
        return ConfigurationManager.AppSettings["attach"];
    }
    #endregion

    #region Token的值
    //Token的值
    public string getToken()
    {
        return ConfigurationManager.AppSettings["Token"];
    }
    #endregion

    #region 获取微信名称
    //获取微信名称
    public string getstation_name()
    {
        return ConfigurationManager.AppSettings["station_name"];
    }
    #endregion

    #region 获取微信后台管理路径
    //获取微信名称
    public string GetAdminPath()
    {
        return ConfigurationManager.AppSettings["adminpath"];
    }
    #endregion

    #region appid的值
    //appid的值
    public string getAppid()
    {
        return ConfigurationManager.AppSettings["appid"];
    }
    #endregion

    #region Secret的值
    //Secret的值
    public string getAppSecret()
    {
        return ConfigurationManager.AppSettings["AppSecret"];
    }
    #endregion

    #region unix时间转换成日期时间
    //作者:徐进钊
    //日期:2014-1-11
    //功能:unix时间转换成日期时间
    //例子:unix2dt("1389279838"),返回:2014-1-9 23:03:58
    public string unix2dt(string timeStamp)
    {
        DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1));
        long lTime = long.Parse(timeStamp + "0000000");
        TimeSpan toNow = new TimeSpan(lTime);
        DateTime dtResult = dtStart.Add(toNow);
        return dtResult.ToString();
    }
    #endregion

    #region 根据日期获得周几
    //作者：徐进钊
    //日期：2014-01-15
    //功能：根据日期获得周几
    public string getweekday(string datetime)
    {
        string weekday1 = "";
        if (xlength(datetime) > 0)
        {
            weekday1 = (DateTime.Parse(datetime).DayOfWeek).ToString();

            switch (weekday1)
            {
                case "Monday": weekday1 = "周一"; break;
                case "Tuesday": weekday1 = "周二"; break;
                case "Wednesday": weekday1 = "周三"; break;
                case "Thursday": weekday1 = "周四"; break;
                case "Friday": weekday1 = "周五"; break;
                case "Saturday": weekday1 = "周六"; break;
                case "Sunday": weekday1 = "周日"; break;
                default: weekday1 = ""; break;
            }
            return weekday1;
        }
        else
        {
            return "";
        }
    }
    #endregion

    #region 如果字符不合法,则返回数字0,否则返回该字符串转化的数值
    //作者：徐进钊
    //日期：2014-01-15
    //功能：如果字符不合法,则返回数字0,否则返回该字符串转化的数值
    public Int32 Str2Num(string num)
    {
        if (num == null)
        {
            return 0;
        }
        else if (xlength(num) <= 0)
        {
            return 0;
        }
        else if (IsNum(num) == true)
        {
            return Convert.ToInt32(num);
        }
        else
        {
            return 0;
        }
    }
    #endregion

    #region 根据值显示男或女或未知,也可以显示图片
    //根据值显示男或女或未知,也可以显示图片
    public string sex(string val)
    {
        if (val == "1" || val == "男")
        {
            return "<img src='/images/gender-m.png' class='icon20X20'>";
        }
        else if (val == "2" || val == "女")
        {
            return "<img src='/images/gender-f.png' class='icon20X20'>";
        }
        else
        {
            return "<img src='/images/none-03.png' class='icon20X20'>";
        }
    }
    #endregion

    #region 网址路径,放在此可方便更换,转移系统
    //徐进钊
    //2014-4-29
    //网址路径,放在此可方便更换,转移系统
    public string getrooturl()
    {
        return ConfigurationManager.AppSettings["rooturl"];
    }
    #endregion

    #region 活动截止期
    //徐进钊
    //2014-4-29
    //活动截止期
    public string GetEx_date()
    {
        return ConfigurationManager.AppSettings["ex_date"];
    }
    #endregion

    #region 占位机器人开关
    //徐进钊
    //2014-4-29
    //占位机器人开关
    public string GetSwith()
    {
        return ConfigurationManager.AppSettings["swith"];
    }
    #endregion

    #region 检查页面是否存在openid的cookies，不存在即授权写入cookies
    //作者:刘俊研
    //日期:2014-1-15
    //功能:检查页面是否存在openid的cookies，不存在即授权写入cookies
    public void check_oauth2_openid(string saveurl)
    {
        //return; //由于暂时没有高级接口,这里返回真
        if (getdeveloping() == "1")
        {
            return;
        }
        string openid = GetOpenID();
        string url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + getAppid() + "&redirect_uri=" + getrooturl() + "/oauth2.aspx&response_type=code&scope=snsapi_base&state=" + saveurl + "#wechat_redirect";
        if (xlength(openid) <= 20)
        {
            HttpContext.Current.Response.Redirect(url);
        }
    }
    #endregion

    //作者:徐进钊
    //日期:2014-1-11
    //功能:获得访问令牌
    public string get_access_token()
    {
        dbConn dbc = new dbConn();
        string htmlstr;
        string sqls = "";
        string access_token = "";

        try
        {
            //XmlHandler xh = new XmlHandler();
            //string xml = HttpContext.Current.Server.MapPath("jdk_cache.xml");
            //string token = xh.ReadXmlReturnNode(xml, "tokenval");
            //string tokendate = xh.ReadXmlReturnNode(xml, "tokendate");
            //try
            //{
            //    if (DateTime.Now >= DateTime.Parse(tokendate))
            //    {
            //        DateTime _pasttime = DateTime.Now.AddSeconds(7200);
            //        xh.XmlNodeReplace(xml, "jdk/item/tokendate", _pasttime.ToString());
            //    }
            //}
            //catch
            //{
            //    DateTime _pasttime = DateTime.Now.AddSeconds(7200);
            //    xh.XmlNodeReplace(xml, "jdk/item/tokendate", _pasttime.ToString());
            //}
            sqls = "select access_token from access_token where datetime>'" + DateTime.Now + "'";
            access_token = dbc.Execuse_onlyone(sqls);
            if (xlength(access_token) <= 0)   //当前访问令牌已过期,需要重新获取
            {
                WebClient wc = new WebClient();
                wc.Credentials = CredentialCache.DefaultCredentials;
                Byte[] pageData = wc.DownloadData("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + getAppid() + "&secret=" + getAppSecret());
                htmlstr = System.Text.Encoding.Default.GetString(pageData);
                access_token = get_json(htmlstr, "access_token");
                sqls = "delete from access_token;insert into access_token(access_token,datetime)values('" + access_token + "','" + DateTime.Now.AddSeconds(7200) + "')";
                dbc.Execuse32(sqls, 0);
            }
            return access_token;
        }
        catch
        {
            return "";
        }
    }

    #region 检查当前openid是否为班级成员
    //作者:徐进钊
    //日期:2014-1-17
    //功能:检查当前openid是否为班级成员
    public bool checkus(string openid, string cid)
    {
        if (xlength(openid) <= 0 || xlength(cid) <= 0)
        {
            return false;
        }
        dbConn dbc = new dbConn();
        string sqls = "select id from apply where openid='" + openid + "' and xid='" + cid + "' and category='班级' and status='激活'";
        if (dbc.Execuse_iCount(sqls) > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    #endregion

    #region 计算两点间距离返回是米为单位
    //作者:徐进钊
    //日期:2014-1-19
    //功能:计算两点间距离返回是米为单位
    public double CalcDistance(Point from, Point to)
    {
        double rad = 6371; //Earth radius in Km
        double p1X = from.X / 180 * Math.PI;
        double p1Y = from.Y / 180 * Math.PI;
        double p2X = to.X / 180 * Math.PI;
        double p2Y = to.Y / 180 * Math.PI;
        double Distance = 0;

        Distance = (Math.Acos(Math.Sin(p1Y) * Math.Sin(p2Y) + Math.Cos(p1Y) * Math.Cos(p2Y) * Math.Cos(p2X - p1X)) * rad) * 1000;
        return Distance;
    }
    #endregion

    #region 千米友好显示
    //作者:徐进钊
    //日期:2014-1-19
    //功能:千米友好显示
    public string formatKM(double km)
    {
        if (km < 1000)
        {
            return String.Format("{0:N0}", km) + "米";
        }
        else
        {
            km = km / 1000;
            return String.Format("{0:N2}", km) + "千米";
        }
    }
    #endregion

    #region 黑名单即告知冻结的用户相关信息并不能进行访问
    //作者:刘俊研
    //日期:2014-01-23
    //功能:黑名单即告知冻结的用户相关信息并不能进行访问
    public bool check_status(string openid)
    {
        try
        {
            dbConn dbc = new dbConn();
            if (xlength(openid) < 20)
            {
                return false;
            }
            string sqls = "select status from member where openid='" + openid + "'";
            string status = dbc.Execuse_onlyone(sqls);
            if (status == "冻结")
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        catch
        {
            return false;
        }
    }
    #endregion

    #region 查找字符串A是否与B中的某一个字符串相同,若有则返回true,否则返回false
    //作者：徐进钊
    //日期：2013-09-25
    //功能：查找字符串A是否与B中的某一个字符串相同,若有则返回true,否则返回false
    //参数：a2为字符串A,bs2为字符串B,B里的字符串词间必须以,隔开.
    //例子：include("ab","23,hu,ab")返回true
    public bool include(string a2, string bs2)
    {
        string[] array;
        if (bs2.IndexOf(",") >= 0)
        {
            array = bs2.Split(',');
            for (Int32 i = 0; i < array.Length; i++)
            {
                if (a2 == array[i])
                {
                    return true;
                }
            }
        }
        else
        {
            if (a2 == bs2)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        return false;
    }
    #endregion

    #region 检查该openid是否是学员,真是学员,否则不是学员
    //作者:徐进钊
    //日期:2014-02-09
    //功能:检查该openid是否是学员,真是学员,否则不是学员
    public bool check_vip(string openid)
    {
        try
        {
            //return true;  //全返回真，方便02-14号检查 by weiis
            dbConn dbc = new dbConn();
            if (xlength(openid) < 20)
                return false;
            string sqls = "select distinct openid from apply where category='班级' and status='激活' and openid='" + openid + "'";
            if (dbc.Execuse_iCount(sqls) > 0)
                return true;
            else
                return false;
        }
        catch
        {
            return false;
        }
    }
    #endregion

    #region 积分系统操作 增加 扣除 统计
    //作者：刘俊研
    //时间：2014-04-14 16:30
    //功能：增加会员指定的积分
    //参数：point = 所需增加的积分(正整数)，remark = 增加事由，参数缺一不可
    //返回值：-1为“参数有空值”,ok为“扣除成功”,no为“数据库操作失败或积分不足”
    public string points(string openid, int point, string remark)
    {
        if (xlength(openid) > 20 && xlength(point) > 0 && xlength(remark) > 0)
        {
            if (point >= 0)
            {
                dbConn dbc = new dbConn();
                string sqls = "insert into points_detail(openid,point,remark) values ('" + openid + "'," + point + ",'" + remark + "')";
                if (dbc.Execuse32(sqls, 0) > 0)
                {
                    log(remark + "增加积分:+" + point, "0", "points_detail", openid);
                    return "ok";
                }
                else
                {
                    log(remark + "增加积分:+" + point + "，失败。", "0", "points_detail", openid);
                    return "no";
                }
            }
            else
            {
                if (count_points(openid) > 0 && count_points(openid) >= point) //积分是否够抵扣
                {
                    point = point * -1;
                    dbConn dbc = new dbConn();
                    string sqls = "insert into points_detail(openid,point,remark) values ('" + openid + "'," + point + ",'" + remark + "')";
                    if (dbc.Execuse32(sqls, 0) > 0)
                    {
                        log(remark + "扣除积分:" + point, "0", "points_detail", openid);
                        return "ok";
                    }
                    else
                    {
                        log(remark + "扣除积分:" + point + "，失败。", "0", "points_detail", openid);
                        return "no";
                    }
                }
                else
                {
                    log(remark + "积分不足，扣除积分:" + point + "，失败。", "0", "points_detail", openid);
                    return "no";
                }
            }
        }
        else
            return "-1";
    }

    //作者：刘俊研
    //时间：2014-04-14 16:30
    //功能：统计指定openid会员的积分
    //参数：openid = 会员的openid，参数缺一不可
    //返回值：-1为出错
    public int count_points(string openid)
    {
        if (xlength(openid) > 20)
        {
            dbConn dbc = new dbConn();
            //string sqls = "select case when len(sum(point))>0 then sum(point) else 0 end from points_detail where openid='" + openid + "' and status='激活'";
            string sqls = "select credit from member where openid='" + openid + "' and status='激活'";
            if (dbc.Execuse_iCount(sqls) > 0)
                return Int32.Parse(dbc.Execuse_onlyone(sqls));
            else
                return -1;
        }
        else
            return -1;
    }
    #endregion

    #region 根据openid获是用户的真名或微信名
    //作者:徐进钊
    //日期:2014-02-09
    //功能:根据openid获是用户的真名或微信名
    public string GetName(string openid)
    {
        try
        {
            dbConn dbc = new dbConn();
            if (xlength(openid) < 20)
                return "";
            string sqls = "select case when (len(truename)>0) then truename else wxname end as nickname from member where openid='" + openid + "'";
            if (xlength(dbc.Execuse_onlyone(sqls)) > 0)
                return dbc.Execuse_onlyone(sqls);
            else
                return "";
        }
        catch
        {
            return "";
        }
    }
    #endregion

    #region 微信用的时间函数
    public int ConvertDateTimeInt(System.DateTime time)
    {
        System.DateTime startTime = TimeZone.CurrentTimeZone.ToLocalTime(new System.DateTime(1970, 1, 1));
        return (int)(time - startTime).TotalSeconds;
    }
    #endregion

    #region 写日志(用于跟踪)
    //引用:WriteLog("responseMsg:----");  
    public void WriteLog(string strMemo)
    {
        if (getdeveloping() != "1")
        {
            //return;
        }
        string filename = HttpContext.Current.Server.MapPath("/log.txt");
        StreamWriter sr = null;
        try
        {
            if (!File.Exists(filename))
            {
                sr = File.CreateText(filename);
            }
            else
            {
                sr = File.AppendText(filename);
            }
            sr.WriteLine(Convert.ToString(DateTime.Now) + " --- " + strMemo + "<br>");
        }
        catch
        {
        }
        finally
        {
            if (sr != null)
            {
                sr.Close();
            }
        }
    }
    #endregion

    #region 检查文件是否存在
    //刘俊研
    //2014-8-23
    public bool IsFile(string filePath)
    {
        try
        {
            filePath = filePath.Replace("../", "");
            return File.Exists(HttpContext.Current.Server.MapPath(filePath));
        }
        catch
        {
            return false;
        }
    }
    #endregion

    #region 记录的icon
    //徐进钊
    //2014-8-27
    public string record_icon()
    {
        return "<span class='glyphicon glyphicon-tint'></span>";
    }
    #endregion

    ///中文编码,防乱码,效果同HttpUtility.UrlEncode,但会简化引用
    ///徐进钊
    ///2014-09-16
    public string Ecode(string str)
    {
        str = HttpUtility.UrlEncode(str, Encoding.UTF8);
        return str;
    }

    ///中文解码url编码,防乱码,效果同HttpUtility.UrlDecode,但会简化引用
    ///徐进钊
    ///2014-09-16
    public string Dcode(string str)
    {
        str = HttpUtility.UrlDecode(str);
        return str;
    }

    ///文本区保存换行符换成br
    ///徐进钊
    ///2014-09-17
    public string Br(string str)
    {
        return str.Replace(((char)13).ToString(), "<br>").Replace(((char)10).ToString(), "");
    }

    ///文本区编辑时br转成换行符
    ///徐进钊
    ///2014-09-17
    public string deBr(string str)
    {
        return str.Replace("<br>", ((char)13).ToString() + ((char)10).ToString());
    }


    ///检查id是否合法,必须是正整数且大于0,适用一切id传值检查
    ///返回布尔值
    ///徐进钊
    ///2014-09-18
    ///例子:CheckId(1) CheckId("1")  CheckId("a")
    public bool CheckId(object id)
    {
        if (IsNum(Convert.ToString(id)) == true)
        {
            if (Convert.ToInt32(id) > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }


    //检查两个人是不是好友
    //参数:uid1和uid2为需要确定的两个id,
    //参数:category为0时已发出请求,但还没有确定;否则已确定是好友
    public bool check_friends(string uid1, string uid2, int category)
    {
        if (xlength(uid1) <= 0 || xlength(uid2) <= 0 || (category != 0 && category != 1))
            return false;
        string sqls = "";
        sqls = "select myid,uid,flag from friends where ((myid='" + uid1 + "' and uid='" + uid2 + "') or (myid='" + uid2 + "' and uid='" + uid1 + "')) and flag=" + category + "";
        dbConn dbc = new dbConn();
        if (dbc.Execuse_iCount(sqls) > 0)
            return true;
        else
            return false;
    }

    //作者:刘俊研
    //功能:获取json指定节点数据
    //参数:json_data:json数据;obj:节点对象
    //日期:2014-09-11
    public string get_json(string json_data, string obj)
    {
        try
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();
            Dictionary<string, object> json = (Dictionary<string, object>)serializer.DeserializeObject(json_data);
            object value;
            if (json.TryGetValue(obj, out value))
            {
                return value.ToString();
            }
            else
            {
                return "";
            }
        }
        catch
        {
            return "";
        }
    }


    ///评论盒通用代码
    ///tid:被评的对象id;category:是类型,若是"取消"则隐藏评论盒
    ///徐进钊
    ///2014-09-26
    public string comment_box(string tid, string category)
    {
        string OutHtml = "";

        OutHtml += "<div class='mod hide2' id='comment-box'>";
        OutHtml += "<p>";
        OutHtml += "<textarea id='comment' class='form-control' rows='3'></textarea>";
        OutHtml += "</p>";
        OutHtml += "<span class='sub-i'>0/140</span>";
        OutHtml += "<p>";
        OutHtml += "<a onclick=\"add_comment(" + tid + ",'取消',this)\"class=\"btn btn-default\"><span class='glyphicon glyphicon-off'></span>取消</a>&nbsp;&nbsp;";
        OutHtml += "<a onclick=\"add_comment(" + tid + ",'" + category + "',this)\"class=\"btn btn-success\"><span class='glyphicon glyphicon-send'></span>发表</a><span id='loading'></span>";
        OutHtml += "</p>";
        OutHtml += "</div>";
        return OutHtml;
    }

    /// <summary>
    /// 取集合里第几个id
    /// </summary>
    /// <param name="ids">id集</param>
    /// <returns></returns>
    public string GetArry(string ids, int index)
    {
        string str = "";
        string[] arry;

        arry = ids.Split(',');
        if (index <= arry.Length - 1)
        {
            str = arry[index];
        }
        else
        {
            str = "";
        }
        return str;
    }

    /// <summary>
    /// 计算有几个id
    /// </summary>
    /// <param name="ids">id集</param>
    /// <returns></returns>
    public int Counting(string ids)
    {
        int n = 0;
        string[] arry;

        arry = ids.Split(',');
        for (int i = 0; i < arry.Length; i++)
        {
            if (arry[i].Length > 0)
            {
                n++;
            }
        }
        return n;
    }


    //检查当前openid是否存在且是激活状态
    public bool check_openid(string openid)
    {
        if (xlength(openid) <= 0)
        {
            return false;
        }
        dbConn dbc = new dbConn();
        if (getdeveloping() == "1")
        {
            return true;
        }
        string sqls = "select openid from member where openid='" + openid + "'";
        if (dbc.Execuse_iCount(sqls) > 0)
        {
            return true;
        }
        return false;
    }

    //徐进钊
    //2014-11-6
    //红色游戏-返回正确答案的标志
    //2014-11-26 张宝媛修改，不返回“correct”时，返回正确答案
    //2014-12-31 徐进钊修改，不返回“correct”时，返回空
    public string restyle(string a1, string r_answer)
    {
        if (a1 == r_answer)
        {
            return "correct";
        }
        else
        {
            return "";
        }
    }

    //张宝媛
    //2014-11-26
    //一站到底-返回正确答案的标志
    public string nsrestyle(string a1, string r_answer)
    {
        if (a1 == r_answer)
        {
            return "correct";
        }
        else
        {
            return r_answer;
        }
    }

    /// <summary>
    /// 2014.12.30
    /// 陈有法
    /// 保存图片
    /// </summary>
    /// <param name="strImg"></param>
    /// <returns></returns>
    public string SaveImage(string strImg)
    {
        string fpath = System.Web.HttpContext.Current.Server.MapPath("./Upload/");
        //图片存储文件夹路径            
        string time = DateTime.Now.ToString("yyyyMMddhhmmssfff");
        string picturename = time;   //文件名        

        String ExistsPath = fpath + "Images";

        if (!Directory.Exists(ExistsPath))//查看存储路径的文件是否存在    
        {
            Directory.CreateDirectory(ExistsPath);   //创建文件夹，并上传文件    
        }
        String newFilePath = fpath + "Images" + "/" + picturename; //文件保存路径  
        byte[] arr = Convert.FromBase64String(strImg);
        MemoryStream ms = new MemoryStream(arr);
        Bitmap bmp = new Bitmap(ms);

        bmp.Save(newFilePath + ".jpg",
        System.Drawing.Imaging.ImageFormat.Jpeg);   //保存为.jpg格式       
        ms.Close();
        return picturename + ".jpg";
    }

    //刘俊研
    //2014-12-22
    //功能:岁末狂欢判断是否属于人工审核时间范围(晚10点-早9点属于非人工审核)
    public bool isHmtime()
    {
        string NowtimeH = DateTime.Now.Hour.ToString();
        if (include(NowtimeH, "9,10,11,12,13,14,15,16,17,18,19,20,21,22") == true)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    //刘俊研
    //2014-12-22
    //功能:判断楼层是否为8
    public bool isEight(string num)
    {
        if (xlength(num) <= 0)
        {
            return false;
        }
        else
        {
            if (num.Substring(num.Length - 1, 1) == "8")
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    //功能龙图报名管理导出excel表
    public void CoursetoExcel1(HttpContext HC, string FileName)
    {
        dbConn dbc = new dbConn();
        string sqls = "";
        DataTable table = new DataTable();
        //table.Columns.Add(" ", typeof(string));
        //table.Columns.Add(FileName, typeof(string));
        //table.Columns.Add("#", typeof(string)); 
        table.Columns.Add("姓名", typeof(string));
        table.Columns.Add("手机号码", typeof(string));
        table.Columns.Add("地址", typeof(string));
        table.Columns.Add("报名时间", typeof(string));
        table.Columns.Add("话费", typeof(string));

        sqls = "select id,name,mobi,addr,category,status,add_date,calls from dp_message where status='激活' and category='大鹏报名列表' order by id desc";

        SqlConnection conn = new dbConn().dklConnectDo();
        SqlCommand cmd = new SqlCommand(sqls, conn);
        SqlDataReader dr = cmd.ExecuteReader();
        //table.Rows.Add("姓名", "手机号码", "地址", "报名时间", "话费");
        //Thread.Sleep(1);
        while (dr.Read() == true)
        {
            FileName = "美丽大鹏报名名单.xls";//excel 名
            Thread.Sleep(1);
            string b = dr["name"].ToString();
            Thread.Sleep(1);
            string c = dr["mobi"].ToString();
            Thread.Sleep(1);
            string d = dr["addr"].ToString();
            Thread.Sleep(1);
            string e = dr["add_date"].ToString();
            Thread.Sleep(1);
            string f = dr["calls"].ToString();
            Thread.Sleep(1);
            table.Rows.Add(b, c, d, e, f); 
        }

        dr.Dispose();
        cmd.Clone();
        dbc.CloseConn(conn);
        ExcelRender.RenderToExcel(table, HC, FileName);
    }

}


