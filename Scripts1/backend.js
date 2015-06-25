$(document).ready(function () {
    //渲染表单属性
    init_form();

	//渲染按钮
    init_rendering();

    formatth();

	//内容过长缩放
    flexdiv();

    //必填项初始化
    initmand();

    if (developing == 1) {
        subarea();
        process();
        $(".side-nav-menu li").css("padding-left", "8px");
    }
	
	//后台导航按钮标识
    bar_active();

    //时间选择初始化
    if ($('#datetimepicker').length > 0) {
        $('#datetimepicker').datetimepicker({
            format: 'yyyy-MM-dd hh:mm:ss'
        });
    }
});


//
function formatth()
{
    $("th[data-noheight!=1]").css({ 'height': '28px', 'line-height': '28px' });
    $("th[data-noheight=1]").css({ 'height': '28px', 'line-height': '14px'});
}

//内容过长缩放
function flexdiv(){
    $(".flexdiv").mouseover(function (e) {
        $(this).css({ position: "absolute", overflow: "auto" });
        if ($(this).width() - $(this).parent().width() > 0) {
            $(this).addClass("flexdiv2");
        }   
    });
    $(".flexdiv").mouseout(function (e) {
        $(this).css({ position: "relative", overflow: "hidden" });
        $(this).removeClass("flexdiv2");
    });
}

//渲染表单属性
function init_form() {
    $("form > .form-group > label").addClass("col-sm-2 control-label");
    $("form > .form-group > div").addClass("col-md-3");
    $("form > .form-group > div > input[type=text],form > .form-group > div > textarea,form > .form-group > div > select").addClass("form-control");
    $("form > .form-group > div > textarea").parent().removeClass("col-md-3");
    $("form > .form-group > div > textarea").parent().addClass("col-md-6");
	$("form > .form-group > div > input[type=password]").addClass("form-control");
    $("form > .form-group > span").addClass("help-inline");

    //确定按钮
    $("form > .form-group > div:last").attr("class", "col-sm-offset-2 col-sm-10");

    //排除input
    $("form > .form-group > div > input[data-class=none]").removeClass("form-control");

	//排除div
	$("form > .form-group > div[id=0]").removeClass("col-md-3");

    //分页
    $("#pagenav").addClass("pagination pagination-sm mg-tb-none");
	
	//表单可见
	$("form").show();
}




//渲染按钮
function init_rendering()
{
    $(".Encircle a").each(function(index, element) {
        if ($(this).text().indexOf("返回")>=0)
		{
            $(this).prepend('<span class="glyphicon glyphicon-arrow-left"></span>');
            $(this).addClass("btn btn-warning btn-sm");
		}
        if ($(this).text().indexOf("增加")>=0)
		{
            $(this).prepend('<span class="glyphicon glyphicon-plus"></span>');
            $(this).addClass("btn btn-primary btn-sm");
		}
        else if ($(this).text().indexOf("取消")>=0)
		{
            $(this).prepend('<span class="glyphicon glyphicon-remove"></span>');
            $(this).addClass("btn btn-warning btn-sm");
		}
        else if ($(this).text().indexOf("刷新")>=0)
		{
            $(this).prepend('<span class="glyphicon glyphicon-refresh"></span>');
            $(this).addClass("btn btn-success btn-sm");
			$(this).attr("href","javascript:location.reload()");
		}
    });
    $(".btn_box a").each(function(index, element) {
        if ($(this).text().indexOf("删除")>=0)
		{
            $(this).prepend('<span class="glyphicon glyphicon-trash"></span>');
            $(this).addClass("btn btn-danger btn-xs");
		}
        else if ($(this).text().indexOf("激活")>=0)
		{
            $(this).prepend('<span class="icon-unlock"></span>');
            $(this).addClass("btn btn-info btn-xs");
        }
        else if ($(this).text().indexOf("通过") >= 0) {
            $(this).prepend('<span class="glyphicon glyphicon-ok"></span>');
            $(this).addClass("btn btn-info btn-xs");
        }
        else if ($(this).text().indexOf("冻结")>=0)
		{
            $(this).prepend('<span class="icon-lock"></span>');
            $(this).addClass("btn btn-primary btn-xs");
		}
    });
    $("input[type=submit]").addClass("btn btn-primary");
}



//初始化表单必填项
function initmand() {
    $("*[data-mandatory]").each(function (index, element) {
        for (var i = 1; i < 5; i++) {
            if (i == 1) {
                if ($(this).parent().prev().length > 0) {
                    if ($(this).parent().prev().attr("class").indexOf("control-label") >= 0) {
                        $(this).parent().prev().prepend('<i class="asterisk">*</i>');
                        break;
                    }
                }
            }
            else if (i == 2) {
                if ($(this).parent().parent().prev().length > 0) {
                    if ($(this).parent().parent().prev().attr("class").indexOf("control-label") >= 0) {
                        $(this).parent().parent().prev().prepend('<i class="asterisk">*</i>');
                        break;
                    }
                }
            }
            else if (i == 3) {
                if ($(this).parent().parent().parent().prev().length > 0) {
                    if ($(this).parent().parent().parent().prev().attr("class").indexOf("control-label") >= 0) {
                        $(this).parent().parent().parent().prev().prepend('<i class="asterisk">*</i>');
                        break;
                    }
                }
            }
            else if (i == 4) {
                if ($(this).parent().parent().parent().parent().prev().length > 0) {
                    if ($(this).parent().parent().parent().parent().prev().attr("class").indexOf("control-label") >= 0) {
                        $(this).parent().parent().parent().parent().prev().prepend('<i class="asterisk">*</i>');
                        break;
                    }
                }
            }
        }
    });
}


//后台导航按钮标识
function bar_active()
{
    $(".side-nav-menu li").click(function(e) {
		setcookie("benav",$(this).text(),0);
    });
	
	$(".side-nav-menu li").each(function(index, element) {
        if ($(this).text()==getcookie("benav"))
		{
			$(this).addClass("active");	
		}
    });
}