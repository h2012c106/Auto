$('.num-input').on('input', function () {
  let inp = $(this).val();
  $(this).val(inp.replace(/[^\d.]/g, ''));
});

$('.num-input').change(function () {
  let inp = $(this).val().trim();
  if (!isNum(inp)) {
    $(this).val('');
  }
});

$('#recom-btn').click(function () {
  let formData = tools.formToFd('#recom-form');
  let childInfo = {};
  for (let key in formData) {
    if (formData[key] !== '' && formData[key] !== 'any') {
      childInfo[key] = formData[key];
    }
  }
  let queryString = tools.fdToQs(childInfo);
  window.location.href = queryString ? `/car?${queryString}` : '/car';
});

function isNum(str) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  if (regPos.test(str)) {
    return true;
  } else {
    return false;
  }
}