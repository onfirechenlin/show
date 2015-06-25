<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Data;
using System.Configuration;
using System.Web;
using System.Web.Security;
using System.Security.Cryptography;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Data.SqlClient;
using System.Data.OleDb;
using System.IO;
using System.Text;
using System.Web.SessionState;
using System.Text.RegularExpressions;
using System.Xml;


public class Handler : IHttpHandler, IRequiresSessionState
{
    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        Funs df = new Funs();
        dbConn dbc = new dbConn();
        AES aes = new AES();
        SqlConnection conn = new dbConn().dklConnectDo();
        SqlDataReader dr;
        string flag = context.Request.QueryString["flag"];
        string sqls;
        int AffRows = 0;
        string sep = df.getsep();
        StringJoiner OutHtml = "";
        string Fields_Values = "";
        phonerechrage phone = new phonerechrage();
        
        try
        {
            if (flag == "1") //管理员登录验证
            {
                string signup_name = HttpUtility.UrlDecode(context.Request.QueryString["signup_name"]);
                string signup_pwd = HttpUtility.UrlDecode(context.Request.QueryString["signup_pwd"]);
                string CheckCode = HttpUtility.UrlDecode(context.Request.QueryString["CheckCode"]);
                string rember = HttpUtility.UrlDecode(context.Request.QueryString["rember"]);
                string ip = df.getip();
                string uid = "";
                int days = 0;

                if (df.xlength(signup_name) <= 0)
                {
                    df.ToWrite("账号不能为空！");
                    return;
                }
                if (df.xlength(signup_pwd) <= 0)
                {
                    df.ToWrite("密码不能为空！");
                    return;
                }

                if (context.Session["CheckCode"] == null)
                {
                    df.ToWrite("验证码过期，请刷新重新输入！");
                    return;
                }
                if (df.xlength(CheckCode) == 0)
                {
                    df.ToWrite("请输入验证码！");
                    return;
                }

                if (CheckCode.ToLower() != context.Session["CheckCode"].ToString().ToLower())
                {
                    df.ToWrite("验证码有误，请重新输入！");
                    return;
                }

                sqls = "select uid from member where truename='" + signup_name + "' and status='激活'";
                if (dbc.Execuse_iCount(sqls) <= 0)
                {
                    df.ToWrite("用户名或密码错误");
                    return;
                }

                signup_pwd = FormsAuthentication.HashPasswordForStoringInConfigFile(signup_pwd, "MD5");
                sqls = "select uid,level2,truename from member where truename ='" + signup_name + "' and password = '" + signup_pwd + "' and status='激活' and level2='A' ";

                dr = df.drtable(conn, sqls);
                if (dr.Read())
                {
                    uid = dr["uid"].ToString();
                    days = (rember == "1") ? 10 : 0;
                    df.SetUid(uid);
                    df.setcookie("truename", dr["truename"].ToString(), days);
                    Fields_Values = ""
                    + "uid=" + dr["uid"].ToString() + sep
                    + "ip=" + ip + sep
                    + "city=" + df.getcity(ip) + sep;
                    df.DoDb("insert", "login_log", Fields_Values, "", 0);
                    df.ToWrite("success");
                }
                else
                {
                    df.ToWrite("用户名或密码错误");
                    return;
                }
            }
            else if (flag == "2") //后台冻结删除激活 by_LJY
            {
                string id = context.Request.QueryString["id"];
                string handle = HttpUtility.UrlDecode(context.Request["handle"].ToString());
                string obj = HttpUtility.UrlDecode(context.Request["obj"].ToString()); //操作的表
                string table = ""; //表
                string fields = ""; //字段
                string status = ""; //需要设置的状态
                sqls = "";
                AffRows = 0;

                if (df.check_admin(df.GetUid()) == false)
                {
                    df.ToWrite("fail");
                    return;
                }
                switch (obj)
                {
                    case "用户": table = "member"; break;
                    case "报名": table = "dp_message"; break;
                    default: table = ""; break;
                }
                id = df.farmat_ids(id); //格式化id集,去掉头尾多余逗号
                fields = obj == "用户" ? "uid" : "id";
                status = handle == "删除" ? "删除" :
                         handle == "冻结" ? "冻结" :
                         handle == "激活" ? "激活" :
                         "";
                sqls = "update " + table + " set status='" + status + "' where " + fields + " in (" + id + ")";
              
                AffRows = dbc.Execuse32(sqls, 0);
                if (AffRows > 0)
                {
                    df.ToWrite("success");
                }
                dbc.CloseConn(conn);
            }
            else if (flag == "3")
            {
                string name = HttpUtility.UrlDecode(context.Request["name"]);
                string phoneno = HttpUtility.UrlDecode(context.Request["mobi"]);
                string addr = HttpUtility.UrlDecode(context.Request["addr"]);
                string category = "大鹏报名列表";
                int calls = 0;
                Random num = new Random();
                int a = num.Next(1, 100);
                sqls = "select sum(calls) from dp_message";
                int count = int.Parse(dbc.Execuse_onlyone(sqls));
                if (count < 200)
                {
                    if (a < 80)
                    {
                        calls = 1; 
                    }
                    else if (a < 90)
                    {
                        calls = 5;
                    }
                    else
                    {
                        calls = 0; 
                    }
                }
                else
                {
                    calls = 0; 
                }
                //检查重复性
                sqls = "select id from dp_message where 1=1 and mobi=@mobi and status='激活'";
                if (dbc.PExecuse_iCount(conn, sqls,
                "@mobi" + sep + phoneno + sep + "nvarchar" + sep + "20") > 0)
                {
                    df.ToWrite("您已提交过信息了，谢谢参与~"); return;
                }
                else
                {

                    sqls = "insert into dp_message(name,mobi,addr,category,calls) values(@name,@mobi,@addr,@category,@calls)";

                    AffRows = dbc.PExecuse32(conn, sqls, 1,
                    "@name" + sep + name + sep + "nvarchar" + sep + "20",
                    "@mobi" + sep + phoneno + sep + "nvarchar" + sep + "20",
                    "@addr" + sep + addr + sep + "nvarchar" + sep + "200",
                    "@category" + sep + category + sep + "nvarchar" + sep + "20",
                    "@calls" + sep + calls + sep + "int" + sep + "10");

                    if (AffRows > 0)
                    {
                        df.ToWrite(calls);
                    }
                }
                 
            }
            else if (flag == "4")
            {
                string ip = df.getip();
                string city = df.getcity(ip);
                string datetime = System.DateTime.Now.ToString();
                string width = context.Request.QueryString["ScreenX"];
                string height = context.Request.QueryString["ScreenY"];
                string os = context.Request.QueryString["OS"];
                string browser = context.Request.QueryString["Brower"];
                string link = context.Request.QueryString["URL"];
                string app_name = context.Request.QueryString["lightApp"];
                string loadtime = context.Request.QueryString["loadtime"];

                sqls = "insert into tongji(ip,city,datetime,screen,os,browser,link,app_name,loadtime) values(@ip,@city,@datetime,@screen,@os,@browser,@link,@app_name,@loadtime)";
                AffRows = dbc.PExecuse32(conn, sqls, 1,
               "@ip" + sep + ip + sep + "nvarchar" + sep + "50",
               "@city" + sep + city + sep + "nvarchar" + sep + "50",
               "@datetime" + sep + datetime + sep + "datetime" + sep + "23",
               "@screen" + sep + width + "*" + height + sep + "nvarchar" + sep + "50",
               "@os" + sep + os + sep + "nvarchar" + sep + "50",
               "@browser" + sep + browser + sep + "nvarchar" + sep + "50",
               "@link" + sep + link + sep + "nvarchar" + sep + "500",
               "@app_name" + sep + app_name + sep + "nvarchar" + sep + "50",
               "@loadtime" + sep + loadtime + sep + "nvarchar" + sep + "50");
                dbc.CloseConn(conn);
            }
            else if (flag == "5")
            {
                string category = HttpUtility.UrlDecode(context.Request.QueryString["category"]); //类型,1:蓝天;2:水滴;3:雨露
                int hits = Convert.ToInt32(df.RndNum(1));
                string sum = "";

                if (hits == 0)
                {
                    hits = 1;
                }

                hits = 1;

                sqls = "update beautiful_dp set sum=sum+" + hits + " where category='" + category + "'";
                AffRows = dbc.Execuse32(sqls, 0);
                if (AffRows > 0)
                {
                    sqls = "select sum from beautiful_dp where category='" + category + "'";
                    sum = dbc.Execuse_onlyone(sqls);
                    df.ToWrite(sum);
                }
            }
            else if (flag == "12")
            {
                string id = context.Request.QueryString["id"];
                string msg_value = context.Request.QueryString["msg_value"];
                string vb1 = context.Request.QueryString["vb1"];
                string vb2 = context.Request.QueryString["vb2"];
                string error = "";
                string error1 = "";             
                sqls = "";
                AffRows = 0;
                sep = df.getsep();
                
                if (df.check_admin(df.GetUid()) == false)
                {
                    df.ToWrite("fail");
                    return;
                }
                id = df.farmat_ids(id);
                sqls = "select id,mobi,calls from dp_message where id in (" + id + ")";
                dr = df.Pdrtable(conn, sqls);
                while (dr.Read())
                {  
                    sqls = "select recharge from dp_message where id='" + dr["id"].ToString() + "'";                                
                    if (dbc.Execuse_onlyone(sqls) == "已充值")
                    {
                    }
                    else
                    {
                        if (int.Parse(dr["calls"].ToString()) > 0)
                        {
                            if (msg_value == "phone")
                            {
                                string orderid = DateTime.Now.ToFileTime().ToString();//随机生成订单号
                                error = phone.recharge_api(dr["mobi"].ToString(), dr["calls"].ToString(), orderid);
                                if (error == "0")
                                {
                                    sqls = "update dp_message set recharge='已充值' where 1=1 and id='" + dr["id"].ToString() + "'";
                                    AffRows = dbc.Execuse32(sqls, 0);
                                    if (AffRows > 0)
                                    {
                                        df.log(dr["mobi"].ToString(), error, "dp_message", "记录手机");
                                    }
                                }
                                else
                                {
                                    sqls = "update dp_message set recharge='充值失败' where 1=1 and id='" + dr["id"].ToString() + "'";
                                    AffRows = dbc.Execuse32(sqls, 0);
                                    if (AffRows > 0)
                                    {
                                        df.log(dr["mobi"].ToString(), error, "dp_message", "记录失败手机");
                                    }
                                }                         
                            }
                            else
                            {
                                string orderid = DateTime.Now.ToFileTime().ToString();//随机生成订单号
                                string tplvalue = "#active#="+vb1+"&#total#="+dr["calls"].ToString()+"&#weichat#="+vb2+"";
                                tplvalue = HttpUtility.UrlEncode(tplvalue);
                                error = phone.recharge_api(dr["mobi"].ToString(), dr["calls"].ToString(), orderid);
                                error1 = phone.msg_api(dr["mobi"].ToString(), msg_value,tplvalue);
                                if (error == "0")
                                {
                                    sqls = "update dp_message set recharge='已充值' where 1=1 and id='" + dr["id"].ToString() + "'";
                                    AffRows = dbc.Execuse32(sqls, 0);
                                    if (AffRows > 0)
                                    {
                                        df.log(dr["mobi"].ToString(), error, "dp_message", "记录手机");
                                    }
                                }
                                else
                                {
                                    sqls = "update dp_message set recharge='充值失败' where 1=1 and id='" + dr["id"].ToString() + "'";
                                    AffRows = dbc.Execuse32(sqls, 0);
                                    if (AffRows > 0)
                                    {
                                        df.log(dr["mobi"].ToString(), error, "dp_message", "记录失败手机");
                                    }
                                }
                                if (error1 == "0")
                                {
                                    sqls = "update dp_message set send_msg='已发短信' where 1=1 and id='" + dr["id"].ToString() + "'";
                                    AffRows = dbc.Execuse32(sqls, 0);
                                    if (AffRows > 0)
                                    {
                                        df.log(dr["mobi"].ToString(), error1, "dp_message", "短信记录");
                                    }                            
                                }
                                else
                                {
                                    sqls = "update dp_message set send_msg='发送短信失败' where 1=1 and id='" + dr["id"].ToString() + "'";
                                    AffRows = dbc.Execuse32(sqls, 0);
                                    if (AffRows > 0)
                                    {
                                        df.log(dr["mobi"].ToString(), error1, "dp_message", "短信失败记录");
                                    }
                                }   
                            }
                        }
                        else
                        {
                            sqls = "update dp_message set recharge='已充值',send_msg='已发短信' where 1=1 and id='" + dr["id"].ToString() + "'";
                            AffRows = dbc.Execuse32(sqls, 0);
                            if (AffRows > 0)
                            {
                                df.log(dr["mobi"].ToString(), error, "dp_message", "谢谢参与");
                            }
                        }
                    }
                }
                df.ToWrite("success");   
                dbc.CloseConn(conn);
            }
        }
        finally
        {
            dbc.CloseConn(conn);
        }
    }
    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}