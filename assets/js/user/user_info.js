$(function () {
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度为1~6位'
            }
        }
    });

    // 2.用户渲染
    formUserInfo()
    // 导出layer
    var layer = layui.layer;
    // 封装函数
    function formUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 成功后渲染
                form.val('formUserInfo', res.data)
            }
        })
    }

    //3. 表单重置
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        // 重新渲染用户
        formUserInfo()
    })

    // 4.用户修改信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('修改信息成功')
                // 调用父页面中的更新用户信息和头像方法
                window.parent.getUserinfo()
            }
        })
    })
})