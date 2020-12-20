//回到顶部
function goTop() {
    this.top = function(obj) {
        console.log(obj);
        // 获取返回按钮
        // el 为元素节点的选择器
        var btn = document.querySelector(obj.el);
        // 获取屏幕宽度/高度
        var clientHeight = document.documentElement.clientHeight;
        var clientWidth = document.documentElement.clientWidth;
        console.log(clientHeight, clientWidth);

        // 定义定时器和一个判断到达顶部的布尔值
        var timer = null;
        var isTop = true;

        window.onscroll = function() {
            $(".menu-sublevel").css("position", "absolute");
            var scrTop = (document.body.scrollTop || document.documentElement.scrollTop);
            if (scrTop >= 800) {
                // 显示
                btn.style.display = 'block'
            } else {
                // 隐藏
                btn.style.display = 'none'
            }
            if (!isTop) {
                clearInterval(timer)
            }
            isTop = false
        };
        // 点击返回顶部
        btn.onclick = function() {
            // 设置定时器
            timer = setInterval(function() {
                // 再次获取滚动条距顶部高度
                var osTop = (document.body.scrollTop || document.documentElement.scrollTop);
                // 用于设置速度差,产生缓慢效果
                var speed = Math.floor(-osTop / 8);
                document.documentElement.scrollTop = document.body.scrollTop = osTop + speed
                isTop = true
                if (isTop == 0) {
                    clearInterval(timer)
                }
            }, 20)
        }
    }
}
//调用
back = new goTop();
// el 为 类名,id,属性"[type="button"]"
back.top({
    el: '#layout_up'
})

//获取元素
let menu_wrapper = document.querySelectorAll('.menu_wrapper');
let firstMenu = document.querySelectorAll('.menu_wrapper_link');
// 二级菜单 jquery
$(firstMenu).mouseover(function() {

    $(this).children(":first").addClass("active");

    $(this).children(":first").siblings().css("position", "fixed");
    $(this).children(":first").siblings().css("top", "147px");
    $(this).children(":first").siblings().css("display", "block");
});
$(firstMenu).mouseout(function() {

    $(this).children(":first").removeClass("active");
    $(this).children(":first").siblings().css("position", "absolute");
    $(this).children(":first").siblings().css("display", "none");
});

//点击搜索
var search = document.querySelector(".search");
var searchBox = document.querySelector(".searchBox");
var keyword = document.querySelector("#keyword");
var searchBtn = document.querySelector(".searchBtn");
var li = document.querySelectorAll(".component-search-recommand__content-item");
search.onclick = function(event) {
    var event = event || window.event;
    // 阻止事件冒泡
    event.stopPropagation();

    if (searchBox.style.display == "none") {
        //搜索盒子显示
        searchBox.style.display = "block";
        // 输入框的内容为选中的内容
        li.forEach(function(item) {
            item.onclick = function() {
                var e = window.event;
                e.stopPropagation();
                keyword.value = e.target.innerHTML;
            }
        });
        // 输入框点击输入
        keyword.onclick = function() {
            var e = window.event;
            e.stopPropagation();
        };
        // 点击搜索，输入框消失，根据输入的关键字跳到列表页
        searchBtn.onclick = function() {
            let keyword = document.querySelector("#keyword");
            let keyval = keyword.value;

            // 将获取到的关键字上传到list.html
            window.location.href = '../../html/list.html?search=' + keyval;
            searchBox.style.display = "none";

        }
    } else {
        searchBox.style.display = "none";
    }
    // 清空输入框内容
    keyword.value = "";


}
document.onclick = function() {
    searchBox.style.display = "none";
};

//http://www.katespade.com/html/list.html?search=袜子
// 截取链接地址的【袜子】
let str = location.href;
// console.log(str);
let arr = str.split("?"); //以？分割为数组["http://...html","search="]
let arr1 = arr[1].split("="); //把id=7以=分割为数组["search","袜子"]
let keyval = arr1[1]; //袜子
keyval = decodeURIComponent(keyval);
// console.log(keyval);

var filter_title = document.querySelector(".filter_title");
var product = document.querySelector(".product");
var sort = document.querySelector(".sort");
var more_wrap = document.querySelector(".more_wrap");

console.log(product);

// 根据关键字，到数据库模糊查询，将查询到的数据渲染到页面
// 如果搜索无结果，显示【搜素结果为0】
// 请求数据
// 根据keyword获取数据


pAjax({
    url: '../api/list.php',
    data: {
        keyval: keyval,
    },
}).then(res => {
    res = JSON.parse(res);

    console.log(res);

    // 把数据存储到本地
    localStorage.setItem('goodsList', JSON.stringify(res));

    filter_title.innerHTML = `${keyval}(${res.length})`;

    let more = document.querySelector(".more");

    // 如果数据小于4条，则移除【查看更多】
    if (res.length <= 4) {
        render(res);
        more.innerHTML = "查看更多(0)";
        return
    }

    //如果数据4条以上 先渲染4条数据 
    let arr = []; //存放要渲染的数据
    for (let i = 0; i < 4; i++) {
        arr.push(res[i]);
        // 把数据存储到本地
        localStorage.setItem('goodsList', JSON.stringify(arr));
    }
    //渲染，之后清空数组
    render(arr);
    arr = [];

    // 点击【查看更多】加载数据,每次渲染4条
    var page = 1;
    more.onclick = function() {
        let len = res.length - page * 4;
        console.log(len);
        if (len < 4) {
            // 渲染剩下不足4条的数据
            for (let i = 4 * page; i < 4 * page + len; i++) {
                arr.push(res[i]);
                // 把数据存储到本地
                localStorage.setItem('goodsList', JSON.stringify(arr));
                more.innerHTML = "查看更多(0)";
            }
            render(arr);
            return
        }
        for (let i = 4 * page; i < 4 * (page + 1); i++) {
            arr.push(res[i]);
            // 把数据存储到本地
            localStorage.setItem('goodsList', JSON.stringify(arr));
        }
        render(arr);

        more.innerHTML = `查看更多(${len})`;

        arr = [];
        page++;

    }


    console.log(sort.value);
    // 排序
    sort.onclick = function sortFun() {
        // 先获取本地存储中的数据
        let data = JSON.parse(localStorage.getItem('goodsList'));
        if (sort.value == "默认排序") {
            data.sort(function(a, b) {
                // 升序
                return a.goods_id - b.goods_id
            })
            render(data);
        }
        if (sort.value == "按价格↑") {
            data.sort(function(a, b) {
                // 升序
                return a.goods_price - b.goods_price
            })
            render(data);
        }

        if (sort.value == "按价格↓") {
            data.sort(function(a, b) {
                // 降序
                return b.goods_price - a.goods_price
            })
            render(data);
        }
        if (sort.value == "最新") {
            data.sort(function(a, b) {
                return b.upd_time - a.upd_time
            })
            render(data);
        }
    }
});

// 点击商品列表
//事件委托，绑定点击事件
product.onclick = function() {
    console.log(2)
    let e = window.event;
    let target = e.target;
    console.log(target);
    // 点击[列表商品], 跳转
    window.location.href = '../../html/detail.html?id=' + target.id;
}

//渲染函数
function render(data) {

    let str = "";
    if (!data.length) {
        filter_title.innerHTML = `${keyval}(0)`
        product.innerHTML = `
        <div class="result"
             <p>搜索结果为无</p>
        </div>`;
        return
    }

    data.forEach((item, index) => {
        str += `
        <div class="product_list" id="${item.goods_id}">
            <div class="list_img"><img src="${item.goods_small_logo}" alt="" id="${item.goods_id}"></div>
            <div class="list_title" id="${item.goods_id}">${item.goods_name}</div>
            <div class="list_price">￥${item.goods_price}</div>
        </div>`;
    })
    product.innerHTML = str;
};