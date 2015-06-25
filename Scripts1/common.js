var developing = 0;   //开发状态为1
var f = false;  //查询框回车不可提交
var txt;
var object;     //临时对象变量,函数间对象句柄传递会用到.
var url;
$(document).ready(function(){  	

	$("form").keydown(function(e) {
		var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
		if (keyCode == 13) {	
			if ($(".pop_box").css("display")=="none")	
				return true;
			if ($(this).attr("data-inset")=="enter")
			{
				//查询表单要按回车
				if (($(this).find("#keyword").val()!="输入关键字..."))
					return true;		
			}
			else
				return true;
		}        
    });	
	
    //搜索关键字
	$("#keyword").keydown(function (e) {
	    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	    if (keyCode == 13) {
	        search_go();
	        return false;
	    }
	});
    //登录回车
	$("#CheckCode").keydown(function (e) {
	    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	    if (keyCode == 13) {
	        login();
	        return false;
	    }
	});
    //readonly样式
	readonly();

	//刷新按钮
	ReLoad();
	
	//冻结状态
	freeze();
	
	//复选框选中则变色
	lightline();
	//mouse_response();
	
	//只准输入正数字
	onlyint();
    //只准输入数字,小数点
	onlyfloat();
	
	//通用型评论框占位符
	comment_init();
	
	//后台左侧弹出式菜单
	pop_nav();	
	
	//返回链接
	link_back();
	
	//是否出现搜索按钮
	btn_search();
	
	//格式化“说两句”按钮
	btn_comment();
	
	//是否出现地图按钮
	btn_map();
	
	//格式化“我要说”按钮
	btn_iws();

	einit();

	cinit();

	if ($(".fancybox").length > 0) {
	    $(".fancybox").fancybox();
	}

    //加载alert-modal
	$("#plugin").load("/plugin.html #alert");

});

//获取当期页面的某一个的参数值后判断是否打开评论框
//张宝媛
//2014-9-27
function get_newsid() {
    var urlinfo = window.location.href;  //获取当前页面的url
    var len = urlinfo.length;//获取url的长度
    var offset = urlinfo.indexOf("&");//设置参数字符串开始的位置
    var newsidinfo = urlinfo.substr(offset, len)//取出参数字符串 这里会获得类似“id=1”这样的字符串
    var newsids = newsidinfo.split("=");//对获得的参数字符串按照“=”进行分割
    var newsid = newsids[1];//得到参数值
    if (newsid == "1#txt") {
        comment_box(1);
    }
}

//显示和隐藏搜索框
//徐进钊
//2014-09-24
function searchbtn()
{
	if ($('#searchDiv').css("display")!="block")
	{
		$('#searchDiv').fadeIn(500);	
	}
	else
	{
		$('#searchDiv').fadeOut(500);	
	}
}


//徐进钊
//返回链接
//2014-09-24
function link_back()
{
	$(".link-back").html("<a onclick='back()' class='fontwhite'><span class='icon-arrow-left'></span>上页</a>");	
}


//徐进钊
//是否出现搜索按钮
//2014-09-24
function btn_search()
{
	$(".btn-search").html("<a class='fontwhite'><span class='glyphicon glyphicon-search'></span>搜</a>");	
	$(".btn-search").attr("onclick","searchbtn()");	
}


//徐进钊
//是否出现地图按钮
//2014-09-24
function btn_map()
{
	$(".btn-map").html("<a class='fontwhite'><span class='glyphicon glyphicon-map-marker'></span>地图</a>");	
	$(".btn-map a").attr("href","/map.aspx?addr="+$("#addr").val()+"&la="+$("#la").val()+"&lg="+$("#lg").val());
	//$(".btn-map").attr("onclick","tomap()");	
}

//徐进钊
//格式化“说两句”按钮
//2014-09-26
function btn_comment()
{
	if (typeof($(".btn-comment").attr("data-href"))!="undefined")  //如果自己有链接
	{
		$(".btn-comment").html("<a href='"+$(".btn-comment").attr("data-href")+"' class='fontwhite'><span class='glyphicon glyphicon-comment'></span>说两句</a>");	
	}
	else  //无链接
	{
		$(".btn-comment").html("<a href='#txt' class='fontwhite' onclick='comment_box(1)'><span class='glyphicon glyphicon-comment'></span>说两句</a>");	
	}
}


//徐进钊
//格式化“我要说”按钮
//2014-09-28
function btn_iws()
{
    //$(".btn-iws").html("<a class='fontwhite' href='/oneclick/oneclick/talk-add.aspx?s_category=<%=request[\"s_category\"]%>&id=313'><span class='icon-comments-alt'></span>我要说</a>");
	$(".btn-iws").html("<a class='fontwhite' href='/oneclick/talk-add.aspx?category="+$(".btn-iws").attr("data-category")+"'><span class='icon-comments-alt'></span>我要说</a>");
	//alert($(".btn-iws").attr("data-category"));
}


//徐进钊
//2014-09-10
//后台左侧弹出式菜单栏
function pop_nav()
{
	$(".side-nav-menu li ul").hide();
	$(".side-nav-menu li[data-nav]").mouseover(function(index, element) {
        $(this).find("ul").first().show();
		$(this).children().first().find("span").addClass("glyphicon-chevron-up");
		$(this).children().first().find("span").removeClass("glyphicon-chevron-down");
    });
	$(".side-nav-menu li[data-nav]").mouseout(function(index, element) {
        $(this).find("ul").hide();
		$(this).children().first().find("span").removeClass("glyphicon-chevron-up");
		$(this).children().first().find("span").addClass("glyphicon-chevron-down");		
    });	
}
 

//徐进钊
//2014-07-04
//测试id
function _chooseopenid(openid)
{
    setcookie("testopenid", openid,10);
}

//徐进钊
//2014-07-04
//测试id初始化
function _chooseinit() {
	$("#content_box li a").each(function(index, element) {
        if (getcookie("testopenid")==$(this).attr("data-openid"))
		{
			$(this).attr("disabled","disabled");	
			$(this).removeClass("btn-warning");
			$(this).addClass("btn-default");	
		}
    });
}


//徐进钊
//2014-06-20
//通用型评论框占位符
function comment_init()
{
	$("#comment-box p textarea").attr("placeholder","既然来了,就说点啥呗");
	$("#comment-box p textarea").attr("rows","2");
	$("#comment-box p textarea").focus(function(e) {
        footerhide();
    });
	$("#comment-box p textarea").blur(function(e) {
        footershow();
    });	
}


//徐进钊
//2014-06-18
//隐藏页脚
function footerhide()
{
	$("#footer-bar").hide();	
}


//徐进钊
//2014-06-18
//显示页脚
function footershow()
{
	$("#footer-bar").show();	
}

//返回前一页,特殊情况用到
function back()
{
    //window.history.go(-1);
    self.location = document.referrer;//返回前一页并刷新
}


//徐进钊
//2014-5-8
//功能:构造ajax url 带随机数
function seturl(flag) {
    url = "/ajaxfuns.ashx?flag=" + flag + "&num=" + Math.random();
    return url;
}


//作者:徐进钊
//日期:2014-1-14
//功能:以bootstrap 3的样式代替自带alert.在使用前,请注意是否加载alert modal.
function xalert(content)
{
    $("div[data-modal-type=alert]").html(content);
    $("#alert").modal();
	
}

//js 的延迟函数,毫秒级
function sleep(ms) {
    var startTime = new Date();
    var endTime = new Date();
    while (startTime.getTime() + ms - endTime.getTime() > 0) {
        endTime = new Date();
        endTime.getTime();
    }
}


//获得浏览器版本
//返回7,8,26等
function browser() {
	var userAgent = window.navigator.userAgent.toLowerCase();
	var version = $.browser.version;
	return parseInt(version);
}

//保存导航大类id到cookie,以便相应的标识.
function savebtn_a(n) {
    SetCookie("btn-a", n, 10);
}

//保存导航小类id到cookie,以便相应的标识.
function savebtn_b(n) {
    SetCookie("btn-b", n, 10);
}

//------------------------------------------------标签选择-开始
//标签盒
function show_tags(xthis) {
    $(xthis).next().show();
    tags_go($(xthis));
}

//标签输入帮助
function tags_go(xthis) {
    var ba = $(xthis);
    ba.next().show();

}
//点击选择标签
function click_tags(xthis) {
    var li;
    var array;
    var tag = $(xthis).text();  // 要添加的标签
    var tagsbox = $(xthis).parent().parent().parent().prev();         //要显示选择结果的容器  
    var tags = $(xthis).parent().parent().parent().prev().prev();     //要在存储选择结果的容器  

    if (tagsbox.attr("data-category") == "1")  //单选项
    {
        li = "<li>" + tag + "<img onclick='tags_remove(this)' src='/images/delicon.png' /></li>";
        $(tagsbox).html(li + "<li style='cursor:pointer'>" + $(tagsbox).children("li:last-child").html() + "</li>");
        $(tags).val(tag + ",");
    }
    else  //多选项
    {
        if (tags.val().indexOf(",") >= 0) {
            array = tags.val().split(',');
            for (var i = 0; i < array.length; i++) {
                if (array[i].length > 0) {
                    if (array[i] == tag) {
                        alert('不要重复选择标签.');
                        return false;
                    }
                }
            }
        }

        li = "<li>" + tag + "<img onclick='tags_remove(this)' src='/images/delicon.png' /></li>";
        $(tagsbox).html(li + $(tagsbox).html());
        $(tags).val($(tags).val() + tag + ",");
    }
}

//点击选择图书
function click_book(xthis,bid) {
    var li;
    var array;
    var tag = $(xthis).html();  // 要添加的标签
    var tagsbox = $(xthis).parent().parent().parent().prev();         //要显示选择结果的容器  
    var tags = $(xthis).parent().parent().parent().prev().prev();     //要在存储选择结果的容器  

    if (tagsbox.attr("data-category") == "1")  //单选项
    {
        li = "<li>" + tag + "<img onclick='tags_remove(this)' src='/images/delicon.png' /></li>";
        $(tagsbox).html(li + "<li style='cursor:pointer'>" + $(tagsbox).children("li:last-child").html() + "</li>");
        $(tags).val(bid);
    }
}


//手工选择标签
function add_tags(str, xthis) {
    var li;
    var array;
    var tagsbox = $(xthis).parent().parent().prev();         //要显示选择结果的容器  
    var tags = $(xthis).parent().parent().prev().prev();     //要在存储选择结果的容器  
    var tag = str;  // 要添加的标签

    if (tagsbox.attr("data-category") == "1")  //单选项
    {
        li = "<li>" + tag + "<img onclick='tags_remove(this)' src='/images/delicon.png' /></li>";
        $(tagsbox).html(li + "<li style='cursor:pointer'>" + $(tagsbox).children("li:last-child").html() + "</li>");
        $(tags).val(tag + ",");
    }
    else {
        if (tags.val().indexOf(",") >= 0) {
            array = tags.val().split(',');
            for (var i = 0; i < array.length; i++) {
                if (array[i].length > 0) {
                    if (array[i] == tag) {
                        alert('不要重复选择标签.');
                        return false;
                    }
                }
            }
        }

        li = "<li>" + tag + "<img onclick='tags_remove(this)' src='/images/delicon.png' /></li>";
        $(tagsbox).html(li + $(tagsbox).html());
        $(tags).val($(tags).val() + tag + ",");
    }

    $(xthis).val('');
    $(xthis)[0].focus();
}
//移除标签
function tags_remove(xthis) {
    var array;
	var tagsbox = $(xthis).parent().parent();
    var tags = $(xthis).parent().parent().prev();     //要在存储选择结果的容器  
    var tag = $(xthis).parent().text();  // 要移除的标签
    var txt = "";
    $(xthis).parent().remove();
    if (tagsbox.attr("data-category") == "1")  //单选项
    {
		tags.val("");
	}
	else
	{
		if (tags.val().indexOf(",") >= 0) {
			array = tags.val().split(',');
			for (var i = 0; i < array.length; i++) {
				if (array[i].length > 0) {
					if (array[i] != tag) {
						txt += array[i] + ",";
					}
				}
			}
			$(tags).val(txt);
		}
	}
}

//------------------------------------------------标签选择-结束

//当按上箭头下箭头,回车时---开始
function arrow(e,cthis){
    var e = window.event ? window.event : e;
    var flag;
	var p_box=$(".pop_box");
    var sp3=$(".pop_box").children("ul").children("li");
	var input=$(cthis);
	//f=true;	
	//alert("dd")
    if(e.keyCode == 38){  //按了向上箭头
       flag=0;
       sp3.each(function(i){
            if ($(this).attr('class')=='arrow_li_select'){ 
                $(this).removeClass("arrow_li_select");
                $(this).prev().addClass("arrow_li_select");
                flag=1;
				return false;
             }
       });
	   if (flag==0){
		   sp3.first().addClass("arrow_li_select");
	   }
    }
	else if(e.keyCode == 40){  //按了向下箭头
       flag=0;
       sp3.each(function(i){
            if ($(this).attr('class')=='arrow_li_select'){ //
                $(this).removeClass("arrow_li_select");
                $(this).next().addClass("arrow_li_select");
                flag=1;
				return false;
             }
       });
	   if (flag==0){
		   sp3.first().addClass("arrow_li_select");
	   }	
	}
	else if(e.keyCode == 13){  //按了回车键
       sp3.each(function(i){
            if ($(this).attr('class')=='arrow_li_select'){ //
				$(this).children("a").click();
				p_box.hide(100);
				return false;
             }
       });	
	   
	}
	else{ //非上下回车键
		$(cthis).focusout();
		$(cthis).focus();
	}
}
//当按上箭头下箭头,回车时---结束




//只准输入正数字
//两种方法1是input元素属性为data-inset='onlyint',2是属性为data-onlyint=1,后者更好用
function onlyint(){
	$("input[data-inset='onlyint']").keyup(function(e) {
        $(this).val($(this).val().replace(/\D+/g,''));
	});
	$("input[data-onlyint]").keyup(function (e) {
	    $(this).val($(this).val().replace(/\D+/g, ''));
	});
}

//只准输入数字,小数点
//input属性为data-onlyint=1即可
function onlyfloat() {
    $("input[data-onlyfloat]").keyup(function (e) {
        $(this).val($(this).val().replace(/[^\d\.]/g,''));
    });
}



//刷新
function ReLoad(){
	$("a[data-inset='reload']").attr("href","javascript:location.reload()");
}

//选中则变色
function lightline() {
    txt = $("input[name='inputtxt']");
    //$("input[name='checkbox']").click(function () {
    $("input[name='checkbox']").bind('click',function(){
        if (($(this).is(':checked')) == false) {
            dobox(txt, $(this).val(),2);    //去掉该id
            $("#allcbox").prop("checked", false);
            $(this).parent().parent().css({ "background": "white" });
        }
        else
        {
            dobox(txt, $(this).val(), 1);  //不重复加上该id
            $(this).parent().parent().css({ "background": "#eaf5fe" });
        }
    });
}




//冻结状态
function freeze(){
	$("td").each(function(index, element) {
        if ($(this).text()=="冻结" || $(this).text()=="退出")
		{
			$(this).parent().css("color","#ccc");	
		}
    });		
}



//jstextarea控制字数
//例子:在网页中引用setInterval("char_len2(140,'msg')", 500);  msg是控制的textarea框的字数
//提示的span一般在被控制的textarea的下一个元素
function char_len(len, tid) {
    var sum;
    var tid_box;
    tid_box = $(tid).length > 0 ? $(tid) : $("#" + tid);   //传来的字段限制框，有可能是id也可能是对象.
    if (tid_box.length == 0)
        return;
    var charmsg = tid_box.parent().next();
    $(charmsg).text((tid_box.val().length) + "/" + len + "");
    sum = tid_box.val().length;
    if (sum > len) {
        $(charmsg).text(len + "/" + len + "");
        $(charmsg).css("color", "red");
        tid_box.val(tid_box.val().substring(0, len));
    }
    else 
        $(charmsg).css("color", "Gray");
}



//解决replace只能替换一次的做法
//使用方法：var a = replaceAll("你有$100.99吗?","$","￥");
function replaceAll(s1,s2,s3){
	var r = new RegExp(s2.replace(/([\(\)\[\]\{\}\^\$\+\-\*\?\.\"\'\|\/\\])/g,"\\$1"),"ig");
	return s1.replace(r,s3);
}


function ajaxmember(xthis) {
	var html;
	$(xthis).after("<div></div>");
	object=$(xthis);
	$(xthis).next().load("/datapad.htm?id=1", function (responseText, textStatus, XMLHttpRequest) {
		success: {
			html= responseText;
			
			//初始化开始
			//data-search:为搜索函数;
			//data-show:数据显示函数;
			//data-click:为点击列表函数;
			//data-inset:数据显示区为id或class;
			//data-option:1为单选,选完即关面板;2为多选,选完不关面板.
			//前台示例:<a onclick="ajaxmember(this)" data-search='' data-click='' data-show='' data-db='' data-inset='' data-option='1'>加载</a>
			
			html= replaceAll(html,"!data-search", $(xthis).attr("data-search"));
			html= replaceAll(html,"!data-click", $(xthis).attr("data-click"));
			html= replaceAll(html,"!data-show", $(xthis).attr("data-show"));
			html= replaceAll(html,"!data-inset", $(xthis).attr("data-inset"));
			html= replaceAll(html,"!data-option", $(xthis).attr("data-option"));
			//初始化结束
			
			responseText = html;
			$(xthis).next().remove();
			$(xthis).after(responseText);
			ajaxgetuid_go(xthis);
		}
	});
}




//关闭pop_box窗口,当f=1则销毁整个窗口,当f=0则为隐藏
function cx_close(xthis) {
    var close_box = $(xthis).parent().children(".pop_box");
    if (close_box.length > 0) {
		close_box.remove();
    }
    else {
        close_box = $(xthis).parent().parent();
        if (close_box.length > 0) {
			close_box.remove();
        }
    }
}



function add_option()
{
	$("#options").append("<div><input type='text' data-id=''><img src='images/delicon1.png' onClick='options_close(this)' class='options-close-icon'></div>");
}


function submit_data()
{
	var data;
	var model_st=$("#model_st").val();
	if(model_st=="0")
	{
		data=$("input[name='prd']:checked").val();
	}
	else if(model_st=="1")
	{
		$("input[name='cprd']:checked").each(function(){
			if($(this).val().length>0)
			{
				data+="|"+$(this).val();
			}
		});	
		data=data.replace("undefined|","");
	}
	var url="/ajaxfuns.ashx?flag=2&num="+Math.random();	
	$.ajax({
		url:url,
		data: {data:data,model_st:model_st},
		type:'GET',
		timeout:2000,
		dataType:'html',
		beforeSend:function(){
		},
		error:function(){if (developing == 1) { alert("抱歉,产生未知错误,请刷新页面."); } return false; },
		success:function(xml){
			alert(xml);
		}
	});		
}




//作者：徐进钊
//日期：2013-8-2
//功能：初始化所有.bechoose元素，加上鼠标事件。
//例子：引用cinit()。	
function cinit(){
	$(".bechoose").each(function(index, element) {
		$(this).append("<img src='/images/bechoose1.png' data-inset='' data-old-border='' onClick='bci(this)' class='be-choose-icon'>");
	});
	
	$(".bechoose").mouseover(function(e) {
		$(this).find(".be-choose-icon").css("display","block");  
		//$(this).css("position","relative");
	});
	$(".bechoose").mouseleave(function(e) {
		var bci;
		
		bci=$(this).find(".be-choose-icon");
		if (bci.attr("data-inset")!="1")
		{
			bci.css("display","none");	
			//$(this).css("position","inherit"); 
		}
	});			
}


//复选框实现功能
//复选框全选
function allcboxb()
{
    if ($("#allcbox").is(':checked')==true)
    {
		txt=$("input[name='inputtxt']");
		$("input[name='checkbox']").prop("checked", "checked");
		txt.val("");
		$("input[name='checkbox']").each(function(index, element) {
		    txt.val(txt.val() + $(this).val() + ",");
		});	
        //$('table td').css({"background":"#eaf5fe"});
		$('tbody tr').css({ "background": "#eaf5fe" });
		$('tbody tr:even').css({ "background": "#eaf5fe" });
		$('tbody tr:odd').css({ "background": "#eaf5fe" });
	}
	else
	{	
		txt=$("input[name='inputtxt']");
		$("input[name='checkbox']").prop("checked", false);
		txt.val("");	
		$('tbody tr:even').css({ "background": "#F9F9F9" });
		$('tbody tr:odd').css({ "background": "white" });
	}
	//alert($("#allcbox").attr("checked"));
}



//作者：徐进钊
//日期：2013-10-5
//功能：图形全选。
//例子：引用all_choose(xthis)。	
function all_choose(xthis){
	var bci;
	if ($(xthis).attr("checked")=="checked")
		$(xthis).attr("checked")=="false";
	else
		$(xthis).attr("checked")=="checked";
		
	if ($(xthis).attr("checked")=="checked")  //选中
	{
		$(".bechoose").each(function(index, element) {
			if ($(this).find(".be-choose-icon").length==0)
			{
				$(this).append("<img src='/images/bechoose2.png' data-inset='' data-old-border='' onClick='bci(this)' class='be-choose-icon'>");
			}
			bci=$(this).find(".be-choose-icon");
			bci.css("display","block");  
			bci.attr("src","/images/bechoose2.png");
			alert(bci.length);
			bci.attr("data-inset","1");	
			//bci.parent().css("border","1px solid #ccc");
			dobox($("#cidbox"),bci.parent().attr("data-id"),1);				
		});
	}
	else //未选中
	{
		$(".bechoose").each(function(index, element) {
			bci=$(this).find(".be-choose-icon");
			bci.attr("src","/images/bechoose1.png");
			bci.attr("data-inset","");
			bci.css("display","none");	
			//保存原来的边框
			//bci.attr("data-old-border",bci.parent().css("border"));
			//bci.parent().css("border",bci.attr("data-old-border"));
			$("#cidbox").val("");	
		});				
	}
}


//作者：徐进钊
//日期：2013-8-2
//功能：选中或取消选中某目标元素后，将以图形勾选的方式和边框变色显示。
//      目标元素(div,li等)属性要求1.data-title="bechoose";2.id值data-id="1(N)";
//      3.目标元素内须含<img src="/images/bechoose1.png" data-inset="" data-old-border="" onClick="bci(this)" class="be-choose-icon">
//      该函数会在灰色或绿色小图标被点击时触发.
//例子：<img onClick="bci(this)" src="1.png">
function bci(xthis) {
    var bci;
    bci = $(xthis);
    if (bci.attr("data-inset") == "1") //选中状态
    {
        bci.attr("src", "/images/bechoose1.png");
        bci.attr("data-inset", "");
        //id集保存在父元素的父元素的第一个子元素里,不能脱离这个group范围,一页会有多个group
        dobox($(xthis).parent().parent().children().eq(0), bci.parent().attr("data-id"), 2);
        //全选为未选中状态
        $(xthis).parent().parent().children().last().children().attr("checked", false);
    }
    else //未选中状态
    {
        bci.attr("src", "/images/bechoose2.png");
        bci.attr("data-inset", "1");
        //id集保存在父元素的父元素的第一个子元素里,不能脱离这个group范围,一页会有多个group
        dobox($(xthis).parent().parent().children().eq(0), bci.parent().attr("data-id"), 1);
    }
}
//作者：徐进钊
//日期：2013-8-2
//功能：选中或取消选中某id后，将记录在隐藏文本框里，方便进行数据库操作。
//参数：idsbox是装载id集的文本框；mat_id需要匹配的id值;ad是选中还是取消选中。
//例子：dobox($("#cidbox"),bci.parent().attr("data-id"),1);
function dobox(idsbox,mat_id,ad)
{
	var cidbox=$(idsbox);
	var f=false;     //已存在标识
	if (ad==1) //是增法
	{
		if (cidbox.val().indexOf(",")>0)
		{
			var array;
			array=cidbox.val().split(",");
			for(var i=0;i<array.length-1;i++)
			{
				if (array[i]==mat_id)
				{
					f=true;
					break;
				}
			}
			if (f==false)
				cidbox.val(cidbox.val()+mat_id+",");
		}
		else
			cidbox.val(mat_id+",");	
	}
	
	else if (ad==2) //是减法
	{
		if (cidbox.val().indexOf(",")>0)
		{
			var array;
			array=cidbox.val().split(",");
			cidbox.val("");
			for(var i=0;i<array.length-1;i++)
			{
				if (array[i]!=mat_id)
					cidbox.val(cidbox.val()+array[i]+",");
			}
		}
		else
			cidbox.val(mat_id+",");		
	}		
}


function setcookie(name, value, expireDays)//设置cookies函数,三个参数，一个是cookie的名子，一个是值,一个是cookie 将被保存天数
{
    if (expireDays == 0) {
        $.cookie(name, value, { path: '/' });
    }
    else {
        $.cookie(name, value, { expires: expireDays, path: '/' });
    }
}

function getcookie(Name)//取cookies函数        
{
    if ($.cookie(Name) == null) {
        return "";
    }
    else {
        return $.cookie(Name);
    }
}

function delcookie(name)//删除cookie
{
    $.removeCookie(name);
}

//获得uid
function getuid()       
{
    var uid=getcookie("4740BB992A28232FCA38EACE1C06A650");
	if (uid==null)
		return "";
	else
		return uid;
}


//关闭bootstrap打开的对话窗口
function model_close()
{
    $("button[class=close][aria-hidden=true]").click();
}


//获取当前页网址,保存当前页网址
function saveurl() {
    SetCookie("url", document.location.href, 10);
}

//------------------------------------------------------------------------------弹出框2个函数开始
//作者：徐进钊
//日期：2013-8-2
//功能：初始化所有.beclose框元素，加上关闭功能。
//例子：引用einit()。	
function einit(){
	$(".beclose").each(function(index, element) {
		$(this).append("<img src='images/delicon1.png' onClick='beclose(this)' class='beclose-icon'>");
	});
	$(".beclose").mouseover(function(e) {
		$(this).find(".beclose-icon").css("display","block");  
		$(this).css("position","relative");
	});
	$(".beclose").mouseleave(function(e) {
		var bci=$(this).find(".beclose-icon");
		bci.css("display","none");	
	});			
}	

function beclose(xthis){
	$(xthis).parent().fadeOut(500);	
}	

//------------------------------------------------------------------------------弹出框2个函数结束


//------------------------------------------------------------------------------学堂漫步2个函数开始
//作者：徐进钊
//日期：2014-1-7
//功能：初始化所有.beremove框元素，加上移除功能。
//例子：引用pinit()。	
function pinit(){
	$(".beremove").each(function(index, element) {
		if ($(this).find(".beremove-icon").length<1)
			$(this).prepend("<img src='/images/delicon1.png' onClick='beremove(this)' class='beremove-icon' style='float:right'>");
	});
			
	$(".beremove").mouseover(function(e) {
		$(this).find(".beremove-icon").css("display","block");  
		$(this).css("position", "relative");
		
	});
	$(".beremove").mouseleave(function(e) {
		var bci=$(this).find(".beremove-icon");
		bci.css("display","none");	
	});		
		
}	

function beremove(xthis){
	if (confirm("确定删除该图片吗?")==true)
	{
		$(xthis).parent().fadeOut(500);	
		$("#cut_result").val($("#cut_result").val().replace($(xthis).prev().attr("href")+",",""));
	}
}	

//------------------------------------------------------------------------------学堂漫步2个函数结束

//后台table鼠标感应变色
function mouse_response()
{
    $("tbody > tr").each(function (index, element) {
        $(this).attr("onMouseOver","this.style.backgroundColor='#f6f6f6'");
		$(this).attr("onMouseOut","this.style.backgroundColor='#ffffff'");
    });
}



function wordbreak(){
	$(".all-text p span").each(function(index, element) {
        $(this).attr("style","");
    });
}

function wordbreak2(){
	$(".controls p span").each(function(index, element) {
        $(this).attr("style","");
    });
}


//readonly样式
function readonly() {
    $("*[readonly]").css({
        "background": "#f6f6f6",
        "cursor":"not-allowed"
    });
}

//美化文件上传框
function scapingfile(){
	$(".file-input > a > label").addClass("btn btn-info");
}



//移除对象,起关闭作用
function remove1(xthis){
	$(xthis).next().remove();		
}


//设对象为空值
function toempty(obj) {
    $(obj).val('');
}

//根据日期获得星期几
function getweekday(xthis) {
    alert($(xthis).val());
}





//生成班级签到二维码
function getticket(cid,xthis) 
{
    var url = "/ajaxfuns.ashx?flag=19&num=" + Math.random();
	var loading=$(xthis).next();
    $.ajax({
        url: url,
        data: {cid:cid},
        type: 'GET',
        timeout: 5000,
        dataType: 'html',
        beforeSend: function () {
			loading.html(setloading());
		},
        error: function () { if (developing == 1) { alert("抱歉,产生未知错误,请刷新页面."); } return false; },
        success: function (xml) {
			loading.html(clsloading());
			if (xml.length>20)
			{
				xml="<img src='https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket="+xml+"' />";
				xalert(xml);
			}
			else
            	xalert("当前无法获得二维码,请联系管理员.");	
        }
    });
}



//
function setloading()
{
	return "<img src='/images/loading.gif' />";	
}
function clsloading()
{
	return "";	
}




//作者：徐进钊
//日期：2014-2-19
//功能：文本框保留换行符。
function br(content)
{
    return content.replace(/\r/ig, "<br>").replace(/\n/ig, "<br>");
}


//根据开课时间返回星期几
function getweek(time)
{
    time = new Date(time);
    var week;
    if (time.getDay() == 0) week = "周日"
    if (time.getDay() == 1) week = "周一"
    if (time.getDay() == 2) week = "周二"
    if (time.getDay() == 3) week = "周三"
    if (time.getDay() == 4) week = "周四"
    if (time.getDay() == 5) week = "周五"
    if (time.getDay() == 6) week = "周六"
    return getweek;
}

//终端个人资料页保存数据
function saveme()
{
    var truename = $("#truename").val().toString().trim();
    var mobi = $("#mobi").val().toString().trim();
    var sex = $("#sex").val();
    var byear = $("#byear").val();
    var bmonth = $("#bmonth").val();
    var degree = $("#degree").val();
    var politics = $("#politics").val();
    var native_place = $("#native_place").val();
    if (isAllChn(truename) == false) {
        xalert("姓名必须为汉字！");
        return false;
    }
    else if (checkMobilePhone(mobi) == false)
    {
        xalert("手机号码格式有误，请检查！");
        return false;
    }
    else if (sex.length <= 0)
    {
        xalert("性别必须输入，请检查!");
        return false;
    }
    else if (byear.length <= 0) {
        xalert("出生年份必须输入，请检查!");
        return false;
    }
    else if (bmonth.length <= 0) {
        xalert("出生月份必须输入，请检查!");
        return false;
    }
    else if (degree.length <= 0) {
        xalert("学历必须输入，请检查!");
        return false;
    }
    else if (politics.length <= 0) {
        xalert("政治面貌必须输入，请检查！");
        return false;
    }
    else if (native_place.length <= 0) {
        xalert("籍贯输入有误，请检查！");
        return false;
    }

    if (byear.indexOf("年") >= 0)
    {
        byear = byear.substring(0, byear.length-1);
    }
    if (bmonth.indexOf("月") >= 0) {
        bmonth = bmonth.substring(0, bmonth.length-1);
    }

    url = "/ajaxfuns.ashx?flag=1000&num=" + Math.random();
    $.ajax({
        url: url,
        data: {
            truename: escape(truename), mobi: mobi, sex: sex,
            degree:escape(degree),politics:escape(politics),
            native_place:escape(native_place),
            date: escape(byear + "-" + bmonth + "")
        },
        type: 'GET',
        timeout: 5000,
        dataType: 'html',
        beforeSend: function () {
            xalert("<img src=/images/loading.gif />提交中，请稍后....");
        },
        error: function () {
            if (developing == 1) {
                xalert("抱歉，网络异常请稍后再试！");
            }
            return false;
        },
        success: function (xml) {
            xalert(xml);
        }
    });
}

//徐进钊
//2014-06-05
//按钮不可用,一般用在防止多次点击的操作里,比如发表评论按钮等
function lockbtn(xthis)
{
	$(xthis).addClass("disabled");	
}

//徐进钊
//2014-06-05
//解除按钮不可用,一般用在防止多次点击的操作里,比如发表评论按钮
function unlockbtn(xthis)
{
	$(xthis).removeClass("disabled");
}


//登录调用cookie用户名
function getnickname() {
    var wxname = decodeURIComponent(getCookie("wxname"));
    if (wxname == null)
        $("#username").val("");
    else
        $("#username").val(decodeURIComponent(getCookie("wxname")));
}
//徐进钊
//2014-4-14
//功能:加载loading
//obj是dom对象
//例子:loading($("#abc"))  loading($(".abc"))  loading($(xthis)) 
function loading(obj)
{
    $(obj).html("<img src='/images/loading.gif'class='loading' />");
}

//徐进钊
//2014-4-14
//功能:清除loading
//obj是dom对象
//例子:loaded($("#abc"))  loading($(".abc"))  loading($(xthis)) 
function loaded(obj)
{
	$(obj).html("");	
}



//作者:徐进钊
//日期:2014-04-18
//功能:评论输入框显示与隐藏
function comment_box(f) {
    if (f == 1) {
        $("#comment-box").fadeIn(500);
        $("#comment").focus();
		$("#topcontrol").hide(100);
		$("#comment-box a").removeClass("disabled");
    }
    else {
        $("#comment-box").fadeOut(1000);
		$("#topcontrol").show(100);
    }
}




//陈有法
//2014.4.18
//时间倒计时
function timer() {
    var day = 0,
        hour = 0,
        minute = 0,
        second = 0;//时间默认值       
    if (intDiff > 0) {
        day = Math.floor(intDiff / (60 * 60 * 24));
        hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    }
    if (minute <= 9) minute = '0' + minute;
    if (second <= 9) second = '0' + second;
    var time = day + ":" + hour + ":" + minute + ":" + second;
    $('#time').html(time)
    intDiff--;
    setcookie("timebool", intDiff);
}


//徐进钊
//2014-06-05
//按钮不可用,一般用在防止多次点击的操作里,比如发表评论按钮等
function lockbtn(xthis) {
    $(xthis).addClass("disabled");
}

//徐进钊
//2014-06-05
//解除按钮不可用,一般用在防止多次点击的操作里,比如发表评论按钮
function unlockbtn(xthis) {
    $(xthis).removeClass("disabled");
}

//登录时的友好体验
function login_experience() {
    if ($("#username").val().length > 0)
        $("#password").focus();
    else
        $("#username").focus();
}

function nourl() {
    alert("还没有内容.");
    return false;
}

function guide() {
    $("#mcover").css("display", "block");  // 分享给好友圈按钮触动函数
}

function close_guide() {
    $("#mcover").css("display", "none");  // 关闭分享
}

//可以渲染弹出框架按钮
//支持最多3个按钮
//.button-default  .button-active  .button-warning  支持三种样式
//徐进钊
//2014-11-28
function jqiplus() {
    var obj = $(".jqibuttons button");
    if (obj.length == 1) {
        obj.width("100%");
    }
    else if (obj.length == 2) {
        obj.width("48.6%");
    }
    else if (obj.length == 3) {
        obj.width("32.2%");
    }
    obj.each(function (index, element) {
        if ($(this).text() == "关闭") {
            $(this).addClass("button-default");
        }
        else {
            $(this).addClass("button-active");
        }
    });
}



//impromptu对话框的封装
//徐进钊
//2014-11-30
//示例：palert("提示","你过关了","休息一会:0:fun1","不玩了:1:fun2","知道了:2:fun3")
//休息一会:0:fun1注释“休息一会”是按钮，0是按钮的值，可选，fun1是点击按钮后执行的函数，可选
//注意，请不要用true false ，直接用0 1 2等表示较好
function palert(title,content,btn1,btn2,btn3)
{
	var btntemp;
	var b1v; var fun1;
	var b2v; var fun2;
	var b3v; var fun3;
	var btntemp2;
	var btntempb;
	var a="test";
	var b="true"
	
	var b_value = new Object(); 
	var opt = new Array(); 

	var btn="{";
	if (btn1.indexOf(":")>=0)
	{
		btntemp=btn1.split(":");
		btn +="\""+btntemp[0]+"\":";
		btn +=btntemp[1]+"";
		b1v=btntemp[1];
		if (btntemp[2]!=null)
		{
			fun1=btntemp[2];
		}
	}
	if (btn2.indexOf(":")>=0)
	{
		btn +=",";
		btntemp=btn2.split(":");
		btn +="\""+btntemp[0]+"\":";
		btn +=btntemp[1]+"";
		b2v=btntemp[1];
		if (btntemp[2]!=null)
		{
			fun2=btntemp[2];
		}		
	}
	if (btn3.indexOf(":")>=0)
	{
		btn +=",";
		btntemp=btn3.split(":");
		btn +="\""+btntemp[0]+"\":";
		btn +=btntemp[1]+"";
		b3v=btntemp[1];
		if (btntemp[2]!=null)
		{
			fun3=btntemp[2];
		}
	}		
	btn +="}";

	var json=btn;  
	json = $.parseJSON(btn);  

		
	
	$(".jqibox").remove();
	$.prompt(content, {
		title: title,
		buttons: json,
		submit: function (e, v, m, f) {
			if (b1v!=null)
			{
				if (v==b1v)
				{
					if (fun1!=null)
					{
						eval(fun1);	
					}
				}
			}
			if (b2v!=null)
			{
				if (v==b2v)
				{
					if (fun2!=null)
					{
						eval(fun2);	
					}
				}
			}	
			if (b3v!=null)
			{
				if (v==b3v)
				{
					if (fun3!=null)
					{
						eval(fun3);	
					}
				}
			}					
		}
	});
	jqiplus();	
}











