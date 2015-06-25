using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Text.RegularExpressions;

public class page_nav
{
    //外部引用示例

    //分页设置开始
    //page_nav PN = new page_nav();
    //PN.pageindex = Convert.ToInt32(Request["pageindex"]);   //当前页码
    //PN.pagesize = 2;   //每页记录数,若为-1则默认是20,否则须设为正整数
    //PN.condition = ""; //查询条件,无则留空
    //分页设置结束

    //dr = df.drcollect("member", "*", "uid desc", "1=1 " + PN.condition, PN.SetPageSize(), PN.SetPageIndex(), out PN.totalrecord);

    //设置分页导航
    //pagenav.InnerHtml = PN.showPageNav();   

    Funs df = new Funs();
    public Int32 pageindex;        //当前分页页码
    public Int32 pagesize;         //每页几条记录
    public Int32 MaxPage;
    public Int32 PageRang = 0;
    public Int32 PageRang1 = 0;    //数字导航下限
    public Int32 PageRang2 = 0;    //数字导航上限
    public Int32 totalrecord = 0;  //总记录数
    public string condition = "";  //查询条件
    public string URL;             //当前的链接地址
    public Double DI = 0.0;
    public string Fenye = "";

    public Int32 SetPageIndex()     //页码的默认值
    {
        if (df.xlength(pageindex) <= 0 || pageindex <= 0)
            pageindex = 1; //第几页
        return pageindex;
    }

    public Int32 SetPageSize()     //每页记录的默认值
    {
        if (df.xlength(pagesize) <= 0 || pagesize <= 0)
            pagesize = 20; //每页多少条记录
        return pagesize;
    }

    public string showPageNav()
    {
        Int32 i = 1;
        string up = HttpContext.Current.Request.Url.Query;   //当前网址
        Int32 temppageindex = 0;

        
        if (totalrecord > 0)
        {
            DI = Convert.ToDouble(totalrecord) / Convert.ToDouble(pagesize);

            MaxPage = df.Gint(DI);
            if (pageindex > MaxPage) //超出末页 
                pageindex = MaxPage;
            if (pageindex <= 0) //超出首页
                pageindex = 1;

            PageRang = pageindex - MaxPage;
            if (PageRang > 5)
                PageRang2 = pageindex + 5;
            else
                PageRang2 = MaxPage;

            PageRang = pageindex - 0;
            if (PageRang > 5)
                PageRang1 = pageindex - 5;
            else
                PageRang1 = 1;

            //Fenye += "<li>" + totalrecord + "</li>";

            //分页数字导航

            if (MaxPage > 2)  //首页 尾页 上一页 下一页
            {
                if (pageindex > 1)
                {
                    //首页
                    Fenye += "<li><a class='icon-step-backward mg-none' href='" + URL + "?" + UrlPara() + rel2() + "pageindex=1'></a></li>";
                    //上一页
                    temppageindex = pageindex - 1;
                    Fenye += "<li><a href='" + URL + "?" + UrlPara() + rel2() + "pageindex=" + temppageindex + "'>&laquo;</a></li>";
                }
                else
                {
                    //首页
                    Fenye += "<li><a disabled class='icon-step-backward mg-none' href='" + URL + "?" + UrlPara() + rel2() + "pageindex=1'></a></li>";
                    //上一页
                    Fenye += "<li><a disabled href='" + URL + "?" + UrlPara() + rel2() + "pageindex=1'>&laquo;</a></li>";
                }
            }
            if (MaxPage <= 10)  //总页数小于10页
            {
                for (i = 1; i <= MaxPage; i++)
                {
                    Fenye += aPage(i, pageindex);
                }
            }
            else  //页数大于10以1 2 3.....11这种形式显示
            {
                if (pageindex <= 6)  //活动页为第一页时
                {
                    for (i = 1; i < 10; i++)
                    {
                        Fenye += aPage(i, pageindex);
                    }
                    Fenye += "<li><a disabled>...</a></li><li><a href='" + URL + "?" + UrlPara() + rel2() + "pageindex=" + MaxPage + "'>" + MaxPage + "</a></li>";
                }
                else if (pageindex == MaxPage)  //活动页为最后页时
                {
                    Fenye += "<li><a href='" + URL + "?" + UrlPara() + rel2() + "pageindex=" + 1 + "'>" + 1 + "</a></li><li><a disabled>...</a></li>";
                    for (i = MaxPage-8; i <= MaxPage; i++)
                    {
                        Fenye += aPage(i, pageindex);
                    }
                }
                else if (MaxPage-pageindex <=4)  //近尾
                {
                    Fenye += "<li><a href='" + URL + "?" + UrlPara() + rel2() + "pageindex=" + 1 + "'>" + 1 + "</a></li><li class='disabled'><a>...</a></li>";
                    for (i = MaxPage - 8; i <= MaxPage; i++)
                    {
                        Fenye += aPage(i, pageindex);
                    }
                }
                else if (MaxPage - pageindex >=4 && pageindex-1>=4)  //中间
                {
                    Fenye += "<li><a href='" + URL + "?" + UrlPara() + rel2() + "pageindex=" + 1 + "'>" + 1 + "</a></li><li><a disabled>...</a></li>";
                    for (i = pageindex - 4; i <= pageindex+3; i++)
                    {
                        Fenye += aPage(i, pageindex);
                    }
                    Fenye += "<li><a disabled>...</a></li><li><a href='" + URL + "?" + UrlPara() + rel2() + "pageindex=" + MaxPage + "'>" + MaxPage + "</a></li>";
                }                
            }
            if (MaxPage > 2)  //首页 尾页 上一页 下一页
            {
                if (pageindex < MaxPage)
                {
                    //下一页
                    temppageindex = pageindex + 1;
                    Fenye += "<li><a href='" + URL + "?" + UrlPara() + rel2() + "pageindex=" + temppageindex + "'>&raquo;</a></li>";
                    //尾页
                    Fenye += "<li><a class='icon-step-forward mg-none' href='" + URL + "?" + UrlPara() + rel2() + "pageindex=" + MaxPage + "'></a></li>";
                }
                else
                {
                    //下一页
                    Fenye += "<li><a disabled href='" + URL + "?" + UrlPara() + rel2() + "pageindex=" + MaxPage + "'>&raquo;</a></li>";
                    //尾页
                    Fenye += "<li><a disabled class='icon-step-forward mg-none' href='" + URL + "?" + UrlPara() + rel2() + "pageindex=" + MaxPage + "'></a></li>";
                }
            }
            return Fenye;
        }
        return "";
    }

    private string aPage(Int32 i, Int32 pageindex)
    {
        string Fenye2 = "" ;
        if (i == pageindex)
            Fenye2 += "<li class='active'><a class='current'>" + i + "</a></li>";
        else
            Fenye2 += "<li><a href='" + URL + "?" + UrlPara() + rel2() + "pageindex=" + i + "'>" + i + "</a></li>"; 
        return Fenye2;
    }

    //避免重复rel=2
    private string rel2()
    {
        string up = HttpContext.Current.Request.Url.Query;   //当前网址
        if (up.IndexOf("rel=2&") < 0)
            return "rel=2&";
        else
            return "";
    }

    private string UrlPara()
    {
        string up = HttpContext.Current.Request.Url.Query;   //当前网址

        if (df.xlength(up)>1)
        {
            Regex t = new Regex(@"\bpageindex\S?\d+");
            Match f = t.Match(up);
            if (f.Success)
            {
                up = up.Replace(f.Value.ToString(), "");
                up = df.right(up, up.Length - 1) + "&";
                up = up.Replace("&&", "&");
                return up; 
            }
            else
            {
                up = df.right(up, up.Length - 1) + "&";
                up = up.Replace("&&", "&");
                return up;
            }
        }
        else
            return "";
    }
}
