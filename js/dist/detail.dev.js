"use strict";

//回到顶部
function goTop() {
  this.top = function (obj) {
    console.log(obj); // 获取返回按钮
    // el 为元素节点的选择器

    var btn = document.querySelector(obj.el); // 获取屏幕宽度/高度

    var clientHeight = document.documentElement.clientHeight;
    var clientWidth = document.documentElement.clientWidth; // 定义定时器和一个判断到达顶部的布尔值

    var timer = null;
    var isTop = true;

    window.onscroll = function () {
      $(".menu-sublevel").css("position", "absolute");
      var scrTop = document.body.scrollTop || document.documentElement.scrollTop;

      if (scrTop >= 800) {
        // 显示
        btn.style.display = 'block';
      } else {
        // 隐藏
        btn.style.display = 'none';
      }

      if (!isTop) {
        clearInterval(timer);
      }

      isTop = false;
    }; // 点击返回顶部


    btn.onclick = function () {
      // 设置定时器
      timer = setInterval(function () {
        // 再次获取滚动条距顶部高度
        var osTop = document.body.scrollTop || document.documentElement.scrollTop; // 用于设置速度差,产生缓慢效果

        var speed = Math.floor(-osTop / 8);
        document.documentElement.scrollTop = document.body.scrollTop = osTop + speed;
        isTop = true;

        if (isTop == 0) {
          clearInterval(timer);
        }
      }, 20);
    };
  };
} //调用


back = new goTop(); // el 为 类名,id,属性"[type="button"]"

back.top({
  el: '#layout_up'
}); //获取元素

var menu_wrapper = document.querySelectorAll('.menu_wrapper');
var firstMenu = document.querySelectorAll('.menu_wrapper_link'); // 二级菜单 jquery

$(firstMenu).mouseover(function () {
  $(this).children(":first").addClass("active");
  $(this).children(":first").siblings().css("position", "fixed");
  $(this).children(":first").siblings().css("top", "147px");
  $(this).children(":first").siblings().css("display", "block");
});
$(firstMenu).mouseout(function () {
  $(this).children(":first").removeClass("active");
  $(this).children(":first").siblings().css("position", "absolute");
  $(this).children(":first").siblings().css("display", "none");
}); //点击搜索

var search = document.querySelector(".search");
var searchBox = document.querySelector(".searchBox");
var keyword = document.querySelector("#keyword");
var searchBtn = document.querySelector(".searchBtn");
var li = document.querySelectorAll(".component-search-recommand__content-item");

search.onclick = function (event) {
  var event = event || window.event; // 阻止事件冒泡

  event.stopPropagation();

  if (searchBox.style.display == "none") {
    //搜索盒子显示
    searchBox.style.display = "block"; // 输入框的内容为选中的内容

    li.forEach(function (item) {
      item.onclick = function () {
        var e = window.event;
        e.stopPropagation();
        keyword.value = e.target.innerHTML;
      };
    }); // 输入框点击输入

    keyword.onclick = function () {
      var e = window.event;
      e.stopPropagation();
    }; // 点击搜索，输入框消失，根据输入的关键字跳到列表页


    searchBtn.onclick = function () {
      // let keyword = document.querySelector("#keyword");
      var keyval = keyword.value; // 将获取到的关键字上传到list.html

      window.location.href = '../html/list.html?search=' + keyval;
      searchBox.style.display = "none";
    };
  } else {
    searchBox.style.display = "none";
  } // 清空输入框内容


  keyword.value = "";
};

document.onclick = function () {
  searchBox.style.display = "none";
}; // 将列表传过来的的商品显示
//http://www.katespade.com/html/detail.html?id=6


var str = location.href;
console.log(str);
var arr = str.split("?"); //以？分割为数组["http://...html","id=6"]

var arr1 = arr[1].split("="); //把id=7以=分割为数组["id","6"]

var id = arr1[1]; //6

console.log(id);
pAjax({
  url: '../api/detail.php',
  data: {
    id: id
  }
}).then(function (res) {
  res = JSON.parse(res);
  console.log(res);
  render(res); // 尺寸参照图显示与隐藏

  var sizeDialog = document.querySelector(".size-dialog");
  var guide = document.querySelector(".guide");
  var sizeClose = document.querySelector(".size-dialog__close");

  guide.onclick = function () {
    sizeDialog.style.display = "block";
  };

  sizeClose.onclick = function () {
    sizeDialog.style.display = "none";
  }; // 尺寸大小选择,事件委托


  $(".size-card").click(function () {
    $(this).addClass("is-select").siblings().removeClass("is-select");
    ;
  }); // 放大镜效果

  new Enlarge(".box"); //商品详情center 手风琴效果

  $(".pruduct-detail .content").click(function () {
    // yincang.png就是+   zhankai.png就是-
    //给所有的添加+图片
    $(".icon_one").attr("src", "../../static/img/yincang.png"); // 先清除所有的-

    $(".icon").removeClass("icon-cross-big").addClass("icon-add-big"); // 再给点击的这个添加-，移出+

    $(this).children(".icon").removeClass("icon-add-big").addClass("icon-cross-big"); //给拥有-的添加-图片

    $(this).children(".icon").attr("src", "../../static/img/zhankai.png");
    console.log($(this).next()); // 显示内容

    console.log($(this).next().stop().parent().siblings());
    $(this).next().stop().animate({
      "height": "100%"
    }).parent().siblings().find(".dropdown").stop().animate({
      "height": "0px"
    });
  }); // 事件委托，点击【

  var mainArea = document.querySelector(".main-are"); //具体详情

  mainArea.onclick = function () {
    var e = window.event;
    var target = e.target; //点击 [立即购买]按钮

    if (target.innerHTML == '立即购买') {
      window.location.href = "../html/car.html";
    } // 点击[加入购物车]


    if (target.innerHTML == '加入购物车') {
      var login = getCookie('login'); //未登录

      if (!login) {
        alert("加入失败");
        window.location.href = "../html/login.html";
        return;
      } //把该数据加入数据库


      var _id = target.id;
      console.log(login);
      pAjax({
        url: '../api/addCarData.php',
        data: {
          tel: login,
          goods_id: _id
        }
      }).then(function (res) {
        res = JSON.parse(res);
        console.log(res);

        if (res.code == true) {
          alert("加入购物车成功");
        }
      });
    }
  };
}); //详情页的渲染

function render(data) {
  var smallStr = "";
  var smallPic = document.querySelector(".swiper-wrapper"); // 装小图的盒子

  var bigPic = document.querySelector(".show"); //装大图的盒子

  var mainArea = document.querySelector(".main-are"); //具体详情

  var faida = document.querySelector(".faida"); //放大的图片

  var infor = document.querySelector(".pruduct-detail");
  data.forEach(function (item, index) {
    // 小图
    for (var i = 0; i < 5; i++) {
      smallStr += "<div class=\"swiper-slide\"><img midelimg=\"".concat(item.goods_small_logo, "\" bigimg=\"").concat(item.goods_big_logo, "\" src=\"").concat(item.goods_small_logo, "\"></div>");
    }

    smallPic.innerHTML = smallStr; // 大图

    bigPic.innerHTML = "\n        <img src=\"".concat(item.goods_big_logo, "\">\n        <div class=\"mouse-cover mask\"></div>\n        ");
    faida.innerHTML = "<canvas class=\"mouse-cover-canvas enlarge\" style=\"background-image: url(".concat(item.goods_big_logo, ");diplay:none\"></canvas>");
    mainArea.innerHTML = "\n        <div class=\"select-product\">\n             <div class=\"title\">".concat(item.goods_name, "</div>\n            <div class=\"price-are\">\n            <div class=\"now-price\">\n                \uFFE5").concat(item.goods_price, "\n            </div>\n        </div>\n        <div class=\"huabei\">\n            \u82B1\u5457\u5206\u671F\u6700\u4F4E\u53EF\u81F3\uFFE5349.38\n        </div>\n        <div class=\"preOrder\">\n            12\u67083\u65E5-12\u670817\u65E5\uFF0C\u52A0\u5165\u8D2D\u7269\u8F66\u4EAB2\u4EF6\u989D\u59169\u6298\uFF0C3\u4EF6\u989D\u59168\u6298\u4F18\u60E0\uFF01\n        </div>\n        <div class=\"reminder\"></div>\n        <div class=\"product-color\">\n            <div class=\"color-value\">\u989C\u8272\uFF1A\u9ED1\u8272</div>\n        </div>\n        <div class=\"product-size\">\n            <div class=\"size-word\">\n                <div class=\"title\">\u5C3A\u7801</div>\n                <div class=\"guide\">\u5C3A\u7801\u6307\u5357</div>\n            </div>\n\n            <div class=\"size-content\">\n                <div class=\"size-card no-thing\">0</div>\n                <div class=\"size-card is-select\">2</div>\n                <div class=\"size-card no-thing\">4</div>\n\n            </div>\n        </div>\n        <div class=\"operate\">\n            <div class=\"buy\" id=\"").concat(item.goods_id, "\">\u7ACB\u5373\u8D2D\u4E70</div>\n            <div class=\"add\" id=\"").concat(item.goods_id, "\">\u52A0\u5165\u8D2D\u7269\u8F66</div>\n        </div>\n        <div class=\"product-share\">\n            <div class=\"title\">\u5206\u4EAB\uFF1A</div>\n            <img class=\"icon-wechat\" src=\"https://img.katespade.cn/_nuxt/img/7cec1ce.svg\">\n            <img class=\"icon-xinlang\" src=\"https://img.katespade.cn/_nuxt/img/695851f.svg\">\n        </div>\n        <div class=\"size-dialog\" style=\"display:none;\">\n            <div class=\"dialog-container\">\n                <div slot=\"content\" class=\"size-guide\">\n                    <div class=\"size-guide-content\">\n                        <img class=\"size-dialog__close\" src=\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYxLjIgKDg5NjUzKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5pY29uPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9Imljb24iIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+CiAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE5Ny4wMDAwMDAsIC04OC4wMDAwMDApIiBpZD0iaWNvbl/lhbPpl60iIHN0cm9rZT0iIzIyMzYyOCIgc3Ryb2tlLXdpZHRoPSIxLjMiPgogICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxOTcuMDAwMDAwLCA4OC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSJNb2JpbGUtWCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMS4wMDAwMDAsIDEuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTE4LUNvcHkiPgogICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT0iMCIgeTE9IjAiIHgyPSIxMy45NDU0OTc5IiB5Mj0iMTMuOTQ1NDk3OSIgaWQ9IkxpbmUtNiI+PC9saW5lPgogICAgICAgICAgICAgICAgICAgICAgICA8bGluZSB4MT0iMCIgeTE9IjEzLjk0NTQ5NzkiIHgyPSIxMy45NDU0OTc5IiB5Mj0iMCIgaWQ9IkxpbmUtNi1Db3B5Ij48L2xpbmU+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=\">\n                        <img class=\"guidePc\" src=\"https://img.katespade.cn/media/core/placeholder/default/__20200730230759.jpg\" class=\"guideMobile\">\n                    </div>\n                </div>\n            </div>\n        </div>\n   \n        ");
    infor.innerHTML = "\n        <div class=\"pruduct-detail\">\n        <div class=\"content\">\n            <div class=\"title\">\u5546\u54C1\u8BE6\u60C5</div>\n            <img class=\"icon icon_one icon-add-big\" src=\"../../static/img/yincang.png\">\n        </div>\n        <div class=\"dropdown dropdown-default\" style=\"height: 0;\">\n            <div class=\"description-dropdown\">\n            ".concat(item.goods_introduce, "\n            </div>\n        </div>\n        </div>\n        ");
  });
}