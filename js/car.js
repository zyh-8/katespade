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
            let search = keyword.value;
            // 根据关键字，到数据库模糊查询，将查询到的数据渲染到页面
            // 如果搜索无结果，显示【搜素结果为0】
            // 请求数据
            // 根据keyword获取数据
            pAjax({
                url: '../api/detail.php',
                data: {
                    search: search,
                }
            }).then(res => {
                res = JSON.parse(res);
                console.log(res);
                renderHtml(res.detail)
            })

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


let shopping = document.querySelector(".shopping"); //装购物商品的盒子
// 判断是否有登录
let login = getCookie('login');
console.log(login);
if (!login) {
    console.log(1);
    location.href = '../html/login.html';
    // setCookie('url','http://gz2008.com/day06_code/project/html/car.html')
    localStorage.setItem('url', 'http://www.katespade.com/html/car.html');
}
// 获取用户购物车中的数据
pAjax({
    url: '../api/getCarData.php',
    data: { tel: login }
}).then(res => {

    res = JSON.parse(res);
    console.log(res.length)
        // 先把数据存放到本地
    localStorage.setItem('goodsList', JSON.stringify(res));

    render(res);
})

// 渲染数据
//item.is_select会影响选择框的选中状态
function render(data) {
    //全部商品全选的时候，全选按钮勾上
    var allChecked = data.every(item => {
        return item.is_select == 1;
    });

    let total = shopNum(data); //购物车商品数量

    // data 请求出来的数据 有可能一条数据都没有
    if (data.length == 0) {
        shopping.innerHTML = `
            <h1 class="title">你的购物车共有${data.length}件商品</h1>
            <div class="header">
                <div class="check">
                    <input class="allselect" type="checkbox"  id="all"  ${allChecked?'checked' :''}>
                    <div class="text">全选</div>
                </div>
                <a class="continue" href="list.html?search=新品">查看当季新品</a>
            </div>
            <div class="product">
                <div class="product_list" >
                    <div class="product_car">
                        <div class="left">
                        </div> 
                        <div class="right">
                        </div> 
                    </div>
                 </div>
            </div>
            <div class="operate">
                <div class="total">总计：￥<span class="total_price">${total.totalPrice}</span></div>
                <div class="order">立即结算</div>
            </div>
            `;
        return
    }

    let str = `
    <h1 class="title">你的购物车共有${data.length}件商品</h1>
    <div class="header">
        <div class="check">
            <input class="allselect" type="checkbox"  id="all"  ${allChecked?'checked' :''}>
            <div class="text">全选</div>
        </div>
        <a class="continue" href="list.html?search=">继续购物</a>
    </div>`;
    str += `<div class="product">`;
    data.forEach(item => {
        str += ` 
            <div class="product_list" >
                <div class="product_car">
                    <div class="left">
                        <img src="${item.goods_small_logo}" alt="">
                        <input class="check" type="checkbox" ${item.is_select==1 ?'checked':''}  goods_id="${item.goods_id}">
                    </div>

                    <div class="right">
                        <div class="r_top">
                            <div class="top_title">${item.goods_name}<button class="del" goods_id="${item.goods_id}">x</button></div>
                            
                        </div>
                        <div class="color">颜色：黑色</div>
                        <div class="size">尺寸：6</div>
                        <div class="number" goods_id="${item.goods_id}">
                            <div class="jian">-</div>
                            <div class="num">${item.cart_number}</div>
                            <div class="jia">+</div>
                        </div>
                        <div class="price">￥${item.goods_price}</div>
                    </div>
                </div>
            </div>
        `
    })
    str += `</div>`;
    str += `
    <div class="operate">
        <div class="total">总计：￥<span class="total_price">${total.totalPrice}</span></div>
        <div class="order">立即结算</div>
    </div>`;
    shopping.innerHTML = str;

}

shopping.onclick = function() {
    let e = window.event;
    // 全选
    if (e.target.id == 'all') {
        let data = JSON.parse(localStorage.getItem('goodsList'));
        data.forEach(item => {
            e.target.checked ? item.is_select = 1 : item.is_select = 0
        });
        console.log(data)
        localStorage.setItem('goodsList', JSON.stringify(data));
        render(data);
    }

    // 单选
    if (e.target.className == 'check') {
        let id = e.target.getAttribute('goods_id');
        let data = JSON.parse(localStorage.getItem('goodsList'));
        data.forEach(item => {
                if (item.goods_id == id) {
                    item.is_select = e.target.checked ? 1 : 0;
                }
            })
            // 需要把 修改够的数据存储本地存储中
        localStorage.setItem('goodsList', JSON.stringify(data));
        render(data);
    }
    // 删除
    if (e.target.classList.contains('del')) {
        // 删除数据库中 和 本地存储中对应的数据 
        let id = e.target.getAttribute('goods_id');
        pAjax({
            url: '../api/removeCarData.php',
            data: {
                tel: login,
                goods_id: id
            }
        }).then(res => {
            res = JSON.parse(res);
            console.log(res)
            if (res.code) {
                // 先获取本地存储中的数据
                let data = JSON.parse(localStorage.getItem('goodsList'));
                let res = data.filter(item => {
                    return item.goods_id != id;
                });

                localStorage.setItem('goodsList', JSON.stringify(res));
                render(res);
            }
        })
    }

    // 更新商品的数量
    // 进行数量加减法

    if (e.target.classList.contains('jian')) {
        let data = JSON.parse(localStorage.getItem('goodsList'));

        let id = e.target.parentElement.getAttribute('goods_id');

        let obj = data.filter(item => {
            return item.goods_id == id
        })[0];

        let num = obj.cart_number * 1;
        if (num <= 1) {
            num = 1
        } else {
            num--
        }
        pAjax({
            url: '../api/updCarData.php',
            data: {
                tel: login,
                goods_id: id,
                goods_num: num
            }
        }).then(res => {
            res = JSON.parse(res);
            if (res.code) {
                obj.cart_number = num;
                localStorage.setItem('goodsList', JSON.stringify(data));
                render(data);
            }
        })
    }
    if (e.target.classList.contains('jia')) {
        let data = JSON.parse(localStorage.getItem('goodsList'));

        let id = e.target.parentElement.getAttribute('goods_id');

        let obj = data.filter(item => {
            return item.goods_id == id
        })[0];

        let num = obj.cart_number * 1;

        num++;

        pAjax({
            url: '../api/updCarData.php',
            data: {
                tel: login,
                goods_id: id,
                goods_num: num
            }
        }).then(res => {
            res = JSON.parse(res);
            if (res.code) {
                obj.cart_number = num;
                localStorage.setItem('goodsList', JSON.stringify(data));
                render(data);
            }
        })
    }
    // 结算
    // 删除选中的商品， 并把选中的商品总价清零
    if (e.target.className == "order") {
        // 获取本地的数据
        let data = JSON.parse(localStorage.getItem('goodsList'));
        // 过滤出来选中的商品
        let res = data.filter(item => {
            return item.is_select == 1
        });
        console.log(res);
        // 把这些商品删除
        res.forEach((item) => {
            let id = item.goods_id;
            console.log(id);
            pAjax({
                url: '../api/removeCarData.php',
                data: {
                    tel: login,
                    goods_id: id
                }
            }).then(res => {
                res = JSON.parse(res);
                console.log(res);
                if (res.code) {
                    // 先获取本地存储中的数据
                    let data = JSON.parse(localStorage.getItem('goodsList'));
                    let res = data.filter(item => {
                        return item.goods_id != id;
                    });

                    localStorage.setItem('goodsList', JSON.stringify(res));
                    render(res);
                }
            })
        })

    }

}

function shopNum(goods) {
    let res = goods.filter(item => {
        return item.is_select == 1
    })

    // 计算选中商品的数量
    let totalNum = res.reduce((pre, item) => {
        return pre + item.cart_number * 1
    }, 0);

    // 计算选中商品的总价格
    let totalPrice = res.reduce((pre, item) => {
        return pre + item.goods_price * item.cart_number
    }, 0);

    totalPrice = totalPrice.toFixed(2);
    return {
        totalNum,
        totalPrice
    }
};