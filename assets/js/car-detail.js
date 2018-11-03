let NEWSLIMIT = 5;
$(document).ready(function () {
  let searchKey = $('.brand-news').data('brandname');
  $.ajax({
    type: 'POST',
    url: '/news-query',
    data: { searchKey },
    dataType: 'json',
    success: function (data) {
      let msg = '';
      if (data.newsArr.length === 0) {
        msg = tools.EMPTY;
      } else {
        let newsArr = data.newsArr.slice(0, NEWSLIMIT);
        msg = assemNews(data.newsArr);
      }
      $('div.brand-news').html(msg);
    },
    error: function (xhr, e) {
      alert(JSON.stringify(e));
    }
  });
});

function assemNews(newsArr) {
  let res = '<ul>';
  newsArr.forEach(function (n) {
    res += `<li><a href="${n.newsUrl}" title="${n.title}">${n.title}</a></li>`;
  });
  res += '</ul>';
  return res;
}