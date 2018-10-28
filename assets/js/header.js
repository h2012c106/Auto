$('body').keydown(function () {
  if (event.keyCode === 13) {
    if ($('.bootstrap-dialog').length > 0) {
      $('.bootstrap-dialog button.btn-primary').click();
    }
  }
});

$('#login-btn').click(function () {
  BootstrapDialog.show({
    type: BootstrapDialog.TYPE_DEFAULT,
    title: '',
    message: function (diaSelf) {
      let msg = '<label>用户名</label><input name="userName" class="form-control">';
      msg += '<label>密码</label><input name="pwd" type="password" class="form-control">';
      msg += '<input type="checkbox" name="remMe" value=1 /> 30天内自动登陆';

      msg = `<form id="login-form" class="dialog">${msg}</form>`;

      return msg;
    },
    buttons: [{
      label: '登陆',
      cssClass: 'btn-primary',
      action: function (diaSelf) {
        let formData = tools.qsToFd('form#login-form');
        $.ajax({
          type: 'POST',
          url: '/login',
          data: formData,
          dataType: 'json',
          success: function (data) {
            if (data.success) {
              window.location.reload();
            } else {
              alert(data.info);
              switch (data.errorType) {
                case 'userName':
                  $('input[name="userName"').val('');
                  $('input[name="pwd"').val('');
                  break;
                case 'pwd':
                  $('input[name="pwd"').val('');
                  break;
                case 'logged':
                  diaSelf.close();
                  break;
              }
            }
          },
          error: function (xhr, e) {
            alert(JSON.stringify(e));
          }
        });
      }
    }],
    closable: true
  });
});

$('#signup-btn').click(function () {
  BootstrapDialog.show({
    type: BootstrapDialog.TYPE_DEFAULT,
    title: '',
    message: function (diaSelf) {
      let msg = `<label>用户类型</label><select name="userType" class="form-control">
        <option value="norm">普通用户</option>
        <option value="media">媒体</option>
        <option value="sup">管理员</option>
      </select>`;
      msg += '<label>用户名</label><input name="userName" class="form-control">';
      msg += '<label>密码</label><input name="pwd" type="password" class="form-control">';

      msg = `<form id="signup-form" class="dialog">${msg}</form>`;

      return msg;
    },
    buttons: [{
      label: '注册',
      cssClass: 'btn-primary',
      action: function (diaSelf) {
        let formData = tools.qsToFd('form#signup-form');
        $.ajax({
          type: 'POST',
          url: '/signup',
          data: formData,
          dataType: 'json',
          success: function (data) {
            if (data.success) {
              window.location.reload();
            } else {
              alert(data.info);
              switch (data.errorType) {
                case 'exist':
                  $('input[name="userName"').val('');
                  break;
                case 'logged':
                  diaSelf.close();
                  break;
              }
            }
          },
          error: function (xhr, e) {
            alert(JSON.stringify(e));
          }
        });
      }
    }],
    closable: true
  });
});

$('#logout-btn').click(function () {
  $.ajax({
    type: 'POST',
    url: '/logout',
    success: function (data) {
      if (data.success) {
        window.location.reload();
      }
    },
    error: function (xhr, e) {
      alert(JSON.stringify(e));
    }
  });
});

$('#search-btn').click(function () {
  let formData = tools.qsToFd('form#search-form');
  if (formData.type === 'news') {

  } else if (formData.type === 'forum') {

  }
});