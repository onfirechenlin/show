/*******************************************
 * 
 * Plug-in:友好的页面加载效果
 * Author:sqinyang (sqinyang@sina.com)
 * Time:2015/04/20
 * Explanation:随着HTML5的流行，页面效果越来越炫，同时也需要加载大量的插件及素材，万恶的网速，特别对于挂在国外服务器的网站，一打开一堆素材缓缓加载，位置错乱不齐，故编写此方法，方便大家使用
 *
*********************************************/

Zepto.MyCommon = {
    PageLoading: function (options) {
        var defaults = {
            opacity: 0,
            //loading页面透明度
            backgroundColor: "#fff",
            //loading页面背景色
            borderColor: "#007ACC",
            //提示边框颜色
            borderWidth: 1,
            //提示边框宽度
            borderStyle: "solid",
            //提示边框样式
            loadingTips: "精彩正在进来...",
            //提示文本
            TipsColor: "#007ACC",
            //提示颜色
            delayTime: 400,
            //页面加载完成后，加载页面渐出速度
            zindex: 999,
            //loading过程中先隐藏该元素，可以是类也可以是id
            hidelayer: "#page-content",
            //loading页面层次
            sleep: 400
            //设置挂起,等于0时则无需挂起

        }
        var options = $.extend(defaults, options);

        //获取页面宽高
        var _PageHeight = document.documentElement.clientHeight,
        _PageWidth = document.documentElement.clientWidth;

        //在页面未加载完毕之前显示的loading Html自定义内容
        var _LoadingHtml = '<div id="loadingPage" style="position:fixed;left:50%;margin-left:-25%;top:30%;_position: absolute;width:100%;z-index:1000"><div id="loadingTips" style="position: absolute; cursor1: wait; width: auto;border-color:' + options.borderColor + ';border-style:' + options.borderStyle + ';border-width:' + options.borderWidth + 'px; height:80px; line-height:80px; padding-left:80px; padding-right: 5px;border-radius:10px;  background: ' + options.backgroundColor + ' url(http://7xj307.com2.z0.glb.qiniucdn.com/loading.gif) no-repeat 5px center; color:' + options.TipsColor + ';font-size:16px;">' + options.loadingTips + '</div></div>';


        //呈现loading效果
        $("body").append(_LoadingHtml);
        $(options.hidelayer).hide();


        //监听页面加载状态
        document.onreadystatechange = PageLoaded;

        //当页面加载完成后执行
        function PageLoaded() {
            if (document.readyState == "complete") {
                var loadingMask = $('#loadingPage');
				loadingMask.addClass("setfadeIn");
				//loadingMask.hide();
                setTimeout(function () {
                    loadingMask.addClass("fadeOutUp animated");
                    loadingMask.css("display", "none");
                }, 0);
                setTimeout(function () {
                    $(options.hidelayer).show();
                    $(options.hidelayer).addClass("fadeIn animated");
                }, 0);
                
                getPageLoadTime();
            }
        }
    }
}