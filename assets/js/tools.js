function assemNews(newsInfo) {
  if (newsInfo.hasPic) {
    return `<article class="pic-news excerpt">
          <a class="focus" href="${newsInfo.newsUrl}" title="${newsInfo.title}">
              <img class="thumb" src="${newsInfo.picUrl}" alt="${newsInfo.title}">
          </a>
          <header>
              <h2>
                  <a href="${newsInfo.newsUrl}" title="${newsInfo.title}">${newsInfo.title}</a>
              </h2>
          </header>
          <p class="meta">
              <time class="time"><i class="glyphicon glyphicon-time"></i> ${newsInfo.time}</time>
          </p>
          <p class="note">${newsInfo.quotation}</p>
          </article>`;
  }
  else {
    return `<article class="text-news excerpt">
          <header>
              <h2>
                  <a href="${newsInfo.newsUrl}" title="${newsInfo.title}">${newsInfo.title}</a>
              </h2>
          </header>
          <p class="meta">
              <time class="time"><i class="glyphicon glyphicon-time"></i> ${newsInfo.time}</time>
          </p>
          <p class="note">${newsInfo.quotation}</p>
          </article>`;
  }
}

let tools = {
  newsLoader: function (param) {
    $.ajax({
      type: 'POST',
      url: '/newsQuery',
      data: param,
      dataType: 'json',
      success: function (data) {
        let msg = '';
        data.newsArr.forEach(function (item) {
          msg += assemNews(item);
        });
        $('div#news-wrapper').html(msg);
      },
      error: function (xhr, e) {
        alert(JSON.stringify(e));
      }
    });
  },

  qsToFd: function (selector) {
    let queryString = $(selector).serialize();
    let formData = {};
    queryString.split('&').forEach(function (qs) {
      let tmpQs = qs.split('=');
      formData[tmpQs[0]] = tmpQs[1];
    });
    return formData;
  },

  fdToQs: function (obj) {
    let queryString = [];
    for (let key in obj) {
      queryString.push(`${key}=${obj[key]}`);
    }
    queryString = queryString.join('&');
    return queryString;
  }
}