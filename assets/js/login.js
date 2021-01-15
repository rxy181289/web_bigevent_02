$(function () {
    $('#link_reg').on('click', function () {
        $('.login_box').hide()
        $('.reg_box').show()
    })

    $('#link_login').on('click', function () {
        $('.login_box').show()
        $('.reg_box').hide()
    })

    // 2.自定义表单验证
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,16}$/,
            '密码必须输入6-16位,并且不能为空格'
        ],
        // 确认密码规则
        repwd: function (value) {
            var pwd = $('.reg_box [name=password]').val();
            if (value !== pwd) {
                return '两次的密码输入并不一致'
            }
        }
    })

    // 3.注册
    $('#reg_form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg_box [name=username]').val(),
                password: $('.reg_box [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录')
                // 自动跳转到登录页面
                $('#link_login').click()
                // 重置form表单
                $('.layui-form')[0].reset()
            }
        })
    })

    // 4.登录
    $('#login_form').submit(function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 提示
                layer.msg('登录成功')
                // 把token存储到本地
                localStorage.setItem('token', res.token)
                // 页面跳转
                location.href = '/index.html'
            }
        })
    })
})