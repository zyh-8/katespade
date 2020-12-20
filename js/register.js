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
            // let keyword = document.querySelector("#keyword");
            let keyval = keyword.value;
            // 将获取到的关键字上传到list.html
            window.location.href = '../html/list.html?search=' + keyval;
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


// 图形验证
//初始化验证码
let verifyCode = new GVerify({
    id: "picyzm",
    length: 1
});
//点击按钮验证
var draw1 = document.querySelector(".draw1");
var draw2 = document.querySelector(".draw2");
var code = document.getElementById("code_input");
var tel = document.querySelector("#tel");
var tel1 = document.querySelector(".tel1");
var tel2 = document.querySelector(".tel2");
var password = document.querySelector("#password");
var psw1 = document.querySelector(".psw1");
var psw2 = document.querySelector(".psw2");

var btn = document.getElementById("btn"); //注册按钮

var flag1 = false;
var flag2 = false;
var flag3 = false;
var flag4 = false;
// 绑定change事件


tel.onchange = telFun;
password.onchange = passwordFun;
code.onchange = codeFun;
btn.onclick = registerFun;

function codeFun() {
    // 拿到验证的结果
    let res = verifyCode.validate(code.value);
    if (res) {
        draw1.style.display = "block";
        draw2.style.display = "none";
        flag3 = true;

    } else {
        draw1.style.display = "none";
        draw2.style.display = "block";
    }
};

function telFun() {
    // 正则表达式
    var reg1 = /^1[356789]\d{9}$/
    var res = tel.value
        // 如果输入的内容符合规则
        // 就执行下面的代码
    if (reg1.test(res)) {
        tel1.style.display = 'none';
        tel2.style.display = 'none';
        flag1 = true
    } else {
        // 如果输入的内容不符合规则
        // 执行下面的代码
        tel1.style.display = 'none'
        tel2.style.display = 'block'
    }
    // 如果没有输入内容
    // 不显示状态
    if (res == false) {
        tel1.style.display = "block";
        tel2.style.display = 'none'
    }
}

function passwordFun() {
    // 正则表达式
    var reg2 = /^[0-9a-zA-Z,\.]{8,14}$/
    var res = password.value
        // 如果输入的内容符合规则
        // 就执行下面的代码
    if (reg2.test(res)) {
        psw1.style.display = 'none'
        psw2.style.display = 'none'
        flag2 = true
    } else if (res == false) {
        // 如果没有输入内容
        // 不显示状态
        psw1.style.display = "block";
        psw2.style.display = 'none';

    } else {
        // 如果输入的内容不符合规则
        // 执行下面的代码 
        psw1.style.display = 'none';
        psw2.style.display = 'block';
        flag2 = false
    }
}

function registerFun() {
    codeFun();
    telFun();
    passwordFun();
    if (flag1 == false || flag2 == false || flag3 == false) {
        return
    }
    // 获取电话号码（用户名）和密码
    let telval = tel.value;
    let pswval = password.value;
    // 将获取的数据添加到user数据库中，并提醒【注册成功】
    // 如果存在相同的电话号码，提醒【该号码已注册】
    pAjax({
        type: "post",
        url: '../api/register.php',
        data: {
            telval: telval,
            pswval: pswval,
        },
    }).then(res => {
        res = JSON.parse(res);
        console.log(res); //{code: 0, msg: "该用户已经存在"}
        console.log(res.msg);
        // 判断code为0还是1， 为1则注册成功， 跳转登录页面
        if (res.code == 1) {
            alert(res.msg);
            window.location.href = "../../html/login.html"
            return
        }
        alert(res.msg); //提醒信息
        // 清空输入框
        tel.value = "";
        password.value = "";
        code.value = "";
    });

}