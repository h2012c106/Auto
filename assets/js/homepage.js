let LIMIT = 2;
$(document).ready(function () {
  $.ajax({
    type: 'POST',
    url: '/news-homepage',
    data: { limit: LIMIT },
    dataType: 'json',
    success: function (data) {
      let msg = '';
      if (data.newsArr.length === 0) {
        msg = tools.EMPTY;
      } else {
        msg = tools.assemNews(data.newsArr);
      }
      $('div.news-wrapper').html(msg);
    },
    error: function (xhr, e) {
      alert(JSON.stringify(e));
    }
  });
  $.ajax({
    type: 'POST',
    url: '/forum-homepage',
    data: { limit: LIMIT },
    dataType: 'json',
    success: function (data) {
      let msg = '';
      if (data.forumArr.length === 0) {
        msg = tools.EMPTY;
      } else {
        msg = tools.assemForum(data.forumArr);
      }
      $('div.post-wrapper').html(msg);
    },
    error: function (xhr, e) {
      alert(JSON.stringify(e));
    }
  });
});