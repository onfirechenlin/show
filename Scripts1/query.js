
var gQueryType = 1;
//查询表单参数
var gCompanyCode = '';
var gKuaidiNumber = '';
var gValiCode = '';
var gCompanyname = ''; // 公司名称
var gHasvali = '';
//验证正则表达式
var gHasVali = "";
var gCheckStr = "";
var gCheckInfo = "";

var gResultData;

var gTimeout = 30000;
var gAjaxGet;
var gWaitTimer;

$(function () {
    $.mobile.ajaxEnabled = false;
    $.support.touchOverflow = true;
    $.mobile.touchOverflowEnabled = true;

    $(".smart-word-ul").delegate("a", "click", function () {
        var e = $(this);
        if (e.text() != '') {
            $(".smart-select-list ul").hide();
            $(".smart-word-list li").removeClass("li-selected");
            $(".smart-word-list li a").removeClass("a-selected");
            e.parent().addClass("li-selected");
            if (e.hasClass("a-common")) {
                $("#ui-common").show();
            } else {
                e.addClass("a-selected");
                $("#ui-" + e.html().toLowerCase()).show();
            }
        };
    });

    $("#companyName").click(function () {
        $("#kuaidiNum").removeClass("input-focus");
        $("#validnum").removeClass("input-focus");
        $("#companyName").addClass("input-focus");
    }).blur();
    $("#kuaidiNum").focus(function () {
        $("#companyName").removeClass("input-focus");
        $("#validnum").removeClass("input-focus");
        $("#kuaidiNum").addClass("input-focus");
        $(this).select();
    }).keydown(function (e) {
        var keycode = e.keyCode ? e.keyCode : e.which;
        if (keycode == 13) {
            query();
        }
    }).val("").blur();
    $("#validnum").click(function () {
        $("#kuaidiNum").removeClass("input-focus");
        $("#companyName").removeClass("input-focus");
        $("#validnum").addClass("input-focus");
    }).val("").blur();

    var type = decode(GetQueryString("type"));
    var postid = GetQueryString("postid");
    var page = GetQueryString("page");

    if (type != null && type != "") {
        selectCompany(type);
        if (postid != null && postid != "") {
            $("#kuaidiNum").val(postid);
            if (gHasvali != "1") {
                $.mobile.changePage("#result", { transition: "none" });
                query();
            }
        }
    } else if (postid != null && postid != "") {
        $("#kuaidiNum").val(postid);
        auto();
    } else if (page == "list") {
        $.mobile.changePage("#select", { transition: "none" });
    } else {
        $.mobile.changePage("#input", { transition: "none" });
    }

    var prepage = GetQueryString("prepage");
    if (prepage != "" && prepage != null) {
        $("#backLink").attr("href", "pluto://nexturl?url=" + prepage);
        $("#backLink").attr("data-rel", "");
    }
    var cmb = GetQueryString("version");
    if (cmb == 1) {
        $("#cmbBtn").show();
        $("#cmbTitle").show();
    } else {
        $("#cmbBtn").hide();
        $("#cmbTitle").hide();
    }
    var callbackurl = GetQueryString("callbackurl");
    if (callbackurl != null && callbackurl != "") {
        $("a[href='#input']").attr("href", callbackurl);
    }
});

function gotoSelect() {
    $("#kuaidiNum").blur();
    $.mobile.changePage("#select", { transition: "none" });
}

function auto() {
    $.ajax({
        type: "post",
        url: "http://m.kuaidi100.com/autonumber/auto?num=" + $("#kuaidiNum").val(),
        dataType: "json",
        success: function (resultJson) {
            if (resultJson.length > 0) {
                selectCompany(resultJson[0].comCode);
                query();
            } else {
                showNotfindDialog();
            }
        }
    });
}

function selectCompany(comname) {
    var companysInfo = jsoncom.company;
    for (var i = 0; i < companysInfo.length; i++) {
        if (comname == companysInfo[i].code || comname == companysInfo[i].shortname || companysInfo[i].companyname.indexOf(comname) != -1 || comname.indexOf(companysInfo[i].shortname) != -1) {
            gCompanyCode = companysInfo[i].code;
            gCompanyname = companysInfo[i].companyname; // 公司名称
            gHasvali = companysInfo[i].hasvali; // 是否有验证码
            gCheckStr = companysInfo[i].freg;
            gCheckInfo = companysInfo[i].freginfo;
            var fullname = companysInfo[i].companyname;
            var comurl = companysInfo[i].comurl;

            if (gHasvali == "1") {
                $("#valideBox").show();
                refreshCode();
            } else {
                $("#valideBox").hide();
            }

            $(".btn-error-2").attr("href", comurl);
            $("#companyName").val(fullname);
            break;
        }
    }
    $.mobile.changePage("#input", { transition: "none" });
}

function query() {
    $("#query-wait").addClass("icon-query-transition");
    $("#query-wait").addClass("icon-query-rotate");

    gKuaidiNumber = $.trim($("#kuaidiNum").val());
    gValiCode = $.trim($("#validnum").val());

    if (gCompanyCode == "rufengda" && checkRegOfcompany(gKuaidiNumber, "^\\d{16}$")) {
        gKuaidiNumber = "DD" + gKuaidiNumber;
    }
    $("#kuaidiNum").val(gKuaidiNumber);

    if (!validateKuaidiNumber()) {
        return false;
    } else if (gCompanyCode == "" && gKuaidiNumber != "") {
        auto();
        return;
    }

    var url = "/query";
    if (gHasVali == "1") {
        url = "/queryvalid";
    }

    var agrs = "type=" + gCompanyCode + "&postid=" + gKuaidiNumber + "&id=" + gQueryType + "&valicode=" + gValiCode + "&temp=" + Math.random();
    url = url + "?" + agrs;

    gAjaxGet = $.ajax({
        type: "GET",
        url: url,
        timeout: gTimeout,
        success: function (responseText) {
            $(".icon-query").removeClass("icon-query-transition");
            $(".icon-query").removeClass("icon-query-rotate");
            var resultJson = eval("(" + responseText + ")");
            if (resultJson.status == 200) { //成功
                var resultTable = $("#queryResult");
                resultTable.empty();
                var resultData = resultJson.data;

                gResultData = resultData;

                $("#result-comname").html(gCompanyname);
                $("#result-kuaidinum").html(gKuaidiNumber);
                $.mobile.changePage("#result", { transition: "none" });

                if ($("#version").val() == "cmb4") {
                    for (var i = 0; i < resultData.length; i++) {
                        var className = "";
                        if (resultData.length == 1) {
                            className += " one";
                        } else if (i == 0) {
                            className += " first-line";
                        } else if (i == resultData.length - 1) {
                            className += " last-line";
                        }

                        resultTable.append("<tr class='" + className + "'><td class='colstatus'></td><td class='col2'><span class='result-context'>" + resultData[i].context + "</span><span class='result-time'>" + resultData[i].ftime + "</span></td></tr>");
                    }
                } else {
                    for (var i = resultData.length - 1; i >= 0; i--) {
                        var className = "";
                        if (i % 2 == 0) {
                            className = "even";
                        } else {
                            className = "odd";
                        }
                        if (resultData.length == 1) {
                            if (resultJson.ischeck == 1) className += " checked";
                            else className += " wait";
                        } else if (i == resultData.length - 1) {
                            className += " first-line";
                        } else if (i == 0) {
                            className += " last-line";
                            if (resultJson.ischeck == 1) className += " checked";
                            else className += " wait";
                        }

                        var index = resultData[i].ftime.indexOf(" ");
                        var result_date = resultData[i].ftime.substring(0, index);
                        var result_time = resultData[i].ftime.substring(index + 1);

                        var s_index = result_time.lastIndexOf(":");
                        result_time = result_time.substring(0, s_index);

                        resultTable.append("<tr class='" + className + "'><td class='col1'><span class='result-date'>" + result_date + "</span><span class='result-time'>" + result_time + "</span></td><td class='colstatus'></td><td class='col2'><span>" + resultData[i].context + "</span></td></tr>");
                    }
                    $("body").animate({ scrollTop: $("body")[0].scrollHeight }, 1000);
                }
            } else if (resultJson.status == 408) { // 验证码错误
                showErrorDialog("您输入的验证码错误，请重新输入！");
            } else if (resultJson.status == 201) { // 单号没查到
                $(".btn-error-1").attr("href", "http://www.kuaidi100.com/user/login.shtml?frame=smart&com=" + gCompanyCode + "&nu=" + gKuaidiNumber);
                showNotfindDialog();
            } else {
                $(".btn-error-1").attr("href", "http://www.kuaidi100.com/user/login.shtml?frame=smart&com=" + gCompanyCode + "&nu=" + gKuaidiNumber);
                showNotfindDialog();
            }
            if (gHasVali == "1") {
                refreshCode();
            }
        }
    });
}


function showErrorDialog(str) {
    $("#errorMessage").html(str);
    $.mobile.changePage("#error", {
        transition: "none"
    });
}

function showNotfindDialog() {
    $.mobile.changePage("#notfind", {
        transition: "none"
    });
}

/* 查询前单号验证 */
function validateKuaidiNumber() {
    if (gKuaidiNumber == "") {
        showErrorDialog("请您填写快递单号。");
        return false;
    }
    if (!isNumberLetterFuhao(gKuaidiNumber)) {
        showErrorDialog("单号仅能由数字、字母和特殊符号组合，请您查证。");
        return false;
    }
    if (gKuaidiNumber.length < 5) {
        showErrorDialog("单号不能小于5个字符，请您查证。");
        return false;
    }
    if (gKuaidiNumber.length > 30) {
        showErrorDialog("单号不能超过30个字符，请您查证。");
        return false;
    }
    if ((gKuaidiNumber.slice(0, 2)).toLowerCase() == "lp") {
        showErrorDialog("以[LP]开头的是淘宝内部单号，用运单号码才可查询。");
        return false;
    }
    if (gCheckStr != '' && gCheckStr != null) {
        if (!checkRegOfcompany(gKuaidiNumber, gCheckStr)) {
            showErrorDialog(gCheckInfo);
            return false;
        }
    }
    if (gHasVali == "1" && gValiCode == "") {
        showErrorDialog("请您填写验证码。");
        return false;
    }
    if (gHasVali == "1" && !isNumberLetterFuhao(gValiCode)) {
        showErrorDialog("验证码仅能由数字、字母和特殊符号组合，请您查证。");
        return false;
    }
    return true;
}

/* 刷新验证码 */
function refreshCode() {
    $("#valicode").val("");
    $("#valiimages").attr("src", "http://cdn.kuaidi100.com/images/clear.gif");
    var imageUrl = "http://www.kuaidi100.com/images?type=" + gCompanyCode + "&temp=" + Math.random();
    $("#valiimages").attr("src", imageUrl);
    $("#valicode").focus();
}


/* ---------------------- 工具类方法 ---------------------------- */

/* 正则表达式验证单号 */
function checkRegOfcompany(s, regu) {
    s = s.toUpperCase();
    var re = new RegExp(regu);
    if (re.test(s)) {
        return true;
    } else {
        return false;
    }
}

// 判断是否是数字或字母
function isNumberOrLetter(s) {
    var regu = "^[0-9a-zA-Z]+$";
    var re = new RegExp(regu);
    if (re.test(s)) {
        return true;
    } else {
        return false;
    }
}

function isNumberLetterFuhao(str) {
    var regStr = "^[0-9a-zA-Z\@\#\$\-\]+$";
    var reg = new RegExp(regStr);
    if (reg.test(str)) {
        return true;
    } else {
        return false;
    }
}

/*获取cookies*/
function getcookie(cookieName) {
    var cookieValue = ""; if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].replace(/(^\s*)|(\s*$)/g, "");
            if (cookie.substring(0, cookieName.length + 1) == (cookieName + '=')) { cookieValue = unescape(cookie.substring(cookieName.length + 1)); break; }
        }
    } return cookieValue;
}

function decode(utftext) {
    var string = "";
    if (utftext != "" && utftext != null) {
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
    }
    return string;
}

/*获取参数*/
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

String.prototype.Trim = function () {
    return this.replace(/\s/g, "");
}