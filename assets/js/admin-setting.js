$('.table-wrapper .quatre-btn-wrapper .btn').hover(function () {
  $(this).attr({ title: `已选择${$('input[type="checkbox"]:checked').length}条项目` });
});

$('#all-check-btn').click(function () {
  $('input[type="checkbox"]').each(function () {
    if (!$(this).prop('disabled')) {
      $(this).prop({ checked: true });
    }
  });
});

$('#anti-check-btn').click(function () {
  $('input[type="checkbox"]').each(function () {
    if (!$(this).prop('disabled')) {
      $(this).prop({ checked: !$(this).prop('checked') });
    }
  });
});

$('#news-pass-btn').click(function () {
  let formData = { newsIdArr: [] };
  $('input[type="checkbox"]:checked').each(function () {
    formData.newsIdArr.push($(this).data('newsid'));
  });
  $.ajax({
    type: 'POST',
    url: '/admin/setting/news-pass',
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
});

$('#news-kill-btn').click(function () {
  let formData = { newsIdArr: [] };
  $('input[type="checkbox"]:checked').each(function () {
    formData.newsIdArr.push($(this).data('newsid'));
  });
  $.ajax({
    type: 'POST',
    url: '/admin/setting/news-kill',
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
});

$('#user-alt-btn').click(function () {
  let formData = { userInfoArr: [] };
  $('input[type="checkbox"]:checked').each(function () {
    formData.userInfoArr.push({
      userId: $(this).data('userid'),
      userType: $('.usertype-select', $(this).closest('tr')).val()
    });
  });
  $.ajax({
    type: 'POST',
    url: '/admin/setting/user-alt',
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
});

$('#user-kill-btn').click(function () {
  let formData = { userIdArr: [] };
  $('input[type="checkbox"]:checked').each(function () {
    formData.userIdArr.push($(this).data('userid'));
  });
  $.ajax({
    type: 'POST',
    url: '/admin/setting/user-kill',
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
});