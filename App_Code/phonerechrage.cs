using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

/// <summary>
///话费充值类
/// </summary>
public class phonerechrage
{
    Funs df = new Funs();
    string htmlstr;
    string[] array;
    string[] array2;
    string errcod = "";
    string appKey = "1cae6717371df41fba8ed175be6efaef"; //申请接口key 话费接口
    string openId = "JHa350fdaf043b8c55d065bd65dccace12";//个人账户的openid


    /// <summary>
    /// 作者：李修妙
    /// 功能：话费充值api接口
    /// 日期2015-03-23
    /// </summary>
    /// <param name="phoneno">手机号码</param>
    /// <param name="cardnum">充值金额</param>
    /// <param name="orderid">订单号</param>
    /// <returns>返回error_code</returns>
    public string recharge_api(string phoneno, string cardnum,string orderid)
    {
        try
        {
            string sign = openId + appKey + phoneno + cardnum + orderid; //效验值 需要32位md5加密
            sign = System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(sign, "MD5").ToLower();
            string url = "http://op.juhe.cn/ofpay/mobile/onlineorder?key=" + appKey + "&phoneno=" + phoneno + "&cardnum=" + cardnum + "&orderid=" + orderid + "&sign=" + sign + "";

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.ContentType = "text/xml";
            Stream reqstream = request.GetRequestStream();
            request.Timeout = 90000;
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
            if (htmlstr.IndexOf(",") >= 0)
            {
                array = htmlstr.Split(',');
                for (int i = 0; i < array.Length; i++)
                {
                    if (array[i].IndexOf(":") >= 3)
                    {
                        array2 = array[i].Split(':');
                        if (array2[0] == "error_code")
                        {
                            errcod = array2[1];

                        }
                    }
                }
            }
            return errcod;
        }
        catch (Exception e)
        {
            return errcod="404";
        }
    }

    /// 作者：李修妙
    /// 功能：根据手机号和面值查询返回商品信息
    /// 日期2015-03-23
    /// <param name="phoneno">手机号码</param>
    /// <param name="cardnum">充值金额</param>
    /// <returns>返回商品信息比如充值50返回结果是49.8</returns>
    public string commodity_api(string phoneno, string cardnum)
    {
        try
        {
            string url = "http://op.juhe.cn/ofpay/mobile/telquery?cardnum=" + cardnum + "&phoneno=" + phoneno + "&key=" + appKey + "";
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.ContentType = "text/xml";
            Stream reqstream = request.GetRequestStream();
            request.Timeout = 90000;
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
            if (htmlstr.IndexOf(",") >= 0)
            {
                array = htmlstr.Split(',');
                for (int i = 0; i < array.Length; i++)
                {
                    if (array[i].IndexOf(":") >= 1)
                    {
                        array2 = array[i].Split(':');
                        if (array2[0] == "inprice")
                        {
                            errcod = array2[1];

                        }
                    }
                }
            }
            return errcod;
        }
        catch (Exception e)
        {
            return errcod = "404";
        }
    }

    /// <summary>
    /// 作者：李修妙
    /// 功能：短信发送api
    /// 日期2015-03-23
    /// </summary>
    /// <param name="phoneno">手机号码</param>
    /// <param name="tpl_id">短信模板id</param>
    /// <param name="tpl_value"></param>
    /// <returns></returns>
    public string msg_api(string phoneno, string tpl_id, string tpl_value)
    {

        try
        {
            string appkey = "39ad3be65b347a988a02472413db2d28";//申请短信接口key
            string url = "http://v.juhe.cn/sms/send?mobile=" + phoneno + "&tpl_id=" + tpl_id + "&tpl_value=" + tpl_value + "&key=" + appkey + "";
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Method = "POST";
            request.ContentType = "text/xml";
            Stream reqstream = request.GetRequestStream();
            request.Timeout = 90000;
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
            if (htmlstr.IndexOf(",") >= 0)
            {
                array = htmlstr.Split(',');
                for (int i = 0; i < array.Length; i++)
                {
                    if (array[i].IndexOf(":") >= 2)
                    {
                        array2 = array[i].Split(':');
                        if (array2[0] == "error_code")
                        {
                            errcod = array2[1];

                        }
                    }
                }
            }
            return errcod;
        }
        catch (Exception e)
        {
            return errcod = "404";
        }
    }
}