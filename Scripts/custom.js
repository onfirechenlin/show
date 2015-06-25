var developing = 1;   //开发状态为1
var obj;

var endFlag = 0;
var eraser_flag = 0;  //是否已擦掉,未擦不可翻页

var pageIndex = 1;  //当前页码

var seconds;    //加载所要的时间


$(document).ready(function () {
    $("#bgmusic")[0].play();
})


//徐进钊
//2015-05-15
//计算页面加载时间
function getPageLoadTime() {
    var afterload = (new Date()).getTime();
    seconds = (afterload - beforeload) / 1000;
    if (developing == 1) {
        //$('#load_time').text('未正式发布或更新状态  load time : ' + seconds + ' sec.');
    }
}

window.onload = function (){
	toTongji(); //流量统计
	$("#loading").hide();
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
	
	$.ajax({
		url: seturl(4),
		data: { URL: URL, ScreenX: ScreenX, ScreenY: ScreenY, OS: OS, Brower: Brower, lightApp: lightApp, loadtime: seconds },
		type: 'get',
		timeout: 10000,
		dataType: 'html',
		beforeSend: function () {},
		error: function () {},
		success: function (xml) {}
	});
}

//李修妙
//2015-03-18
//获取操作系统
function getOS() {
	return navigator.platform;
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

function later1(){
	//$("#pageindex").text($("div[class*='page-current']").attr("data-pageindex"));	
	$("#pageindex2").text(pageIndex);	
}

//徐进钊
//2015-03-24
//手势出现与否
function handhs()
{
	if (pageIndex == 8) {
		$("#hand").hide();
	}
	else {
		$("#hand").show();
	}
}

Zepto(function ($) {
    var xthis;
    var rndN;
	
    //手指向下滑动时触发
    $('body').swipe(function () {
        //手势出现与否
        handhs();
    })
    
    //手指向下滑动时触发
    $('body').swipeDown(function () {
        //首页时不允许往后翻
        if (pageIndex ==1) {
            return false;   
        }
        //手势出现与否
        handhs();
    })
    //手指向上滑动时触发
    $('.page').swipeUp(function () {
        $("#bgmusic")[0].play();
        //手势出现与否
        handhs();
        if (pageIndex == 2) {
            if ($("#page-2").attr("data-go") == "0") {
                $("#p1-1").css("display","block");
                $("#p1-1").addClass("fadeInUp animated");
                $("#page-2").attr("data-go", "1");
                return false;
            }
            else if ($("#page-2").attr("data-go") == "1") {
                $("#p1-2").attr("src", "http://7xj307.com2.z0.glb.qiniucdn.com/p2-1.1.png");
                $("#page-2").attr("data-go", "2");
                return false;
            }
            else if ($("#page-2").attr("data-go") == "2") {
                return true;
            }

        }
        if (pageIndex <3) {
            delayLoadPic();
	    }
	})



    //分享朋友圈按钮
    $("#share").tap(function () {
        share();
    })
    $("#share-wx-img").tap(function () {
        $("#share-wx").hide();
    })
    $("#power").tap(function () {
	    light_copyright();
	})
	$("#close_copyright").tap(function () {
	    close_copyright();
	})
})

//徐进钊
//2014-5-8
//功能:构造ajax url 带随机数
function seturl(flag) {
    url = "/ajaxfuns.ashx?flag=" + flag + "&num=" + Math.random();
    return url;
}

//徐进钊
//2015-3-16
//功能:从0到N的随机数,如rndNum(5)就是1-5之间的随机数
function rndNum(n)
{
    if (n > 0) {
        return parseInt(Math.random() * n + 1);
    }
    else {
        return parseInt(Math.random() * 10 + 1);
    }
}

//徐进钊
//2015-03-16
//分享朋友圈
function share() {
    $("#share-wx").css({
        "position": "absolute",
        "display":"block",
        "z-index": "1"
    });
}


//显示版权
//徐进钊
//2015-02-10
function light_copyright() {
    $("#copyright-box").show();
}

//关闭显示版权
//徐进钊
//2015-02-10
function close_copyright() {
    $("#copyright-box").hide();
}

//徐进钊
//2015-05-06
//延迟加载背景和图片
//用途对图片和背景图片进行延迟加载
//data-bg=''   是背景图片
//data-src=''  是图片
//注意:需要延迟的背景图片和图片请不要加载图片
//例子1:<div class="page page-10 hide" data-bg="http://7xi6im.com2.z0.glb.qiniucdn.com/p10-1.jpg">
//例子2:<img data-src="http://7xi6im.com2.z0.glb.qiniucdn.com/home_btn.png" src="none" alt="">
function delayLoadPic() {
    $("img[data-src]").each(function (index, element) {
        if ($(this).attr("data-src").length > 0) {
            if ($(this).attr("src") == "none")  //如果当前图片为空
            {
                $(this).attr("src", $(this).attr("data-src"));
            }
        }
    });

    $("div[class^=page][data-bg]").each(function (index, element) {
        if ($(this).attr("data-bg").length > 0) {
            if ($(this).attr("data-bg").length > 10)  //如果当前背景为空
            {
                $(this).css("background-image", "url(" + $(this).attr("data-bg") + ")");
            }
        }
    });
}

//张宝媛
//2015-03-18
//背景音乐开关  
$('.music').tap(function () {
    if ($(this).hasClass("play")) {
        $(this).removeClass("play");
        $("#bgmusic")[0].pause();
    }
    else {
        $(this).addClass("play");
        $("#bgmusic")[0].play();
    }
});

/**
 * 检查输入的手机号码格式是否正确
 * 输入:str  字符串
 * 返回:true 或 flase; true表示格式正确
 */
function checkMobilePhone(str) {
    if (str.match(/^(?:13\d|15\d|18\d)-?\d{5}(\d{3}|\*{3})$/) == null) {
        return false;
    }
    else {
        return true;
    }
}

function submit_btn() {
    alert("报名时间已截止");
    return;
    var name = $("#name").val().trim();
    var addr = $("#addr").val().trim();
    var mobi = $("#mobi").val().trim();

    if (name.length <= 0) {
        document.getElementById("name").value = "姓名不能为空";
        return;
    }
    if (mobi.length <= 0) {
        document.getElementById("mobi").value = "联系方式不能为空";
        return;
    }
    if (checkMobilePhone(mobi) == false) {
        document.getElementById("mobi").value = "联系方式有误";
        return;
    }
    if (addr.length <= 0) {
        document.getElementById("addr").value = "所在地不能为空";
        return;
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
            if (xml.length > 4) {
                alert(xml);
            }
            else {
                window.location = "winning.aspx?num=" + xml + "";
            }
        }
    });
}