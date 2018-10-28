$('input[name="pwd"]').on('change', function () {
  if ($('input[name="pwdConfirm"]').length > 0) {
    $('input[name="pwdConfirm"]').val('');
  } else {
    $('#confirm-pwd-wrapper').html(`<label>确认密码</label>
        <input name="pwdConfirm" type="password" class="form-control user-setting-input">`);
  }
});

$('#user-setting-btn').click(function () {
  let formData = tools.qsToFd('#user-setting-form');
  if ($('input[name="pwdConfirm"]').length > 0 && $('input[name="pwdConfirm"]').val() !== $('input[name="pwd"]').val()) {
    $('input[name="pwdConfirm"]').val('');
    alert('密码确认错误，请重新输入');
  } else {
    formData.userId = Number($('#user-setting-form').data('userid'));
    $.ajax({
      type: 'POST',
      url: '/user/alter',
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
  }
});

$('#user-deletion-btn').click(function () {
  let formData = { userId: Number($('#user-setting-form').data('userid')) };
  $.ajax({
    type: 'POST',
    url: '/user/delete',
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