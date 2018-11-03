let tools = {
  assemNews: function (newsArr) {
    let res = '';
    newsArr.forEach(function (newsInfo) {
      let tmp;
      if (newsInfo.hasPic) {
        tmp = `<article class="pic-news excerpt">
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
        tmp = `<article class="text-news excerpt">
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
      res += tmp;
    });
    return res;
  },

  assemForum: function (forumArr) {
    let res = '';
    forumArr.forEach(function (forumInfo) {
      let tagArr = '';
      forumInfo.tagArr.forEach(function (tag) {
        tagArr += `<span class="tag-wrapper"><a href="/forum?tagId=${tag.tagId}">${tag.tagName}</a></span>`;
      });
      res += `<article class="post excerpt">
        <header>
            <h2>
                <a href="${forumInfo.postUrl}" title="${forumInfo.title}">${forumInfo.title}</a>
            </h2>
        </header>
        <p class="meta">
            <time class="time"><i class="glyphicon glyphicon-time"></i> ${forumInfo.time}</time>
            <span class="comment"><i class="glyphicon glyphicon-user"></i> ${forumInfo.author}</span>
            <span class="comment"><i class="glyphicon glyphicon-comment"></i> ${forumInfo.reply}</span>
            <span class="comment tags-wrapper">${tagArr}</span>
        </p>
        <span class="note">${forumInfo.text}</span>
      </article>`;
    });
    return res;
  },

  assemCar: function (carArr) {
    let res = '';
    carArr.forEach(function (carInfo) {
      res += `<div class="car-item-wrapper excerpt">
      <div class="car-pic">
        <a class="focus" href="${carInfo.carUrl}" title="${carInfo.carName}">
          <img class="thumb" src="${carInfo.picUrl}" alt="${carInfo.carName}">
        </a>
      </div>
      <div class="car-name">
        <a href="${carInfo.carUrl}" title="${carInfo.carName}">${carInfo.carName}</a>
      </div>
    </div>`;
    });
    return res;
  },

  assemPagination: function (pageNum) {
    let res = `<ul class="pagination">
    <li class="page-item">
      <span class="page-link" data-page="prv" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only">Previous</span>
      </span>
    </li>`;

    for (let i = 1; i <= pageNum; ++i) {
      res += `<li class="page-item"><span class="page-link" data-page="${i}">${i}</span></li>`;
    }

    res += `<li class="page-item">
        <span class="page-link" data-page="nxt" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
          <span class="sr-only">Next</span>
        </span>
      </li>
    </ul>`;

    return res;
  },

  formToFd: function (selector) {
    let queryString = $(selector).serialize();
    return this.qsToFd(queryString);
  },

  qsToFd: function (str) {
    str = str.replace(/\+/g, ' ');
    str = decodeURIComponent(str);
    let formData = {};
    str.split('&').forEach(function (qs) {
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
  },

  EMPTY: `<div class="empty-wrapper"><h1>暂无相关数据</h1></div>`,

  PAGECAP: 8
}