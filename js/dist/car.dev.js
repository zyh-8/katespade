"use strict";

//回到顶部
function goTop() {
  this.top = function (obj) {
    console.log(obj); // 获取返回按钮
    // el 为元素节点的选择器

    var btn = document.querySelector(obj.el); // 获取屏幕宽度/高度

    var clientHeight = document.documentElement.clientHeight;
    var clientWidth = document.documentElement.clientWidth;
    console.log(clientHeight, clientWidth); // 定义定时器和一个判断到达顶部的布尔值

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
      var keyword = document.querySelector("#keyword");
      var search = keyword.value; // 根据关键字，到数据库模糊查询，将查询到的数据渲染到页面
      // 如果搜索无结果，显示【搜素结果为0】
      // 请求数据
      // 根据keyword获取数据

      pAjax({
        url: '../api/detail.php',
        data: {
          search: search
        }
      }).then(function (res) {
        res = JSON.parse(res);
        console.log(res);
        renderHtml(res.detail);
      });
      searchBox.style.display = "none";
    };
  } else {
    searchBox.style.display = "none";
  } // 清空输入框内容


  keyword.value = "";
};

document.onclick = function () {
  searchBox.style.display = "none";
};

var shopping = document.querySelector(".shopping"); //装购物商品的盒子
// 判断是否有登录

var login = getCookie('login');
console.log(login);

if (!login) {
  console.log(1);
  location.href = '../html/login.html'; // setCookie('url','http://gz2008.com/day06_code/project/html/car.html')

  localStorage.setItem('url', 'http://www.katespade.com/html/car.html');
} // 获取用户购物车中的数据


pAjax({
  url: '../api/getCarData.php',
  data: {
    tel: login
  }
}).then(function (res) {
  res = JSON.parse(res);
  console.log(res.length); // 先把数据存放到本地

  localStorage.setItem('goodsList', JSON.stringify(res));
  render(res);
}); // 渲染数据
//item.is_select会影响选择框的选中状态

function render(data) {
  //全部商品全选的时候，全选按钮勾上
  var allChecked = data.every(function (item) {
    return item.is_select == 1;
  });
  var total = shopNum(data); //购物车商品数量
  // data 请求出来的数据 有可能一条数据都没有

  if (data.length == 0) {
    shopping.innerHTML = "\n            <h1 class=\"title\">\u4F60\u7684\u8D2D\u7269\u8F66\u5171\u6709".concat(data.length, "\u4EF6\u5546\u54C1</h1>\n            <div class=\"header\">\n                <div class=\"check\">\n                    <input class=\"allselect\" type=\"checkbox\"  id=\"all\"  ").concat(allChecked ? 'checked' : '', ">\n                    <div class=\"text\">\u5168\u9009</div>\n                </div>\n                <a class=\"continue\" href=\"list.html?search=\u65B0\u54C1\">\u67E5\u770B\u5F53\u5B63\u65B0\u54C1</a>\n            </div>\n            <div class=\"product\">\n                <div class=\"product_list\" >\n                    <div class=\"product_car\">\n                        <div class=\"left\">\n                        </div> \n                        <div class=\"right\">\n                        </div> \n                    </div>\n                 </div>\n            </div>\n            <div class=\"operate\">\n                <div class=\"total\">\u603B\u8BA1\uFF1A\uFFE5<span class=\"total_price\">").concat(total.totalPrice, "</span></div>\n                <div class=\"order\">\u7ACB\u5373\u7ED3\u7B97</div>\n            </div>\n            ");
    return;
  }

  var str = "\n    <h1 class=\"title\">\u4F60\u7684\u8D2D\u7269\u8F66\u5171\u6709".concat(data.length, "\u4EF6\u5546\u54C1</h1>\n    <div class=\"header\">\n        <div class=\"check\">\n            <input class=\"allselect\" type=\"checkbox\"  id=\"all\"  ").concat(allChecked ? 'checked' : '', ">\n            <div class=\"text\">\u5168\u9009</div>\n        </div>\n        <a class=\"continue\" href=\"list.html?search=\">\u7EE7\u7EED\u8D2D\u7269</a>\n    </div>");
  str += "<div class=\"product\">";
  data.forEach(function (item) {
    str += " \n            <div class=\"product_list\" >\n                <div class=\"product_car\">\n                    <div class=\"left\">\n                        <img src=\"".concat(item.goods_small_logo, "\" alt=\"\">\n                        <input class=\"check\" type=\"checkbox\" ").concat(item.is_select == 1 ? 'checked' : '', "  goods_id=\"").concat(item.goods_id, "\">\n                    </div>\n\n                    <div class=\"right\">\n                        <div class=\"r_top\">\n                            <div class=\"top_title\">").concat(item.goods_name, "<button class=\"del\" goods_id=\"").concat(item.goods_id, "\">x</button></div>\n                            \n                        </div>\n                        <div class=\"color\">\u989C\u8272\uFF1A\u9ED1\u8272</div>\n                        <div class=\"size\">\u5C3A\u5BF8\uFF1A6</div>\n                        <div class=\"number\" goods_id=\"").concat(item.goods_id, "\">\n                            <div class=\"jian\">-</div>\n                            <div class=\"num\">").concat(item.cart_number, "</div>\n                            <div class=\"jia\">+</div>\n                        </div>\n                        <div class=\"price\">\uFFE5").concat(item.goods_price, "</div>\n                    </div>\n                </div>\n            </div>\n        ");
  });
  str += "</div>";
  str += "\n    <div class=\"operate\">\n        <div class=\"total\">\u603B\u8BA1\uFF1A\uFFE5<span class=\"total_price\">".concat(total.totalPrice, "</span></div>\n        <div class=\"order\">\u7ACB\u5373\u7ED3\u7B97</div>\n    </div>");
  shopping.innerHTML = str;
}

shopping.onclick = function () {
  var e = window.event; // 全选

  if (e.target.id == 'all') {
    var data = JSON.parse(localStorage.getItem('goodsList'));
    data.forEach(function (item) {
      e.target.checked ? item.is_select = 1 : item.is_select = 0;
    });
    console.log(data);
    localStorage.setItem('goodsList', JSON.stringify(data));
    render(data);
  } // 单选


  if (e.target.className == 'check') {
    var id = e.target.getAttribute('goods_id');

    var _data = JSON.parse(localStorage.getItem('goodsList'));

    _data.forEach(function (item) {
      if (item.goods_id == id) {
        item.is_select = e.target.checked ? 1 : 0;
      }
    }); // 需要把 修改够的数据存储本地存储中


    localStorage.setItem('goodsList', JSON.stringify(_data));
    render(_data);
  } // 删除


  if (e.target.classList.contains('del')) {
    // 删除数据库中 和 本地存储中对应的数据 
    var _id = e.target.getAttribute('goods_id');

    pAjax({
      url: '../api/removeCarData.php',
      data: {
        tel: login,
        goods_id: _id
      }
    }).then(function (res) {
      res = JSON.parse(res);
      console.log(res);

      if (res.code) {
        // 先获取本地存储中的数据
        var _data2 = JSON.parse(localStorage.getItem('goodsList'));

        var _res = _data2.filter(function (item) {
          return item.goods_id != _id;
        });

        localStorage.setItem('goodsList', JSON.stringify(_res));
        render(_res);
      }
    });
  } // 更新商品的数量
  // 进行数量加减法


  if (e.target.classList.contains('jian')) {
    var _data3 = JSON.parse(localStorage.getItem('goodsList'));

    var _id2 = e.target.parentElement.getAttribute('goods_id');

    var obj = _data3.filter(function (item) {
      return item.goods_id == _id2;
    })[0];

    var num = obj.cart_number * 1;

    if (num <= 1) {
      num = 1;
    } else {
      num--;
    }

    pAjax({
      url: '../api/updCarData.php',
      data: {
        tel: login,
        goods_id: _id2,
        goods_num: num
      }
    }).then(function (res) {
      res = JSON.parse(res);

      if (res.code) {
        obj.cart_number = num;
        localStorage.setItem('goodsList', JSON.stringify(_data3));
        render(_data3);
      }
    });
  }

  if (e.target.classList.contains('jia')) {
    var _data4 = JSON.parse(localStorage.getItem('goodsList'));

    var _id3 = e.target.parentElement.getAttribute('goods_id');

    var _obj = _data4.filter(function (item) {
      return item.goods_id == _id3;
    })[0];

    var _num = _obj.cart_number * 1;

    _num++;
    pAjax({
      url: '../api/updCarData.php',
      data: {
        tel: login,
        goods_id: _id3,
        goods_num: _num
      }
    }).then(function (res) {
      res = JSON.parse(res);

      if (res.code) {
        _obj.cart_number = _num;
        localStorage.setItem('goodsList', JSON.stringify(_data4));
        render(_data4);
      }
    });
  } // 结算
  // 删除选中的商品， 并把选中的商品总价清零


  if (e.target.className == "order") {
    // 获取本地的数据
    var _data5 = JSON.parse(localStorage.getItem('goodsList')); // 过滤出来选中的商品


    var res = _data5.filter(function (item) {
      return item.is_select == 1;
    });

    console.log(res); // 把这些商品删除

    res.forEach(function (item) {
      var id = item.goods_id;
      console.log(id);
      pAjax({
        url: '../api/removeCarData.php',
        data: {
          tel: login,
          goods_id: id
        }
      }).then(function (res) {
        res = JSON.parse(res);
        console.log(res);

        if (res.code) {
          // 先获取本地存储中的数据
          var _data6 = JSON.parse(localStorage.getItem('goodsList'));

          var _res2 = _data6.filter(function (item) {
            return item.goods_id != id;
          });

          localStorage.setItem('goodsList', JSON.stringify(_res2));
          render(_res2);
        }
      });
    });
  }
};

function shopNum(goods) {
  var res = goods.filter(function (item) {
    return item.is_select == 1;
  }); // 计算选中商品的数量

  var totalNum = res.reduce(function (pre, item) {
    return pre + item.cart_number * 1;
  }, 0); // 计算选中商品的总价格

  var totalPrice = res.reduce(function (pre, item) {
    return pre + item.goods_price * item.cart_number;
  }, 0);
  totalPrice = totalPrice.toFixed(2);
  return {
    totalNum: totalNum,
    totalPrice: totalPrice
  };
}

;