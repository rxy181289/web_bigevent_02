$(function () {
    var layer = layui.layer
    var form = layui.form
    // 1.文章类别列表展示
    initArtCateList()

    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmStr = template('tpl-art-cate', res)
                $('tbody').html(htmStr)
            }
        })
    }

    // 2.显示添加文章分类列表
    var indexAdd = null
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html()
        });
    })

    // 3.提交文章分类添加(事件委托)
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 添加文章分类成功，所以要重新获取对应的元素
                initArtCateList()
                layer.msg('添加文章类别成功')
                layer.close(indexAdd)
            }
        })
    })

    // 4.修改-展示表单
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        //利用框架代码，显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html()
        });
        // 获取Id, 发送ajax获取数据, 渲染到页面
        var Id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })

    // 修改-提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 添加文章分类成功，所以要重新获取对应的元素
                initArtCateList()
                layer.msg('更新文章类别成功')
                layer.close(indexEdit)
            }
        })
    })

    // 5.删除
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList()
                    layer.msg('文章类别删除成功')
                    layer.close(index);
                }
            })
        })
    })
})
