$(function () {
    // 为art-template定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)
        var h = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return h + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 1.定义提交参数
    var q = {
        pagenum: 1, //	页码值
        pagesize: 2, //	每页显示多少条数据
        cate_id: '',//	文章分类的 Id
        state: '',	//文章的状态，可选值有：已发布、草稿
    }

    // 2.初始化文章列表
    var layer = layui.layer
    initTable()
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.messgae)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用分页
                renderPage(res.total)
            }
        })
    }

    // 3.初始化分类
    var form = layui.form
    initCate()
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 4.筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中的值
        var state = $('[name=state]').val();
        var cate_id = $('[name=cate_id]').val()
        // 为查询对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    // 5.分页
    var laypage = layui.laypage
    function renderPage(total) {
        // 执行一个laypage实例
        laypage.render({
            elem: 'pageBox', // 存放分页的容器
            count: total, // 数据总数，从服务端得到
            limit: q.pagesize, // 每页几条
            curr: q.pagenum, // 第几页

            // 分页模块设置，显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10] // 每页显示多少条数据的选择器
            ,
            // 触发jump: 分页初始化的时候，页码改变的时候
            jump: function (obj, first) {
                // obj: 所有参数所在的对象; first: 是否是第一次初始化分页
                // 改变当前页面
                q.pagenum = obj.curr;
                q.pagesize = obj.limit
                // 判断，不是第一次初始化分页，才能重新调用初始化文章列表
                if (!first) {
                    // 初始化文章列表
                    initTable()
                }
            }
        })
    }

    // 6.删除
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('文章分类删除成功')
                    // 页面汇总删除按钮个数等于1，页码大于1
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--
                    initTable()

                }
            })
            layer.close(index);
        })
    })
})