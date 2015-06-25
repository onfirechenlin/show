
//后台列表相关删除、置顶、冻结操作
function list_handle(handle, obj)
{
    var txtid = $("input[name='inputtxt']").val();
    if (txtid.length <= 0) {
        alert("您未选中任何项!"); return false;
    }
    if (handle == "删除") {
        if (confirm("确定删除吗?") == false)
            return false;
    }
    $.ajax({
        url: "/ajaxfuns.ashx?flag=1022&num"+Math.random(),
        data: { id: txtid, handle: escape(handle), obj: escape(obj) },
        type: 'GET',
        timeout: 5000,
        dataType: 'html',
        beforeSend: function () { },
        error: function () { return false; },
        success: function (xml) {
            if (xml.length > 0)
                location.reload();
            else
                alert("操作失败！");
        }
    });
}

function init_city(city, area)//初始化城市和区 提高用户体验
{
    $.ajax({
        url: "/Accouts/initcity",
        data: { city: city, area: area },
        type: "get",
        beforeSend: function () {
            $("#city").html("<option>初始化中...</option>");
        },
        error: function () { alert("抱歉,产生未知错误,请刷新页面."); return false; },
        success: function (data) {
            if (data.length > 0) {
                var array = data.split("|");
                $("#city").html(array[0]);
                $("#area").html(array[1]);
            }
        }
    });
}

function getcity() {
    var p = $("#province").val();
    $.ajax({
        url: "/Accouts/getcity",
        data: { province: p },
        type: "get",
        beforeSend: function () {
            $("#city").html("<option>数据加载中...</option>");
        },
        error: function () { alert("抱歉,产生未知错误,请刷新页面."); return false; },
        success: function (data) {
            if (data.length > 0) {
                $("#city").html(data);
                getarea();
            }
        }
    });
}

function getarea() {
    var c = $("#city").val();
    $.ajax({
        url: "/Accouts/getarea",
        data: { city: c },
        type: "get",
        beforeSend: function () {
            $("#area").html("<option>数据加载中...</option>");
        },
        error: function () { alert("抱歉,产生未知错误,请刷新页面."); return false; },
        success: function (data) {
            if (data.length > 0) {
                $("#area").html(data);
            }
        }
    });
}

//判断邮箱是否正确
function checkEmail(str) {
    if (str.match(/[A-Za-z0-9_-]+[@](\S*)(net|com|cn|org|cc|tv|[0-9]{1,3})(\S*)/g) == null) {
        return false;
    }
    else {
        return true;
    }
}

//判断手机号是否正确
function checkMobilePhone(str) {
    if (str.match(/^(?:13\d|15\d|18\d)-?\d{5}(\d{3}|\*{3})$/) == null) {
        return false;
    }
    else {
        return true;
    }
}

//判断是否含有非法字符
function checkQuote(str) {
    var items = new Array("~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "{", "}", "[", "]", "(", ")");
    items.push(":", ";", "'", "|", "\\", "<", ">", "?", "/", "<<", ">>", "||", "//");
    items.push("admin", "administrators", "administrator", "管理员", "系统管理员");
    items.push("select", "delete", "update", "insert", "create", "drop", "alter", "trancate");
    str = str.toLowerCase();
    for (var i = 0; i < items.length; i++) {
        if (str.indexOf(items[i]) >= 0) {
            return true;
        }
    }
    return false;
}
