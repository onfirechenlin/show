(
function ($) {

    $.fn.shuffle = function () {
        return this.each(function () {
            var items = $(this).children();

            return (items.length)
                ? $(this).html($.shuffle(items, $(this)))
            : this;
        });
    }

    $.fn.validate = function () {
        var res = false;
        this.each(function () {
            var arr = $(this).children();
			
            res = ((arr[0].innerHTML.indexOf("文")>=0) &&
                (arr[1].innerHTML.indexOf("明")>=0) &&
                (arr[2].innerHTML.indexOf("美")>=0) &&
                (arr[3].innerHTML.indexOf("德")>=0));
        });
        return res;
    }

    $.shuffle = function (arr, obj) {
        for (
        var j, x, i = arr.length; i;
        j = parseInt(Math.random() * i),
        x = arr[--i], arr[i] = arr[j], arr[j] = x
    );
        if (arr[0].innerHTML == "文") obj.html($.shuffle(arr, obj))//使“文”不出现在第一个,避免出现自动排好的情况
        else return arr;
    }

})(jQuery);

$(function () {
    $("#sortable").sortable();
    $("#sortable").disableSelection();
    $('ul').shuffle();

    //$("#formsubmit").click(function () {
        //if($('ul').validate())
        //{
        //    $("#captchaflag").attr("checked", 'true');
        //    $("#captchaview").hide();
        //}
    //    else
    //    {
    //        alert("排序错误！只有完成排序,系统才会让你登录哦。");
    //    }
    //});
});