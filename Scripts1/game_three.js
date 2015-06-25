//第三关 start
var timeout;
$(document).ready(function () {
    $("#ul2 li").click(function () {
        gostart();
        var thattop = 0, thatleft = 0;
        var thistop = $(this).offset().top;//初始块坐标
        var thisleft = $(this).offset().left;//初始块坐标
        var thistxt = $(this).children().attr("alt");//初始块坐标文本
        var thisclass = this;//初始块

        if ($(this).attr("style") != null) {
            $(this).removeAttr("style");

            $("#ul1 li").each(
            function () {
                if ($(this).children().attr("alt") == thistxt) {
                    $(this).html("");
                    $(this).html("<img src='/game/img/fanxi/weijihuo.png' alt=''/>");
                    return false;
                }
            })
            return false;
        }

        else {

            var upbool = "true";
            $("#ul1 li").each(
                function (index) {
                    if ($(this).children().attr("alt") == "") {
                        thattop = $(this).offset().top;
                        thatleft = $(this).offset().left;
                        $(this).children().attr("alt", thistxt);
                        return false;
                    }

                })
            var rightnum = Number(thisleft) - Number(thatleft);
            var leftnum = Number(thistop) - Number(thattop);

            $(this).animate(
                {
                    bottom: leftnum,
                    right: rightnum
                }, 200
                ,
              function () {
                  update(this);
              }
            )
        }

    });
});

//判断是否答题正确
function update(xthis) {

    var arr = ["富强", "民主", "文明", "和谐", "自由", "平等", "公正", "法治", "爱国", "敬业", "诚信", "友善"];
    var rbool = "true";//判断是否正确
    var isfinsh = "true";//判断是否答完
    var returnval = "";
    var three_num = 0;

    $("#ul1 li").each(function (index, element) {
        var liv = $(this).children().attr("alt").replace(" ", "");

        if (liv.length == 0) {
            isfinsh = "false";

        }
        else if (liv.length > 0) {
            if (liv != arr[index]) {
                rbool = "false";
                returnval = arr[index];
                $(xthis).attr("style", $(xthis).attr("style") + ";opacity:0.7")
            }
            else {
                three_num++;
            }

        }
    });
    if (isfinsh == "true") {
        if (rbool == "true") {
            c_save(three_num, 2);
			$(".jqibox").remove(); 
            $.prompt("Bingo，全对！恭喜您成为大师级文明小天使，最后的挑战：第三关，文明大闯关，答对三道随机分配的文明礼仪问题，大奖等着您哦！", {
                title: "全答对啦",
                buttons: { "冲击大奖": true },
                submit: function (e, v, m, f) {
                    $("#gate02").hide(1000);
                    $("#gate03").show(1000);
                }
            });
			jqiplus();
        }
        else {
            url = "/ajaxfuns.ashx?flag=69&num=" + Math.random();
            $.ajax({
                url: url,
                data: {},
                type: 'GET',
                timeout: 5000,
                dataType: 'html',
                beforeSend: function () { },
                error: function () { },
                success: function (xml) {
                    if (xml.length > 0) {
						$(".jqibox").remove(); 
                        $.prompt("排序错啦，再试试吧，为了鼓励你，送你一个小苹果，您当前的苹果数为[" + xml + "]，小苹果越多兑换大礼包的机会也越多哦，加油！", {
                            title: "再次挑战",
                            buttons: { "再次挑战": true },
                            submit: function (e, v, m, f) {
                                //topic_reload();
                            }
                        });
						jqiplus();
                    }
                }
            });
        }
    }
    else {
        if (rbool == "false") {
			$(".jqibox").remove(); 
            $.prompt("<div>排序错啦，这里是\“" + returnval + "\”哦!<\div>");
			jqiplus();
        }
        else {
            timecount++;
            settimecount();
        }
        return false;
    }
}
// end
