var qjvalue;
var go=0;  //全局变量

//后台管理点击头像
function showicon(xthis) {
    palert(" ","<img style='width:100%' src=" + $(xthis).attr("data-src") + ">","关闭:0","","");
}

//陈有法
function btn_hide(xthis)
{
	$(xthis).hide();
	comment_box(1);
}

//徐进钊
//2014-09-27
//去地图
function tomap()
{
	$(".btn-map a").attr("href","/map.aspx?addr="+$("#addr").val()+"&la="+$("#la").val()+"&lg="+$("#lg").val());
}




//login.htm登录前看是不是在登录状态
function check_login_status() {
    var uid = getuid();
    if (uid.length > 0) {
        alert("您已经登录了,请退出后再登录.");
        back();
    }
}

//作者:刘俊研
//日期:2014-03-31
//参数: xid-"目标id"，flag-"ajaxfuns.ashx里的标识"
//功能:用于后台点击弹出根据分类及flag返回的信息列表框
function show_list(xid, flag, xthis) {
	if ($(xthis).text() == "0") {
		return false;
	}
	var url = "/ajaxfuns.ashx?flag=" + flag + "&num=" + Math.random();
	$.ajax({
		url: url,
		data: { cid: xid },
		type: 'GET',
		timeout: 5000,
		dataType: 'html',
		beforeSend: function () {
			xalert("<img src=/images/loading.gif />加载中....");
		},
		error: function () { if (developing == 1) { xalert("抱歉，网络异常，请刷新页面后再试！"); } return false; },
		success: function (xml) {
			palert(" ",xml,"关闭:0","","");
		}
	});
}


function loginCheck()  //ajax检查管理员登录
{
	var username = $("#username").val();
	var password = $("#password").val();
	var rember = $("#rember").attr("checked");
	if (rember == "checked")
		rember = 1; //勾上
	else
		rember = 0; //没有勾
	if (username == "") {
		alert("温馨提示:管理账号不能为空！");
		$("#username").focus();
		return false;
	}
	if (password == "") {
		alert("温馨提示:管理密码不能为空！");
		$("#password").focus();
		return false;
	}
	var url = "/ajaxfuns.ashx?flag=-1&num=" + Math.random();
	$.ajax({
		url: url,
		data: { password: password, username: escape(username), rember: rember },
		type: 'GET',
		dataType: 'html',
		beforeSend: function () {
			$("#login").html("<img src='images/loading-icon.gif'> 正在登录,请稍等...");
		},
		error: function () { if (developing == 1) { alert("抱歉,产生未知错误,请刷新页面."); } return false; },
		success: function (xml) {
			if (xml.indexOf('成功') >= 0) {
				document.location.href = "manage.aspx";
			}
			else {
				alert("登录失败,请检查用户名或密码.");
				$("#login").html("登 录");
			}
		}
	});
}




//登录
function login(xthis)  //ajax登录
{
	var signup_name = $("#signup_name").val();
	var signup_pwd = $("#signup_pwd").val();
	var CheckCode = $("#CheckCode").val();
	var rember = $(".login-btn-set .selected").length;
	var loadbox = $("#loading");  //loading加载对象

	if (signup_name == "") {
		palert(" ","温馨提示:账号不能为空！","关闭:0","","");
		$("#signup_name").focus();
		return false;
	}
	if (signup_pwd == "") {
		palert(" ","温馨提示:密码不能为空！","关闭:0","","");
		$("#signup_pwd").focus();
		return false;
	}
	if (CheckCode.length != 4) {
		palert(" ","温馨提示:请输入正确的验证码","关闭:0","","");
		$("#CheckCode").focus();
		return false;
	}

	$.ajax({
		url: seturl(1),
		data: { signup_pwd: escape(signup_pwd), signup_name: escape(signup_name), CheckCode: escape(CheckCode), rember: rember },
		type: 'GET',
		timeout: 10000,
		dataType: 'html',
		beforeSend: function () {
		    //lockbtn($("#login-btn"));
		    $("#login-btn").html("正在跳转...");
			loading(loadbox);
		},
		error: function () {
			unlockbtn($("#login-btn"));
			if (developing == 1) {
				palert(" ","抱歉,产生未知错误,请刷新页面.","关闭:0","","");
			}
			loaded(loadbox);
			return false;
		},
		success: function (xml) {
			if (xml.indexOf('验证码') >= 0) {
				unlockbtn($("#login-btn"));
				palert(" ","验证码输入有误,请检查.","关闭:0:","","");
				$("#imgValidateCode").click();				
			}
			else if (xml.indexOf('success') >= 0) {
				$("#login-btn").html("正在跳转...");
				location.href ="/dp_cms/index.aspx";
			}
			else {
				unlockbtn($("#login-btn"));
				palert(" ","登录失败,请检查用户名或密码.","关闭:0","","");
				$("#imgValidateCode").click();
			}
			loaded(loadbox);
		}
	});
}


//搜索框
function search_go() {
	var keyword = $("#keyword").val();
	var sid = $("#sid").val();
	var url = "search.aspx?";

	if (sid.length == 0)
		sid = $("#psid").val();
	if (keyword.length > 0 && keyword != "资讯/活动关键字...")
		url += 'keyword=' + escape(keyword);
	else {
		alert("请输入你要搜索的关键字.");
		return;
	}
	if (sid.length > 0)
		url += '&sid=' + sid;

	window.location.href = url;
}





//检查是否登录
function islogin() {
	var uid = getuid();
	if (uid.length == 0) {
		saveurl();
		alert("请登录后再进行操作.");
		window.location.href = "/login.htm";
		return false;
	}
	return true;
}



//复选框全选或取消全选 ，图形全选/取消全选
function allcboxd2() {
	if ($("#allcbox").attr("checked") == "checked") {
		//选中id存到txt:id="deltxt"中
		$("#deltxt").val("");
		$(".bechoose").each(function (index, element) {
			$(this).find(".be-choose-icon").css("display", "block");
			$(this).find(".be-choose-icon").attr("data-inset", "1");
			$(this).find(".be-choose-icon").attr("src", "/images/bechoose2.png");
			$("#deltxt").val($("#deltxt").val() + $(this).attr("data-id") + ",");
			//$(this).css("position", "relative");
		});
	}
	else {
		$(".bechoose").each(function (index, element) {
			$(this).find(".be-choose-icon").css("display", "none");
			$(this).find(".be-choose-icon").attr("data-inset", "");
			$(this).find(".be-choose-icon").attr("src", "/images/bechoose1.png");
			//$(this).css("position", "inherit");
		});
		$("#deltxt").val("");
	}
}

//作者：徐进钊
//日期：2013-10-5
//功能：全选。
//例子：引用allchoose(xthis)。	
function allchoose(xthis) {
    var checked;  //选择状态
    var bci;

    checked = $("#allcbox").is(':checked');

    if (checked == true)  //选中
    {
        $(".bechoose").each(function (index, element) {
            if ($(this).find(".be-choose-icon").length == 0) {
                $(this).append("<img src='/images/bechoose2.png' data-inset='' data-old-border='' onClick='bci(this)' class='be-choose-icon'>");
            }
            $(this).css("position", "relative");
            bci = $(this).find(".be-choose-icon");
            bci.css("display", "block");
            bci.attr("src", "/images/bechoose2.png");
            bci.attr("data-inset", "1");
            //id集保存在父元素的父元素的第一个子元素里,不能脱离这个group范围,一页会有多个group
            dobox($(xthis).parent().parent().children().eq(0).children().eq(0), bci.parent().attr("data-id"), 1);
        });
    }
    else //未选中
    {
        $(".bechoose").each(function (index, element) {
            bci = $(this).find(".be-choose-icon");
            bci.attr("src", "/images/bechoose1.png");
            bci.attr("data-inset", "");
            bci.css("display", "none");
            //id集保存在父元素的父元素的第一个子元素里,不能脱离这个group范围,一页会有多个group
            $(xthis).parent().parent().children().eq(0).children().eq(0).val("");
        });
    }
}



function set_power(p)//管理员会员管理分配权限时，友好提示
{
	if (p == "A") {
		if (confirm("确定分配【超级管理员】权限吗？该用户将拥有一切权限和不受任何限制，请慎重！") == false) {
			location.reload();
		}
	}
	else if (p == "B") {
		if (confirm("这是分站长权限，不建议在此分配，应该在【管理分站站长】中分配！现在前往吗？") == true) {
			location.href = "station_admin_manage.aspx";
		}
		else {
			location.reload();
		}
	}
}

//后台列表相关删除、置顶、冻结操作
//例子:<a onclick="list_handle('删除','敏感字')">删除</a>
function list_handle(handle, obj) {
	var txtid = $("input[name='inputtxt']").val();
	if (txtid.length <= 0) {
		palert(" ","您未选中任何项!","关闭:0","","");
	}
	if (handle == "删除") {
		if (confirm("确定删除吗?") == false)
			return false;
	}

	url = "/ajaxfuns.ashx?flag=2&num" + Math.random(),
	$.ajax({
		url: url,
		data: { id: txtid, handle: escape(handle), obj: escape(obj) },
		type: 'GET',
		timeout: 5000,
		dataType: 'html',
		beforeSend: function () { },
		error: function () { if (developing == 1) { alert("抱歉,产生未知错误,请刷新页面."); } return false; },
		success: function (xml) {
			if (xml.indexOf("success") >= 0) {
				window.location.reload();
			}
			else
				alert(xml);
		}
	});
}

//作者：徐进钊
//日期：2013-8-2
//功能：初始化所有.beclose框元素，加上关闭功能。
//例子：引用einit()。	
function einit() {
	$(".beclose").each(function (index, element) {
	    $(this).append("<img src='/images/delicon1.png' onClick='closeShowICon(this)' class='beclose-icon'>");
	});

	$(".beclose").mouseover(function (e) {
		$(this).find(".beclose-icon").css("display", "block");
		$(this).css("position", "relative");
	});
	$(".beclose").mouseleave(function (e) {
		var bci = $(this).find(".beclose-icon");
		bci.css("display", "none");
	});
}

function beclose(xthis) {
	$(xthis).parent().fadeOut(500);
}

function cx_close2(dobject) {
	$(dobject).parent().hide();
	$(".addshowl").fadeOut(200);
}



//点击选择课程
function click_course(xthis) {
	$("#title").val($(xthis).text());
	model_close();  //关闭弹出窗
}



//渲染我的资料表单,以节省字节
function rend_me() {
	$("form > .form-group > label").addClass("col-xs-4 control-label text-right");
	$("form > .form-group > div").addClass("col-xs-6");
	$("form > .form-group > div > input[type=text],form > .form-group > div > select").addClass("form-control");

	//头像div
	$("form > .form-group > div[id=0]").removeClass("col-xs-6");
	$("form > .form-group > div[id=0]").addClass("col-xs-offset-3 col-xs-4");

	$("body").show();
}


//好书推荐 判断用户是否超过3000毫秒没输入字
function checkbook() {
	var myDate = new Date();
	var keytime = getcookie("ptime")
	var ptime = myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
	var cuttime = ptime - keytime;
	if ($("#cover").length == 0 || $.trim($("#cover").val()).length == 0) {
		$("#imggroup").html("")
		return;
	}
	if (500 < cuttime && cuttime < 1000) {
		mybook();
		return;
	}
}


//徐进钊
//2014-06-18
//隐藏页脚
function footerhide() {
	$("#footer-bar").hide();
}


//徐进钊
//2014-06-18
//显示页脚
function footershow() {
	$("#footer-bar").show();
}


//展开收起
function s2l(xthis) {
	var prev = $(xthis).parent().prev();
	if ($(xthis).text() == "展开") {
		txt = prev.find("div").text();
		prev.find("div").html(prev.find("div").attr("data-title"));
		$(xthis).text("收起");
		$(xthis).removeClass("btn-info");
		$(xthis).addClass("btn-warning");
		prev.find("div").css({ "height": "auto" });
	}
	else if ($(xthis).text() == "收起") {
		prev.find("div").attr("data-title", prev.find("div").html());
		prev.find("div").text(txt);
		$(xthis).text("展开");
		$(xthis).removeClass("btn-warning");
		$(xthis).addClass("btn-info");
		prev.find("div").css({ "height": "auto" });
	}
}

//已发送，未发送
function s22(xthis) {
    var prev = $(xthis).parent().prev();
    if ($(xthis).text() == "未发送") {
        txt = prev.find("div").text();
        prev.find("div").html(prev.find("div").attr("data-title"));
        $(xthis).text("已发送");
        $(xthis).removeClass("btn-info");
        $(xthis).addClass("btn-warning");
        prev.find("div").css({ "height": "auto" });
    }
    else if ($(xthis).text() == "已发送") {
        prev.find("div").attr("data-title", prev.find("div").html());
        prev.find("div").text(txt);
        $(xthis).text("未发送");
        $(xthis).removeClass("btn-warning");
        $(xthis).addClass("btn-info");
        prev.find("div").css({ "height": "auto" });
    }
}
//已解决，未解决
function s23(xthis) {
    var prev = $(xthis).parent().prev();
    if ($(xthis).text() == "未解决") {
        txt = prev.find("div").text();
        prev.find("div").html(prev.find("div").attr("data-title"));
        $(xthis).text("已解决");
        $(xthis).removeClass("btn-info");
        $(xthis).addClass("btn-warning");
        prev.find("div").css({ "height": "auto" });
    }
    else if ($(xthis).text() == "已解决") {
        prev.find("div").attr("data-title", prev.find("div").html());
        prev.find("div").text(txt);
        $(xthis).text("未解决");
        $(xthis).removeClass("btn-warning");
        $(xthis).addClass("btn-info");
        prev.find("div").css({ "height": "auto" });
    }
}

//xalert显示柱状图
function xalert_result(id) {
	xalert("<img src='/images/loading.gif' />&nbsp&nbsp努力加载中...");
	$.ajax({
		url: '/oneclick/vote-result.aspx?id=' + id,
		cache: false,
		success: function (html) {
			xalert(html);
		}
	});
}



  //Gps经纬度获取保存到SQL
function GpsAdd(openid) {
   
	if (openid.length >= 0) {
		if (confirm("确认开启GPS定位吗?") == false)
			return false;
	else if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	}
	else { alert("你未开启手机GPS定位服务，请开启手机GPS定位服务在尝试！"); }
	}
}
function showPosition(position) {   
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
 //   alert("您的纬度:" + latitude + ",您的经度:" + longitude);    //弹出经纬度信息  
	return;
	var url = "/ajaxfuns.ashx?flag=35&num" + Math.random();
	$.ajax({
		url: url,
		data: { openid: openid, la: latitude, lg: longitude },
		type: "post",
		timeout: 5000,
		dataType: 'html',
		error: function () { alert("抱歉,产生未知错误，请刷新页面."); return false; },
		success: function (xml) {
			alert(1)
			if (xml.indexOf("success") >= 0) {
				window.location.reload();
			}
			else {
				alert(xml);
			}
		}
	})
}

//2014.11.13
//陈有法
//随手拍立刻显示被上传的图片
function showpic() {
    //利用files获得被上传附件(图片)信息
    var mypic = document.getElementById('file').files[0];
    //利用mypic获得图像的url地址(二进制源码)
    //URL  html5新标准属性
    //window.URL.createObjectURL(mypic);
    // $("#showimg").attr("src", window.URL.createObjectURL(mypic));

    $("#showimg").attr("src", getObjectURL(mypic));

}

//2014.11.13
//陈有法
///随手拍建立一個可存取到該file的url
function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic

        url = window.createObjectURL(file);

    } else if (window.URL != undefined) { // mozilla(firefox)

        url = window.URL.createObjectURL(file);

    } else if (window.webkitURL != undefined) { // webkit or chrome

        url = window.webkitURL.createObjectURL(file);
    }

    return url;
}

//2014.11.13
//陈有法
///随手拍上传
function myProgress() {
    var file = document.getElementById('file').files[0];
    var fd = new FormData();
    fd.append("file", file);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            $("#hideimg").val(xhr.responseText);
            $("#uploadProgress").html("100%")
        }
    }
    $("#uploadProgress").show();
    //侦查当前附件上传情况
    xhr.upload.onprogress = function (evt) {
        //侦查附件上传情况
        //通过事件对象侦查
        //该匿名函数表达式大概0.05-0.1秒执行一次
        //console.log(evt);
        //console.log(evt.loaded);  //已经上传大小情况
        //evt.total; 附件总大小
        var loaded = evt.loaded;
        var tot = evt.total;
        var per = Math.floor(95 * loaded / tot);  //已经上传的百分比
        $("#uploadProgress").html(per + "%")
    }

    xhr.open("post", "/ajaxfuns.ashx?flag=5&num=" + Math.random());
    xhr.send(fd);
}

//2014.11.13
//陈有法
///js获取参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


function a()
{
	$("#c_list p img").each(function(index, element) {
        if ($(this).parent()=="p")
		{
			alert($(this).parent().css("text-indent"));
			if ($(this).parent().css("text-indent"))	
			{}
		}
    });
}



function guide() {
	$("#mcover").css("display", "block");  // 分享给好友圈按钮触动函数
}

function close_guide() {
	$("#mcover").css("display", "none");  // 关闭分享
}

//刘俊研
//2014-12-17
function closeShowICon(xthis) {
    $(xthis).parent().fadeOut(500);
    $("#up-box").fadeIn(500);
}

//提示用户更换头像
//徐进钊
//2014-12-19
function rollicon()
{
	$("#fimg").addClass("glow");
}


//停止提示用户更换头像
//徐进钊
//2014-12-19
function endroolicon()
{
	$("#fimg").removeClass("glow");
}
//技术支持
function power_by() {
    $(".jqibox").remove();
    $.prompt($("#power_div").html(), {
        title: "",
        buttons: { "关闭": false },
        submit: function (e, v, m, f) {
        }
    });
    jqiplus();
}


//作者:徐进钊
//日期:2015-03-26
//功能:报名的时候必须确认一下
function set_active_id(id) {
    $("#a" + id).attr("onclick", $("#a" + id).attr("data-onclick"));
    $(".jqibox").remove();
    $("#a" + id).click();
}

function apply_front(id, classid) {
    var content = "";
    if (classid == "退出")
    {
        content = "亲，你确定退出吗？";
    }
    else if (classid == "报名") {
        var content = "亲，您确定报名吗？";
    }
    palert("", content, "确定:1:set_active_id(" + id + ")", "关闭:0", "");
}

//作者:张宝媛
//日期:2015-03-26
//功能：活动报名
//xid:活动id
//category:活动
//classid:是报名,退出还是关注
function apply(xid, category, classid, xthis) {
    var a_sum = "";

    $.ajax({
        url: seturl(7),
        data: { xid: xid, category: escape(category), classid: escape(classid) },
        type: 'GET',
        timeout: 10000,
        dataType: 'html',
        beforeSend: function () {
            //$(xthis).removeAttr("onclick");
            loading($(xthis).children().eq(3));
        },
        error: function () {
            if (developing == 1) {
                alert("抱歉,产生未知错误,请刷新页面.");
            }
            loaded($(xthis).children().eq(3));
            return false;
        },
        success: function (xml) {
            loaded($(xthis).children().eq(3));
            if (xml.indexOf("success") >= 0) //报名成功
            {
                //回调操作,更新前端icon和人数
                if (classid == "报名") {
                    $(xthis).children().eq(0).removeClass('icon-linkedin');  //icon改成实心
                    $(xthis).children().eq(0).addClass('icon-linkedin-sign');  //icon改成实心
                    $(xthis).children().eq(1).text(parseInt($(xthis).children().eq(1).text()) + 1);  //数字发生改变,增1
                    $(xthis).children().eq(2).text('退出');                                        //文字发生改变
                    $(xthis).attr("onclick", "apply_front(" + xid + ",'退出')");
                    $(xthis).attr("data-onclick", "apply(" + xid + ",'" + category + "','退出',this)");
                    //$(xthis).children().eq(2).text('审核中');                                        //文字发生改变
                    //$(xthis).removeAttr("onclick");
                    palert("", "报名成功，敬请留意活动信息哦！", "关闭:0", "", "");
                }
                else if (classid == "退出") {
                    $(xthis).children().eq(0).removeClass('icon-linkedin-sign');  //icon改成虚心
                    $(xthis).children().eq(0).addClass('icon-linkedin');  //icon改成虚心
                    $(xthis).children().eq(1).text(parseInt($(xthis).children().eq(1).text()) - 1);  //数字发生改变,减1
                    $(xthis).children().eq(2).text('报名');                                        //文字发生改变
                    $(xthis).attr("onclick", "apply_front(" + xid + ",'报名')");
                    $(xthis).attr("data-onclick", "apply(" + xid + ",'" + category + "','报名',this)");
                }
            }
            else if (xml.indexOf("goarchive") >= 0) //去完善资料
            {
                palert("", "请先完善报名信息,然后再报名.", "10秒完善:1:gourl('/talk/me.aspx')", "关闭:0", "");
                //palert("请填写报名信息", OutHtml, "", "", "");
                $(xthis).children().eq(2).text('报名');
            }
            else {
                    $(xthis).children().eq(2).text('报名');
                    palert("", xml, "关闭:0", "", "");
            }
        }
    });
}
function choose_community(community) {
    $("#community").val(community);
}


//张宝媛
//2015-03-26
//保存报名信息
function saveinfo() {
    var truename = $("#truename").val().toString().trim();
    var mobi = $("#mobi").val().toString().trim();
    var community = $("#community").val().toString().trim();
    
    if (truename.length <= 0) {
        $("#word").html("*真实姓名必须输入，请检查!")
        return false;
    }
    else if (checkMobilePhone(mobi) == false) {
        $("#word").html("*手机号码格式有误，请检查！")
        return false;
    }
    else if (community.length <= 0) {
        $("#word").html("*所属街道必须选择，请检查!")
        return false;
    }

    $.ajax({
        url: seturl(9),
        data: {
            mobi: mobi, truename: escape(truename), community: escape(community)
        },
        type: 'GET',
        timeout: 5000,
        dataType: 'html',
        beforeSend: function () {
            //palert("", "<img src=/images/loading.gif />正在努力保存中，请稍后....", "关闭:0", "", "");
        },
        error: function () {
            if (developing == 1) {
                palert("", "抱歉，网络异常请稍后再试！", "关闭:0", "", "");
            }
            return false;
        },
        success: function (xml) {
            palert("", xml, "关闭:0", "", "");
        }
    });
}


//张宝媛
//2015-03-28
//终端个人资料页保存数据
function saveme() {
    var truename = $("#truename").val().toString().trim();
    var mobi = $("#mobi").val().toString().trim();
    var addr = $("#addr").val().toString().trim();

    if ($("#rember").is(':checked') != true) {
        palert("", "请同意西丽果场微信注册须知,以便我们提供更好的服务。", "关闭:0", "", "");
        return false;
    }
    else if (truename.length <= 0) {
        palert("", "真实姓名必须输入，请检查!", "关闭:0", "", "");
        return false;
    }
    else if (checkMobilePhone(mobi) == false) {
        palert("", "手机号码格式有误，请检查！", "关闭:0", "", "");
        return false;
    }
    else if (addr.length <= 0) {
        palert("", "收件地址必须输入，请检查!", "关闭:0", "", "");
        return false;
    }

    $.ajax({
        url: seturl(4),
        data: {
            mobi: mobi, truename: escape(truename), addr: escape(addr)
        },
        type: 'GET',
        timeout: 5000,
        dataType: 'html',
        beforeSend: function () {
            palert("", "<img style='width:auto !important' src=/images/loading.gif />正在努力保存中，请稍后....", "关闭:0", "", "");
        },
        error: function () {
            if (developing == 1) {
                palert("", "抱歉，网络异常请稍后再试！", "关闭:0", "", "");
            }
            return false;
        },
        success: function (xml) {
            palert("", xml, "关闭:0", "", "");
        }
    });
}

function gourl(url) {
    document.location.href = url;
}

function close_jqibox() {
    $(".jqibox").remove();
}

//作者:张宝媛
//日期:2014-08-26
//功能：赞,鲜花
//李修妙改
//xid:活动id
//category:类
//classid:是赞,取消赞，送鲜花，取消送鲜花
function user_handle(xid, category, classid, xthis) {
    $.ajax({
        url: seturl(8),
        data: { xid: xid, category: escape(category), classid: escape(classid) },
        type: 'GET',
        timeout: 10000,
        dataType: 'html',
        beforeSend: function () {
            $(xthis).removeAttr("onclick");
            loading($(xthis).children().eq(3));
        },
        error: function () {
            if (developing == 1) {
                alert("抱歉,产生未知错误,请刷新页面.");
            }
            loaded($(xthis).children().eq(3));
            return false;
        },
        success: function (xml) {
            loaded($(xthis).children().eq(3));
            if (xml.indexOf("success") >= 0) //报名成功
            {
                //回调操作,更新前端icon和人数
               if (classid == "赞") {
                    $(xthis).children().eq(0).removeClass('icon-heart-empty');  //icon改成实心
                    $(xthis).children().eq(0).addClass('icon-heart');  //icon改成实心
                    $(xthis).children().eq(1).text(parseInt($(xthis).children().eq(1).text()) + 1);  //数字发生改变,增1
                    $(xthis).children().eq(2).text('赞');
                    $(xthis).attr("onclick", "user_handle(" + xid + ",'" + category + "','取消赞',this)");
                }
               else if (classid == "取消赞") {
                    $(xthis).children().eq(0).removeClass('icon-heart');  //icon改成虚心
                    $(xthis).children().eq(0).addClass('icon-heart-empty');  //icon改成虚心
                    $(xthis).children().eq(1).text(parseInt($(xthis).children().eq(1).text()) - 1);  //数字发生改变,减1
                    $(xthis).children().eq(2).text('赞');
                    $(xthis).attr("onclick", "user_handle(" + xid + ",'" + category + "','赞',this)");
               }
               else if (classid == "送鲜花")
               {
                   $(xthis).children().eq(1).text(parseInt($(xthis).children().eq(1).text()) + 1);  //数字发生改变,增1
                   $(xthis).children().eq(2).html("<img src='../img/flower.png'>");
                   $(xthis).attr("onclick", "user_handle(" + xid + ",'" + category + "','取消送鲜花',this)");
               }
               else if (classid == "取消送鲜花")
               {
                   $(xthis).children().eq(1).text(parseInt($(xthis).children().eq(1).text()) - 1);  //数字发生改变,减1
                   $(xthis).children().eq(2).html("<img src='../img/flower.png'>");
                   $(xthis).attr("onclick", "user_handle(" + xid + ",'" + category + "','送鲜花',this)");
               }
            }
            else {
                palert("", xml, "关闭:0", "", "");
            }
        }
    });
}


//陈有法
//2015-05-13
//功能：意见反馈
function add_comment(xid, category, xthis) {
    var content = $("#comment").val();

    //用户可以取消评论框
    if (category == "取消") {
        comment_box(0);
        return false;
    }

    if (xid.length <= 0) {
        palert("", "非法请求，请稍后重试!", "关闭:0", "", "");
        return false;
    }
    if (content.length < 1) {
        palert("", "<img src='/images/12.gif' />亲,你想说什么呢~", "关闭:0", "", "");
        return false;
    }
    //文本框保留换行
    content = br(content);

    $.ajax({
        url: seturl(5),
        data: { xid: xid, category: escape(category), content: escape(content) },
        type: 'GET',
        timeout: 10000,
        dataType: 'html',
        beforeSend: function () {
            lockbtn(xthis);   //按钮不可用
            loading($("#loading"));  //加载loading
        },
        error: function () {
            unlockbtn(xthis);       //解除按钮不可用
            loaded($("#loading"));  //清除loading
            if (developing == 1) {
                palert("", "抱歉，网络异常请稍后再试！", "关闭:0", "", "");
            }
        },
        success: function (xml) {
            if (xml.indexOf("success") >= 0) {
                comment_box(0);
                if ($(".list-lined li:first").text().indexOf("当前还没人评论") >= 0) {
                    $(".list-lined li:first").remove();
                };
                $.ajax({
                    url: seturl(6),
                    data: { content: escape(content), category: escape(category) },
                    type: 'GET',
                    timeout: 5000,
                    dataType: 'html',
                    beforeSend: function () { },
                    error: function () {
                        if (developing == 1) {
                            loaded($("#loading"));  //清除loading
                            palert("", "抱歉，网络异常请稍后再试！", "关闭:0", "", "");
                        }
                        return false;
                    },
                    success: function (data) {
                        if (data.length > 0)  //成功
                        {
                            $(".list-lined[data-no!=1]").prepend(data);
                            $("#comment").val('');
                            loaded($("#loading"));  //清除loading
                        }
                    }
                });
            }
            else
            {
                unlockbtn(xthis);       //解除按钮不可用
                loaded($("#loading"));  //清除loading
                palert("", xml, "关闭:0", "", "");
                return false;
                //document.location.reload();
            }
        }
    });
}


//作者:李修妙
//日期:2015.03.27
//功能:微心愿活动提交心愿
function wxyfb(xthis) {
    var name = $("#name").val();
    var mobi = $("#mobile").val();
    var unt = $("#unt").val();
    var content = $("#content").val();

    if (name.length <= 0) {
        palert(" ", "姓名不能为空", "关闭:0", "", "");
        return false;
    }

    if (mobi.length < 11) {
        palert(" ", "为了让认领人第一时间联系到你，手机号不能有误", "关闭:0", "", "");
        return false;
    }

    if (content.length <= 0) {
        palert(" ", "好好描述一下你的新年微心愿吧，说不定就有人帮你实现哦！", "关闭:0", "", "");
        return false;
    }

    content = replaceAll(content, "|", "/");

    var url = "/ajaxfuns.ashx?flag=13&num=" + Math.random();
    $.ajax({
        url: url,
        data: { content: escape(content), name: escape(name), mobi: mobi, unt: escape(unt) },
        type: "post",
        beforeSend: function () {
            $(xthis).html("提交中...");
        },
        error: function () { if (developing == 1) { palert(" ", "抱歉,产生未知错误,请刷新页面.", "关闭:0", "", ""); } return false; },
        success: function (data) {
            if (data.indexOf('succes') >= 0) {
                location.href = "/witches/wish-list.aspx";
            }
            else {
                palert(" ", data, "关闭:0", "", "");
            }
            $(xthis).html("发布我的微心愿");
        }
    });

}

function wxyshow(xthis, xid) {
    $("#wxy_cmt").html("<b>认领[" + $(xthis).parent().next().html() + "]的心愿</b>");
    $("#xid").val(xid);
    $("#sb_btn_div").html("<button class='btn btn-warning btn-block' onclick='wxyrl(this)'><i class='icon-plus'></i>领取TA的心愿</button>")
    location.href = "#wxy_cmt";
}

function wxyfbshow(xthis) {
    $("#wxy_cmt").html("我的微心愿");
    $("#xid").val("");
    $("#sb_btn_div").html("<button class='btn btn-warning btn-block' onclick='wxyfb(this)'><i class='icon-plus'></i>发布我的微心愿</button>")
    location.href = "#wxy_cmt";
}

//作者:李修妙
//日期:2015.03.27
//功能:微心愿活动领取心愿
function wxyrl(xthis) {
    var xid = $("#xid").val();
    var name = $("#name").val();
    var mobi = $("#mobile").val();
    var unt = $("#unt").val();
    var content = $("#content").val();

    if (name.length <= 0) {
        palert(" ", "姓名不能为空", "关闭:0", "", "");
        return false;
    }

    if (mobi.length < 11) {
        palert(" ", "为了让认领人第一时间联系到你，手机号不能有误", "关闭:0", "", "");
        return false;
    }

    if (content.length <= 0) {
        palert(" ", "既然要帮助他，就说点啥吧~", "关闭:0", "", "");
        return false;
    }

    content = replaceAll(content, "|", "/");

    var url = "/ajaxfuns.ashx?flag=14&num=" + Math.random();
    $.ajax({
        url: url,
        data: { content: escape(content), name: escape(name), mobi: mobi, unt: escape(unt), xid: xid },
        type: "post",
        beforeSend: function () {
            $(xthis).html("提交中...");
        },
        error: function () { if (developing == 1) { palert(" ", "抱歉,产生未知错误,请刷新页面.", "关闭:0", "", ""); } return false; },
        success: function (data) {
            if (data.indexOf('succes') >= 0) {
                location.href = "/witches/wish-list.aspx";
            }
            else {
                palert(" ", data, "关闭:0", "", "");
            }
            $(xthis).html("领取TA的心愿");
        }
    });

}

//作者:刘俊研
//日期:20150328
//功能:
function subchat(xid)
{
    var content = $("#content").val();
    var name = $("#name").val();
    if (content.length <= 0)
    {
        alert("对话内容不能为空！");
        return false;
    }
    var iflag = $("#iflag").val();
    if (name.length <= 0)
    {
        alert("嘉宾或主持人姓名不能为空!");
        return false;
    }
    var url = "/ajaxfuns.ashx?flag=17&num=" + Math.random();
    $.ajax({
        url: url,
        data: { content: escape(content), name: escape(name), iflag:iflag ,xid:xid},
        type: "post",
        beforeSend: function () {
            //$(xthis).html("提交中...");
        },
        error: function () { if (developing == 1) { alert("抱歉,产生未知错误,请刷新页面."); } return false; },
        success: function (data) {
            if (data.indexOf('fail') >= 0) {
                alert(data);
            }
            else {
                alert("发布成功!");
                $("#chat_list").prepend(data);
            }
        }
    });
}

function ing_uppic(xid)
{
    var content = $("#uppicdiv").html();
    xalert(content);
}



//2014-11-26
//张宝媛
//一站到底疯狂猜图开始按钮
function nsgostart() {
    url = "/ajaxfuns.ashx?flag=13&num=" + Math.random();
    $.ajax({
        url: url,
        data: {},
        type: 'GET',
        timeout: 5000,
        dataType: 'html',
        beforeSend: function () {
        },
        error: function () {
            xalert("抱歉,产生未知错误，请刷新页面."); return false;
        },
        success: function (xml) {
            if (xml.indexOf("success") >= 0) {
                nstopic_go();
                setcookie("gateflag", "", 0);   //清除过关标志
                $("#index_div").hide(200);
                $("div#gate01-list").show(200);
                $("body").removeClass("yzdd-bg");
                $("body").addClass("ct-bg");
            }
            else {
                palert("明天再来", xml, "知道了:1", "", "");
            }
        }
    });
}

//2015-04-08
//李修妙
//龙岗一站到底开始闯关
function nstopic_go() {
    url = "/ajaxfuns.ashx?flag=12&num=" + Math.random();
    $.ajax({
        url: url,
        data: {},
        type: 'GET',
        timeout: 5000,
        dataType: 'html',
        beforeSend: function () {
        },
        error: function () {
            $.prompt("哎啊,好像网络有点问题,要不咱重新来过?", {
                title: "网络有点问题",
                buttons: { "没事,再来": true, "啊,好吧,来吧": false },
                submit: function (e, v, m, f) {
                    window.location.reload();
                }
            });
        },
        success: function (xml) {
            if (xml.length > 0) {
                $("#gate01-list").html(xml);
            }
        }
    });
}

//2015-04-08
//李修妙
//龙岗一站到底结果判断
function nstopic_li_click(intro, xthis) {
    var i = 1;
    var k = 0;
    var content;
    var wcount = getcookie("wcount");
    if ($(xthis).attr("id").indexOf("correct") >= 0)  //正确
    {
        wcount++;
        if (wcount < 3) {
            //content = "恭喜你，答题正确！您已答对" + wcount + "道题，还剩" + (3 - wcount) + "道题就能通关啦，继续加油哦！<br /><div class='tz-p'>" + intro + "</div>";
            content = "<div class='media media-lr'>";
            content += "<div class='media-body'>";
            content += "<h4 class='media-head-sp'>";
            content += "您已答对" + wcount + "道题，还剩" + (3 - wcount) + "道题就能通关啦，继续加油哦！";
            content += "</h4>";
            content += "<p class='fontgray'>";
            content += intro;
            content += "</p>";
            content += "</div>";
            content += "</div>";
            palert("答对啦", content, "下一题:1", "", "");
        }
        if (wcount == null) {
            wcount = 0;
        }
        setcookie("wcount", wcount, 0)
        if (wcount >= 3) {
            //三道题答对了，生成过关cookie  gateflat=1
            //并清除pflag标志，这是选择刮后或打印的cookie
            setcookie("gateflag", "1", 0);
            setcookie("pflag", "", 0);
            content = "<div class='media media-lr'>";
            content += "<div class='media-body'>";
            content += "<h4 class='media-head-sp'>";
            content += "通关啦，继续加油哦！";
            content += "</h4>";
            content += "<p class='fontgray'>";
            content += intro;
            content += "</p>";
            content += "</div>";
            content += "</div>";
            palert("恭喜您", content, "去参加大转盘抽奖吧:1:gowin()", "", "");
            setcookie("gtime", "0", 1);
            //window.location = "nsguess-win.aspx";
            setcookie("wcount", "0", 0);
        }
        if (wcount < 3) {
            nstopic_go();
        }
    }
    else {
        //content = "这道题目答错啦，这一题的答案是“" + $(xthis).attr("id") + "”，要继续加油哦。<br /><div class='tz-p'>" + intro + "</div>";
        content = "<h4 class='media-head-sp'>";
        content += "这一题的答案是“" + $(xthis).attr("id") + "”，要继续加油哦";
        content += "</h4>";
        content += "<p class='fontgray'>";
        content += intro;
        content += "</p>";
        palert("答错啦", content, "下一题:1", "", "");
        nstopic_go();
    }
}

function gowin() {
    window.location = "luckdisc.aspx?xid=" + Math.random() + "";
}
//开始按钮自适应
function resizebtn() {
    if ($("#start_btn2").length > 0) {
        if ($(window).height() < 490) {
            $("#start_btn2").parent().css("margin-top", $(window).height() - $(window).height() * 0.94);
        }
        else {
            $("#start_btn2").parent().css("margin-top", $(window).height() - $(window).height() * 0.8);
        }
    }
}

//抽奖次数控制
//李修妙 2015.04.08改
//陈有法
//2014.6.16
function mykz(category, xthis) {
    var url = "/ajaxfuns.ashx?flag=10&num=" + Math.random();
    $.ajax({
        url: url,
        data: { category: category },
        async: true,
        type: 'GET',
        timeout: 5000,
        dataType: 'html',
        beforeSend: function () {
        },
        error: function () {palert(" ", "抱歉,产生未知错误,请刷新页面.", "关闭:0", "", "") },
        success: function (html) {
            if (html.indexOf("true") >= 0) {
                if (category == "disc") {
                    lottery(category);
                }
                else if (category == "disc2")
                {
                    lottery(category);
                }
            }
            else if (html.indexOf("false") >= 0) {
                palert(" ", "<img src='http://7xin0o.com2.z0.glb.qiniucdn.com/lookatus.png'><br>抽奖次数用完了！！", "关闭:0", "", "");
            }
            else {
                palert(" ",html,"关闭:1","","");
            }
        }
    });
}
//disc 大转盘程序
//李修妙 2015.04.08改
//陈有法
//2014.6.16
function lottery() {
    $(document).ready(function () {
        var OutHtml = "";
        htmlobj = $.ajax({
            type: 'GET',
            async: true,
            url: '/ajaxfuns.ashx?flag=11',
            dataType: 'json',
            beforeSend: function () {
                OutHtml = "奖品送完啦,更多精彩请关注龙岗发布.<br><br><img src='http://7xin0o.com2.z0.glb.qiniucdn.com/lookatus.png'>";
                palert(" ", OutHtml, "关闭:0", "", "");
                return false;

                //预先友好旋转
                $("#startbtn1").rotate({
                    duration: 3600, //转动时间 
                    angle: 0,
                    cache: false,
                    animateTo: 3000 //转动角度          
                });
            },
            cache: false,
            error: function () {
                palert(" ", "出错了！", "关闭:0", "", "");
                return false;
            },
            success: function (json) {
                var a = Number(json[0].jd); //角度 
                var p = Number(json[0].id); //奖项 
                var z = json[0].jp;//奖品
                $("#startbtn1").rotate({
                    duration: 3600, //转动时间 
                    angle: 0,
                    cache: false,
                    animateTo: 1800 + a, //转动角度 
                    easing: $.easing.easeOutSine,
                    callback: function () {
                        var share = getcookie("share1");

                        
                        if (share == "share1") {
                            OutHtml = "恭喜你抽中<span style='color:red;'>" + z + "</span>元话费!<br><img src='http://7xin0o.com2.z0.glb.qiniucdn.com/lookatus.png'>";
                            palert(" ", OutHtml, "关闭:0", "", "");
                        }
                        else {
                            OutHtml += "恭喜你抽中<span style='color:red;'>" + z + "</span>元话费!<br><img src='http://7xin0o.com2.z0.glb.qiniucdn.com/lookatus.png'>";
                            OutHtml += "  <div>";
                            OutHtml += "    <input maxlength='12'  class='col-xs-11' data-inset='onlyint'  maxlength='11' type='text' id='upmobi' placeholder='你的手机号码，以便充值话费' class='mobi-input mp20' />";
                            OutHtml += "  </br></br><p id='mobi-tips' style='color:red;'></p>";
                            OutHtml += "      <div class='col-xs-6' style='padding-left: 0px;'><button style='margin:9px 0px;' onclick='print_pic()' class='btn btn-warning btn-block mp20 mb20'>确认</button></div>";
                            OutHtml += "      <div class='col-xs-6' style='padding-right: 0px;' '><button style='margin:9px 0px;' onclick='jqibox_remove()' class='btn btn-default btn-block mp20 mb20'>关闭</button></div>";
                            OutHtml += "  </div>";
                            palert(" ", OutHtml, "", "", "");
                        }
                    }
                });
            }
        });
    });
}

function jqibox_remove() {
    $(".jqibox").remove();
}
function print_pic()
{
    var phoneno = $("#upmobi").val();
    if (phoneno.length <= 0) {
        $("#mobi-tips").html("*手机号不能为空");
    }
    else if (checkMobilePhone(phoneno) == false) {
        $("#mobi-tips").html("*您的号码输入有误，请查证");
    }
    else {
        var url = "/ajaxfuns.ashx?flag=8&num=" + Math.random();
        $.ajax({
            url: url,
            data: { phoneno: phoneno },
            async: true,
            type: 'GET',
            timeout: 5000,
            dataType: 'html',
            beforeSend: function () {
            },
            error: function () { palert(" ", "抱歉,产生未知错误,请刷新页面.", "关闭:0", "", "") },
            success: function (html) {
                if (html.indexOf("success") >= 0) {   
                    palert(" ", "<img src='http://7xin0o.com2.z0.glb.qiniucdn.com/lookatus.png'><br>分享后可以继续抽奖！", "关闭:0", "", "")
                }
                else {
                    palert(" ", "抱歉,产生未知错误,请重新试试.", "关闭:0", "", "")
                }
            }
        });
    }
}



//李修妙
//2015-03-18
//流量统计
function toTongji() {
    var URL = document.URL;
    var ScreenX = screen.width;
    var ScreenY = screen.height;
    var OS = getOS();
    var Brower = getBrower();
    var lightApp = document.title;
    var url = "/ajaxfuns.ashx?flag=4&num=" + Math.random();

    $.ajax({
        url: url,
        data: { URL: URL, ScreenX: ScreenX, ScreenY: ScreenY, OS: OS, Brower: Brower, lightApp: lightApp },
        type: 'get',
        timeout: 10000,
        dataType: 'html',
        beforeSend: function () { },
        error: function () { },
        success: function (xml) { }
    });
}

//李修妙
//2015-03-18
//获取浏览器
function getBrower() {
    var ua = getUA();
    if (ua.indexOf("Maxthon") != -1) {
        return "Maxthon";
    } else if (ua.indexOf("MSIE") != -1) {
        return "MSIE";
    } else if (ua.indexOf("Firefox") != -1) {
        return "Firefox";
    } else if (ua.indexOf("Chrome") != -1) {
        return "Chrome";
    } else if (ua.indexOf("Opera") != -1) {
        return "Opera";
    } else if (ua.indexOf("Safari") != -1) {
        return "Safari";
    } else {
        return "unknow";
    }
}

//李修妙
//2015-03-18
//获取ua
function getUA() {
    var ua = navigator.userAgent;
    if (ua.length > 250) {
        ua = ua.substring(0, 250);
    }
    return ua;
}

function statInitLE() {
    var getURL = document.URL;
    var getScreenX = screen.width;
    var getScreenY = screen.height;
    var getOS = navigator.platform;
    var getPageTitle = document.title;
    var url = "/ajaxfuns.ashx?flag=4&num=" + Math.random();

    $.ajax({
        url: url,
        data: { getURL: getURL, getScreenX: getScreenX, getScreenY: getScreenY, getOS: getOS, getPageTitle: getPageTitle },
        type: 'get',
        timeout: 10000,
        dataType: 'html',
        beforeSend: function () {
        },
        error: function () {
            return false;
        },
        success: function (xml) {

        }
    });
}

//李修妙
//2015-03-18
//获取操作系统
function getOS() {
    return navigator.platform;
}

//加载滚动条
function dreamsmillescroll(pagesize) {

    var url = "/ajaxfuns.ashx?flag=7&num=" + Math.random();
    //绑定滚动条
    $(window).bind("scroll", function (event) {
        var pageindex = $("#pageindex").val();
        var scrollTop = $(this).scrollTop();//为滚动条在Y轴上的滚动距离。
        var scrollHeight = $(document).height();//文档高度
        var windowHeight = $(this).height();//窗体高度

        //滚动条是否到底
        if (scrollTop + windowHeight != scrollHeight) {
            $("#moreInfo").attr("class", "ui-dialog ui-dialog-notice hide");
            return false;
        }
        if (qjvalue != pageindex) {//防止重复显示
            qjvalue = pageindex;
        }
        else {
            return false;
        }
        $("#loadDiv").attr("class", "ui-dialog ui-dialog-notice show");
        //数据加载区
        $.ajax({
            url: url,
            data: { pageindex: pageindex, pagesize: pagesize },
            type: 'get',
            timeout: 10000,
            dataType: 'html',
            error: function () {
                alert("抱歉，网络异常请稍后再试！");
                $("#loadDiv").attr("class", "ui-dialog ui-dialog-notice hide");
            },
            success: function (xml) {
                //$("#loading").css("display", "none");
                $("#loadDiv").attr("class", "ui-dialog ui-dialog-notice hide");
                if (xml.length > 0) {
                    pageindex++;
                    $("#pageindex").val(pageindex);
                    //设置每条数据div高度
                    //$('.list-card').css("height", $(window).height() + 100);
                    //可以根据实际情况，获取动态数据加载 到 div1中
                    $(xml).appendTo($('#media_list'));
                }
            }
        });
    });
}
 
//李修妙
//2015-5-15
//立即购买
function buynow_btn(xid) {
    var url = "/ajaxfuns.ashx?flag=8&num=" + Math.random();
    $.ajax({
        url: url,
        data: { xid: xid },
        type: 'get',
        timeout: 10000,
        dataType: 'html',
        error: function () {
            alert("抱歉，网络异常请稍后再试！");
        },
        success: function (xml) {
            palert("", xml, "", "", "");
        }
    })

}
//李修妙
//2015-5-15
//库存为0时提示按钮
function stockempty_btn() {
    palert(" ","此商品暂时缺货","关闭:0","","")
}

//李修妙
//2015-5-15
//购物车，尚未使用该功能，原因：功能为完善
function shoppingcart_btn(xid) {
    var url = "/ajaxfuns.ashx?flag=9&num=" + Math.random();
    $.ajax({
        url: url,
        data: { xid: xid },
        type: 'get',
        timeout: 10000,
        dataType: 'html',
        error: function () {
            alert("抱歉，网络异常请稍后再试！");
        },
        success: function (xml) {
            palert("", xml, "", "", "");
        }
    })
}
//李修妙
//2015-5-15
//增加按钮
function add_btn() {
    var count1 = $("#count1").val();
    count1 = Number(count1) + 1;
    document.getElementById('count1').value = count1;
    
}
//李修妙
//2015-5-15
//减少按钮
function sub_btn()
{
    var count1 = $("#count1").val();
    if (Number(count1) > 1)
    {
        count1 = Number(count1) -1;
        document.getElementById('count1').value = count1;
    }
}
//李修妙
//2015-5-15
//立即购买下一步按钮
function next_btn(xid) {
    var count = $("#count1").val();
    var count = $("#count1").val();
    var url = "/ajaxfuns.ashx?flag=10&num=" + Math.random();
    $.ajax({
        url: url,
        data: { xid: xid, count: count },
        type: 'get',
        timeout: 10000,
        dataType: 'html',
        error: function () {
            alert("抱歉，网络异常请稍后再试！");
        },
        success: function (xml) {
            window.location = "/wxpay/jsapipaypage.aspx";
        }
    })

}
//李修妙
//2015-5-15
//加入购物车按钮
function shopcar_btn(xid)
{
    var count = $("#count1").val();
    var url = "/ajaxfuns.ashx?flag=10&num=" + Math.random();
    $.ajax({
        url: url,
        data: { xid: xid,count:count },
        type: 'get',
        timeout: 10000,
        dataType: 'html',
        error: function () {
            alert("抱歉，网络异常请稍后再试！");
        },
        success: function (xml) {
            palert("", "加入购物车成功", "关闭:0", "", "");
        }
    })
}

function close_btn() {
    $(".jqibox").remove();
}
//李修妙
//2015-5-15
//收货地址录入数据库
function addr_sumbit() {
    var name = $("#name").val().trim();
    var addr = $("#addr").val().trim();
    var mobi = $("#mobi").val().trim();

    if (name.length <= 0) {
        $("#notice").html("*请输入收件人姓名");
        return false;
    }
    if (addr.length <= 0) {
        $("#notice").html("*请输入收件地址");
        return false;
    }
    if (checkMobilePhone(mobi) == false) {
        $("#notice").html("*请正确输入联系电话");
        return false;
    }

    url = seturl(3);
    $.ajax({
        url: url,
        data: {
            name: escape(name), addr: escape(addr), mobi: mobi
        },
        type: 'GET',
        timeout: 5000,
        dataType: 'html',
        beforeSend: function () { },
        error: function () { if (developing == 1) { alert("抱歉,产生未知错误,请刷新页面."); } return false; },
        success: function (xml) {
            palert(" ", "保存成功", "关闭:0:location='JsApiPayPage.aspx'", "", "");
        }
    });
}
//李修妙
//2015-5-15
//收货地址添加
function payaddr() {
    var OutHtml = "";
    OutHtml += "<div class='p16-3'>";
    OutHtml += "<div class='col-xs-1' style='  position: absolute; top:0px;right:0px;'>";
    OutHtml += "<a onclick='close_btn()'><img src='/images/close.png'/></a>";
    OutHtml += "</div>";
    OutHtml += "<div class='form-group col-xs-12'>";
    OutHtml += "<input type='text' id='name' class='form-control' placeholder='收件人姓名' maxlength='20' runat='server' />";
    OutHtml += "</div>";
    OutHtml += "<div class='form-group col-xs-12'>";
    OutHtml += "<input type='text' id='addr' class='form-control' placeholder='收件地址'  runat='server' />";
    OutHtml += "</div>";
    OutHtml += "<div class='form-group col-xs-12'>";
    OutHtml += "<input type='text' id='mobi' class='form-control form-group' onkeyup='this.value=this.value.replace(/\D/gi,'')' maxlength='11' placeholder='联系电话' runat='server' />";
    OutHtml += "</div>";
    OutHtml += "<div class='col-xs-12'>";
    OutHtml += "<span id='notice' style='font-size: 16px; color: red;'></span>";
    OutHtml += "</div>";
    OutHtml += "<div class='col-xs-12' style='margin-bottom: 15px;'><a onclick='addr_sumbit()' class='btn btn-warning' style='width: 100%'>保存</a></div>";
    OutHtml += "</div>";
    palert(" ", OutHtml, "", "", "");

}
//快递更新弹窗
//2015.5.16
//陈有法
function showExpress(xid) {

    var outhtml = "";

    outhtml += "<div class='clearfix'>";
    outhtml += "<div class='clearfix' style='margin-bottom: 10px;'>";
    outhtml += "    <div class='col-xs-4 text-right'>快递单号:</div>";
    outhtml += "    <div class='col-xs-8 text-left'><input style='border-radius: 7px;' id='Expressnum' values=''></div>";
    outhtml += "</div>";
    outhtml += "<div class='clearfix'>";
    outhtml += "    <div class='col-xs-4 text-right'>快递名称:</div>";
    outhtml += "    <div class='col-xs-8 text-left'>";
    outhtml += "        <input id='Expressname' values='' style='border-radius: 7px;' onkeyup='query_Express($(this).val())'>"
    outhtml += "        <div style='width: 177px;'>";
    outhtml += "            <ul id=listuls class='listuls' style='display:none'>";
    outhtml += "            </ul>";
    outhtml += "        </div>";
    outhtml += "    </div>";
    outhtml += "</div>";
    outhtml += "<div class='clearfix' style='height: 33px;color:red;text-align:center' id=Expressnews></div>";
    outhtml += "<div >";
    outhtml += "    <a style='width:49%;float:left;margin-right: 1%;' onclick=\"sentExpress(" + xid + ",$('#Expressnum').val(),$('#Expressname').val())\" class='btn btn-primary'>确认<span id='login-btn'></span></a>";
    outhtml += "    <a style='width:50%' onclick=\"$('.jqibox').remove()\" type='button' class='btn btn-default'>关闭<span id='login-btn'></span></a>";
    outhtml += "</div>";
    outhtml += "</div>";
    palert("快递单号维护", outhtml, "", "", "")
}
//快递更新
//2015.5.16
//陈有法
function sentExpress(xid, Expressnum, Expressname) {

    var loadbox = $("#loading");  //loading加载对象

    if (Expressnum.length == 0) {
        $("#Expressnews").html("快递单号不能为空！");
        return false;
    }
    if (Expressname.length == 0) {
        $("#Expressnews").html("快递名称不能为空！");
        return false;
    }
    var url = "/ajaxfuns.ashx?flag=11&num=" + Math.random();
    $.ajax({
        url: url,
        data: { xid: xid, Expressnum: Expressnum, Expressname: Expressname },
        type: 'GET',
        timeout: 5000,
        dataType: 'html',
        beforeSend: function () {
            lockbtn($("#login-btn"));
            loading(loadbox);
        },
        error: function () { if (developing == 1) { xalert("抱歉，网络异常，请刷新页面后再试！"); } return false; },
        success: function (xml) {
            if (xml.indexOf("success") >= 0) {
                $(".jqibox ").remove();
                location.reload();
            }
        }
    });
}
//快递公司类似百度搜索
//2015.5.16
//陈有法
function query_Express(Expressname) {
    $("#listuls").html("");
    $("#listuls").show();
    if (Expressname.length == 0) {
        return false;
    }
    $("#listuls").parent().show();
    var url = "/ajaxfuns.ashx?flag=13&num=" + Math.random();
    $.ajax({
        url: url,
        data: { Expressname: Expressname },
        type: 'GET',
        timeout: 5000,
        dataType: 'html',
        beforeSend: function () {  
        },
        error: function () { if (developing == 1) { xalert("抱歉，网络异常，请刷新页面后再试！"); } return false; },
        success: function (xml) {
            $("#listuls").append(xml);
        }
    });
}
//快递选择
//2015.5.16
//陈有法
function select_Express(xthis)
{
    $('#Expressname').val($(xthis).text());
    $("#listuls").parent().hide();

}


//作者：李修妙
//日期：2015-05-21
//功能：话费充值
function phone_charge() {
    var phonenoid = $("input[name='inputtxt']").val();
    var OutHtml = "";
    if (phonenoid.length <= 0) {
        palert(" ", "您未选中任何项!", "关闭:0", "", "");
    }
    else {
        OutHtml += "<div class='col-xs-12'>"
        OutHtml += "<a onclick=\"recharge('recharge')\" class='btn btn-success col-xs-12' style='margin-bottom: 15px;' >只充值话费</a>";
        OutHtml += "<a onclick=\"recharge('recharge_sendmsg')\" class='btn btn-warning col-xs-12' style='margin-bottom: 15px;' >充值话费并发送短信</a>";
        OutHtml += "<a onclick='close_btn()' class='btn btn-default col-xs-12'style='margin-bottom: 35px;' >关闭</a>";
        OutHtml += "</div>";
        palert(" ", OutHtml, "", "", "");
    }

}
function close_btn() {
    $(".jqibox ").remove();
}

//作者：李修妙
//日期：2015-05-21
//功能：话费充值
function recharge(recharge) {
    $(".jqibox ").remove();
    var phonenoid = $("input[name='inputtxt']").val();
    var msg_value = $("#msg_value").val();
    var vb1 = $("#vb1").val();
    var vb2 = $("#vb2").val();
    var OutHtml = "";
    url = "/ajaxfuns.ashx?flag=12&num" + Math.random();

    if (phonenoid.length <= 0) {
        palert(" ", "您未选中任何项!", "关闭:0", "", "");
    }
    else {
        if (recharge == "recharge") {
            msg_value = "phone";
            $.ajax({
                url: url,
                data: { id: phonenoid, msg_value: msg_value },
                type: 'GET',
                timeout: 5000,
                dataType: 'html',
                beforeSend: function () {
                    $("#loding").html("<img src='/images/loading1.gif'class='loading' style='width:15px' />");
                },
                error: function () { if (developing == 1) { alert("抱歉,产生未知错误,请刷新页面."); } return false; },
                success: function (xml) {
                    $("#loding").html("");
                    palert(" ", "充值完成", "关闭:0:location.reload()", "", "");
                }
            });
        }
        else if (recharge == "recharge_sendmsg") {
            $("#msg_write").show();
        }
        else if (recharge == "rc_msg") {
            if (vb1.length < 1) {
                palert(" ", "变量不能为空", "关闭:0", "", "");
            }
            else {
                $.ajax({
                    url: url,
                    data: { id: phonenoid, msg_value: msg_value, vb1: vb1, vb2: vb2 },
                    type: 'GET',
                    timeout: 5000,
                    dataType: 'html',
                    beforeSend: function () {
                        $("#loding1").html("<img src='/images/loading1.gif'class='loading' style='width:15px' />");
                    },
                    error: function () { if (developing == 1) { alert("抱歉,产生未知错误,请刷新页面."); } return false; },
                    success: function (xml) {
                        $("#loding1").html("");
                        palert(" ", "充值完成", "关闭:0:location.reload()", "", "");
                    }
                });
            }
        }
        else if (recharge == "rc_msgcheck") {
            OutHtml += "<div>";
            OutHtml += "<p><p>【政能量】感谢您对<span style='color:red;'>" + vb1 + "</span>活动的支持，<span style='color:red;'>系统生成</span>元话费已落入您的口袋，快去看看吧。请您继续关注<span style=;color:red;'>" + vb2+ "</span></p>";
            OutHtml += "</div>";
            palert(" ", OutHtml, "关闭:0", "", "")
        }
        else if (recharge == "rc_msgdefault") {
            $("#msg_write").hide();
        }
    }
}

