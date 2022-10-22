$(function () {
  let pageArray = ["home", "video", "me", "friend", "account"];

  /* 底部导航处理函数 */
  $(".footer-in>ul>li").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    let url = $(this).find("img").attr("src");
    url = url.replace("normal", "selected");
    $(this).find("img").attr("src", url);
    $(this)
      .siblings()
      .find("img")
      .forEach(function (oImg) {
        oImg.src = oImg.src.replace("selected", "normal");
      });
    let currentName = pageArray[$(this).index()];
    $(".header-in")
      .removeClass()
      .addClass("header-in " + currentName);
  });
  let hashStr = window.location.hash.substr(1);
  if (hashStr.length === 0) {
    $(".home").click();
  } else {
    $("." + hashStr).click();
  }
});
