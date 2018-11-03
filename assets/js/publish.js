$('input#pic-input').change(function () {
    let picName = $(this).val().split('\\');
    picName = picName[picName.length - 1];
    $('label.pic-upload').prop({ title: picName });
});

$('#news-publish-btn').click(function () {
    let data = new FormData($('#publish-form')[0]);
    $.ajax({
        type: 'POST',
        url: '/news-publish',
        data,
        processData: false,
        contentType: false,
        cache: false,
        success: function (data) {
            if (data.success) {
                window.location.href = '/news';
            } else {
                alert(data.info);
            }
        },
        error: function (xhr, e) {
            alert(JSON.stringify(e));
        }
    });
});

$('.forum-name').click(function () {
    if ($(this).hasClass('chosen-tag')) {
        $(this).removeClass('chosen-tag');
    } else {
        $(this).addClass('chosen-tag');
    }
});

$('.dropdown-menu').click(function (e) {
    e.stopPropagation();
});

$('#forum-publish-btn').click(function () {
    let formData = tools.formToFd('form#publish-form');
    formData.tagArr = [];
    $('span.chosen-tag').each(function () {
        formData.tagArr.push($(this).data('tagid'));
    });
    $.ajax({
        type: 'POST',
        url: '/forum-publish',
        data: formData,
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                window.location.href = `/forum/detail?postId=${data.info.postId}`;
            } else {
                alert(data.info);
            }
        },
        error: function (xhr, e) {
            alert(JSON.stringify(e));
        }
    });
});