$('.want-reply').click(function () {
    let h = $(document).height() - $('textarea[name="reply"]').height();
    $('html,body').animate({ scrollTop: h }, 500);
    $('textarea[name="reply"]').val(`回复 ${$(this).data('username')} : ${$('textarea[name="reply"]').val()}`);
    $('textarea[name="reply"]').focus();
});

$('#forum-publish-btn').click(function () {
    let tmp = tools.qsToFd(location.search.substr(1));
    let formData = tools.formToFd('form#comment-form');
    formData.postId = Number(tmp.postId);
    $.ajax({
        type: 'POST',
        url: '/forum-reply',
        data: formData,
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                window.location.reload();
            } else {
                alert(data.info);
            }
        },
        error: function (xhr, e) {
            alert(JSON.stringify(e));
        }
    });
})