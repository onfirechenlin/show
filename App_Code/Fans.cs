using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// 这是粉丝类.
/// 徐进钊
/// 2014-8-20
/// </summary>
public class Fans
{
    Funs df = new Funs();

    private string _sex;       ///性别 方法用到
    private string _add_date;  ///关注日期 方法用到
    private string _mobi;      ///手机 方法用到
    private string _truename;  ///真名 方法用到
    private string _status;    ///状态 方法用到
    private string _credit;    ///积分 方法用到
    private string _uid;       ///uid 方法用到
    private string _id;       ///id 方法用到
    private string _openid;    ///openid 方法用到
    private string wxname;     ///微信名称 
    private string wxicon;     ///大头像
    private string wxicon64;   ///小头像
    private string _idcard;    ///粉丝家园卡号 
    private string _icon;      ///头像
    private string _url;       ///fansurl
    private string fans;       ///用户头像，性别
    private string _fssum;     ///粉丝数
    private string _asum;      ///活动计数
    private string _fsum;      ///收藏计数
    private string _psum;      ///评论计数
    private string _calls;      ///中奖话费
                               
    ///格式化日期
    public string add_date
    {
        get
        { return _add_date; }
        set
        { 
            _add_date = value;
            _add_date="<span class='glyphicon glyphicon-time'></span>" + df.CountDate(_add_date);
        }
    }

    //籍贯
    public string native_place { get; set; }

    public string addr { get; set; }
    public string category { get; set; }
    public string calls
    {
        get
        {
            return _calls;
        }
        set
        {
            _calls = value;
            if (_calls == "0" || df.xlength(calls) <= 0)
            {
                _calls = "谢谢参与";
            }
            else
            {
                _calls = value+"元";
            }
        }
    }
    public string community { get; set; }

    public string show_homeicon()
    {
        if (df.xlength(wxicon64) <= 0)
        {
            return "<img class='media-object head' src='/images/people.png'>";
        }
        else
        {
            return "<img class='media-object head' src='/GetIcon.ashx?url=" + wxicon64 + "'>";
        }
    }
    public string show_usericon()
    {
        if (df.xlength(wxicon64) <= 0)
        {
            return "<img class='media-object img48 radius4' src='/images/people.png'>";
        }
        else
        {
            return "<img class='media-object img48 radius4' src='/GetIcon.ashx?url=" + wxicon64 + "'>";
        }
    }
    public string nickname { get; set; }

    //格式化性别
    public string sex
    {
        get
        {
            return _sex;
        }
        set
        {
            _sex = value;
            _sex = df.sex(_sex);
        }
    }
    //id计数
    public string id { get; set; }
    //活动计数
    public string asum { get; set; }
    //收藏计数
    public string fsum { get; set; }
    //评论计数
    public string psum { get; set; }
    //编辑状态性别
    public string editsex
    {
        get
        {
            return _sex;
        }
        set
        {
            _sex = value;
            if (_sex == "1" || _sex == "男")
            {
                _sex = "男";
            }
            else if (_sex == "2" || _sex == "女")
            {
                _sex = "女";
            }
            else
            {
                _sex = "未知";
            }
        }
    }

    //格式化手机
    public string mobi
    {
        get
        {
            return _mobi;
        }
        set
        {
            _mobi = value;
            if (df.xlength(_mobi) > 5)
            {
                _mobi= "<span class='glyphicon glyphicon-phone'></span>" + _mobi;
            }
        }
    }

    //显示粉丝的头像和微信名
    public string show_nickpic()
    {
        if (df.xlength(wxicon64) > 0)
        {
            return "<a onclick='showicon(this)' data-src='/GetIcon.ashx?url=" + wxicon + "'><img src='/GetIcon.ashx?url=" + wxicon64 + "' class='icon16X16'></a>" + wxname;
        }
        else
        {
            return wxname;
        }
    }

    //显示粉丝的头像
    public string show_meicon()
    {
        if (df.xlength(wxicon64) > 0)
        {
            return "<img src='/GetIcon.ashx?url=" + wxicon64 + "' class='i-img icon120'>";
        }
        else
        {
            return "<img src='/images/people.png' class='i-img'>";
        }
    }

    //显示粉丝的真名
    public string truename {get;set;}

    //显示粉丝的状态
    public string status { get; set; }

    //显示粉丝的积分
    public string credit { get; set; }

    //显示粉丝的UID
    public string uid { get; set; }

    //粉丝数
    public string fssum { get; set; }

    //显示粉丝的openid
    public string openid { get; set; }
    
	public Fans()
	{
		
	}
    //显示粉丝家园卡号
    public string idcard
    {
        get
        {
            return _idcard;
        }
        set
        {
            _idcard = value;
        }
       
    }
    //重构Fans
    public Fans(string _wxname, string _wxicon64, string _wxicon)
    {
        this.wxname = _wxname;
        this.wxicon64 = _wxicon64;
        this.wxicon = _wxicon;
    }

    //重构Fans
    public Fans(string _wxicon64)
    {
        this.wxicon64 = _wxicon64;
    }

    //显示粉丝常规头像
    public string fansicon
    {
        get { return _icon; }
        set
        {
            _icon = "<img class='img48 radius4' src='" + value + "' />";
        }
    }


    //显示粉丝家URL
    public string fansurl
    {
        get { return _url; }
        set
        {
            _url = "/community/user-info.aspx?openid=" + value + "";
        }
    }
}