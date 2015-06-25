//加载js，用于集中清缓存 By~Jaya 20150515
var JS_Document = "";
//不缓存请将math置为2
var math = "2343434";
if (math == 2)
{
    math = Math.random();
}
JS_Document += "<script type='text/javascript' src='Scripts/touch.js?v=?" + math + "'></script>";
JS_Document += "<script type='text/javascript' src='Scripts/index.js?v=" + math + "'></script>";
JS_Document += "<script type='text/javascript' src='Scripts/custom.js?v=?" + math + "'></script>";
document.write(JS_Document);