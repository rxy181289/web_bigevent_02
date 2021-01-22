$(function () {
    // 0.设置表单信息
    // 用等号切割，然后使用后面的值
    // alert(location.search.split('=')[1])
    var layer = layui.layer
    var form = layui.form
    function initForm() {
        var id = location.search.split('=')[1];
        $.ajax({
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data)

                tinyMCE.activeEditor.setContent(res.data.content)

                if (!res.data.cover_img) {
                    return layer.msg('用户未曾上传头像')
                }
                var newImgURL = baseURL + res.data.cover_img
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            }
        })
    }


    // 1.初始化分类
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
                // 文章分类渲染完比在调用，初始化form的方法
                initForm()
            }
        })
    }

    // 2.初始化富文本编辑器
    initEditor()

    // 3. 初始化图片裁剪器
    var $image = $('#image')
    //  裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    //  初始化裁剪区域
    $image.cropper(options)

    // 4 .点击按钮 上传图片
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    // 5.设置图片
    $('#file').on('change', function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0]
        // 校验
        if (file == undefined) {
            return;
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)
        // 先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 6.设置状态
    var state = "已发布"
    // $('#btnSave1').on('click', function () {
    //     state = '已发布'
    // })
    $('#btnSave2').on('click', function () {
        state = '草稿'
    })

    // 7.添加文章
    $('#form-edit').on('submit', function (e) {
        e.preventDefault()
        // 创建FormData对象
        var fd = new FormData(this);
        // 放入状态
        fd.append('state', state)
        // 放入图片
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 发送 ajax, 要在toBlob()函数里面
                // console.log(...fd);
                publisherArticle(fd)
            })
    })

    // 封装，添加文章的方法
    function publisherArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/edit',
            data: fd,
            // FormData类型数据提交ajax，需要设置两个false
            contentType: false,
            processData: false,
            success: function (res) {
                // 失败判断
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('修改文章成功')
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click()
                }, 1500);
            }
        })
    }
})