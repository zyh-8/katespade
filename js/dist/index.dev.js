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

var menu = document.querySelector('.menu');
var menu_wrapper = document.querySelector('.menu_wrapper');
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
}); //菜单模糊搜索，跳转list.html

menu.onclick = function () {
  console.log(1);
  var e = window.event;
  var target = e.target;
  console.log(target);
  var menukey = target.innerHTML;
  window.location.href = '../../html/list.html?search=' + menukey;
}; //点击搜索


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
      var keyval = keyword.value;
      console.log(keyval); // 将获取到的关键字上传到list.html

      window.location.href = '../../html/list.html?search=' + keyval;
      searchBox.style.display = "none";
    };
  } else {
    searchBox.style.display = "none";
  } // 清空输入框内容


  keyword.value = "";
}; // document.onclick = function() {
//     searchBox.style.display = "none";
// };
//视频点击播放暂停 jquery


$('.component-homepage-video').each(function () {
  $(this).find('.component-homepage-video__icon-play').click(function () {
    $(this).hide(); //点播按钮消失

    $('.component-lazy-image').hide(); //覆盖图消失

    $('#loop-video').show().click(function () {
      //视频播放,点击暂停
      var v = document.getElementById('loop-video');
      v.pause(); //暂停
      //按钮显示，再次点击，按钮消失，视频播放

      $('.component-homepage-video__icon-play').show().click(function () {
        $(this).hide(function () {
          var v = document.getElementById('loop-video');
          v.play();
        });
      });
    });
  });
}); //more更多新品

var mySwiper = new Swiper('.swiper-container', {
  loop: true,
  // 循环模式选项
  slidesPerView: 3,
  //显示3张图
  centeredSlides: true,
  watchSlidesProgress: true,
  // 如果需要分页器
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    clickableClass: 'my-pagination-clickable'
  },
  // 如果需要前进后退按钮
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }
}); //footer渲染