$(function () {
    // 1.获取用户登录的信息
    getUserinfo()

    var layer = layui.layer
    // 3.实现退出功能
    $('#btnlogout').on('click', function () {
        // 提示用户是否确定退出
        layer.confirm('是否确定退出?', { icon: 3, title: '提示' }, function (index) {
            // 推出本地存储token
            localStorage.removeItem('token')
            // 页面跳转到登录页
            location.href = '/login.html'
            // 关闭confirm询问框
            layer.close(index);
        });
    })
})

function getUserinfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('用户信息获取失败')
            }
            // 2.渲染用户头像
            randerUserinfo(res.data)
        },
        // complete: function (res) {
        //     console.log(res.responseJSON);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token')
        //         location.href = '/login.html'
        //     }
        // }
    })
}

function randerUserinfo(user) {
    // 获取用户的名字
    var name = user.nickname || user.username
    // 设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
    // 渲染头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}