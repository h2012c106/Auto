/**
 * NewsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  index: async function (req, res) {

    // User status detection
    let userInfo = {
      isLogged: false,
      user: null
    };
    if (req.session.userId) {
      let userQry = await User.findOne({
        where: { userId: req.session.userId },
        select: ['userId', 'userName', 'userType']
      });
      if (userQry) {
        userInfo.user = JSON.parse(JSON.stringify(userQry));
        userInfo.isLogged = true;
      } else {
        delete req.session.userId;
      }
    }
    if (userInfo.isLogged && userInfo.user.userType === 'sup') {
      userInfo.newsUnreviewedNum = await News.count({ hasReview: false });
    }

    // Car Recommandation
    let carSum = {
      brands: sails.config.custom.brands,
      klasses: sails.config.custom.klasses,
      energies: sails.config.custom.energies,
      drives: sails.config.custom.drives,
      structs: sails.config.custom.structs,
      environStans: sails.config.custom.environStans,
    };

    return res.view('news/index', {
      userInfo,
      carSum
    });
  },

  newsHomepage: async function (req, res) {
    let newsQry = await News.find({
      where: { hasReview: true },
      limit: Number(req.body.limit),
      sort: 'time DESC',
      select: ['newsId', 'title', 'time', 'quotation', 'hasPic']
    });

    let newsArr = [];
    newsQry.forEach(function (n) {
      newsArr.push({
        newsUrl: `/news/detail?newsId=${n.newsId}`,
        picUrl: `/images/newsPic/${n.newsId}.jpg`,
        title: n.title,
        time: n.time.toLocaleString(),
        quotation: n.quotation,
        hasPic: n.hasPic,
      });
    });

    return res.json({
      newsArr
    });
  },

  newsQuery: async function (req, res) {
    let searchKey = req.body.searchKey;
    let where = { hasReview: true };

    let newsQry = [];
    if (typeof searchKey !== 'undefined' && parseSearchKey(searchKey).length !== 0) {
      searchKey = parseSearchKey(searchKey);
      for (let i = 0; i < searchKey.length; ++i) {
        let key = searchKey[i];
        let titleWhere = JSON.parse(JSON.stringify(where));
        titleWhere.title = { like: `%${key}%` };
        let titleArr = await News.find({
          where: titleWhere,
          select: ['newsId', 'title', 'time', 'quotation', 'hasPic']
        });
        let quotationWhere = JSON.parse(JSON.stringify(where));
        quotationWhere.quotation = { like: `%${key}%` };
        let quotationArr = await News.find({
          where: quotationWhere,
          select: ['newsId', 'title', 'time', 'quotation', 'hasPic']
        });
        newsQry = newsQry.concat(titleArr);
        newsQry = newsQry.concat(quotationArr);
      }
      newsQry = await sails.helpers.distinct(newsQry, 'newsId');
    } else {
      newsQry = await News.find({
        where: { hasReview: true },
        sort: 'time DESC',
        select: ['newsId', 'title', 'time', 'quotation', 'hasPic']
      });
    }

    let newsArr = [];
    newsQry.forEach(function (n) {
      newsArr.push({
        newsUrl: `/news/detail?newsId=${n.newsId}`,
        picUrl: `/images/newsPic/${n.newsId}.jpg`,
        title: n.title,
        time: n.time.toLocaleString(),
        quotation: n.quotation,
        hasPic: n.hasPic,
      });
    });

    return res.json({
      newsArr
    });
  },

  publish: async function (req, res) {

    // User status detection
    let userInfo = {
      isLogged: false,
      user: null
    };
    if (req.session.userId) {
      let userQry = await User.findOne({
        where: { userId: req.session.userId },
        select: ['userId', 'userName', 'userType']
      });
      if (userQry) {
        userInfo.user = JSON.parse(JSON.stringify(userQry));
        userInfo.isLogged = true;
      } else {
        delete req.session.userId;
      }
    }
    if (userInfo.isLogged && userInfo.user.userType === 'sup') {
      userInfo.newsUnreviewedNum = await News.count({ hasReview: false });
    }

    return res.view('news/publish', {
      userInfo
    });
  },

  newsPublish: async function (req, res) {

    // User status detection
    if (req.session.userId) {
      let userQry = await User.findOne({
        where: { userId: req.session.userId },
        select: ['userType']
      });
      if (!userQry || userQry.userType !== 'media') {
        return res.json({
          success: false,
          errorType: 'unauthorized',
          info: '您不是媒体账号，无权发布新闻'
        });
      }
    } else { // Visitor cant visit
      return res.json({
        success: false,
        errorType: 'unauthorized',
        info: '您不是媒体账号，无权发布新闻'
      });
    }

    let time = new Date();
    let newsId = prolongStr(time.getTime().toString(16), 15);
    req.file('pic').upload({
      dirname: require('path').resolve(sails.config.appPath, 'assets/images/newsPic'),
      saveAs: `${newsId}.jpg`
    }, async function (err, files) {
      if (err) {
        return res.serverError(err);
      } else {
        try {
          await News.create({
            newsId,
            title: req.body.title,
            time: time.toLocaleString(),
            author: req.body.author,
            text: req.body.text.replace(/\r/g, '').split('\n').filter(function (item) { return item.replace(/\s+/g, '').length !== 0; }).map(function (item) { return `<p>${item}</p>`; }).join(''),
            quotation: req.body.quotation.replace(/\s+/g, ' ').trim(),
            hasPic: files.length !== 0
          });

          return res.json({
            success: true
          });
        } catch (err) {
          return res.json({
            success: false,
            errorType: 'orm',
            info: err.details ? err.details : err
          });
        }
      }
    });
  },

  detail: async function (req, res) {

    // User status detection
    let userInfo = {
      isLogged: false,
      user: null
    };
    if (req.session.userId) {
      let userQry = await User.findOne({
        where: { userId: req.session.userId },
        select: ['userId', 'userName', 'userType']
      });
      if (userQry) {
        userInfo.user = JSON.parse(JSON.stringify(userQry));
        userInfo.isLogged = true;
      } else {
        delete req.session.userId;
      }
    }
    if (userInfo.isLogged && userInfo.user.userType === 'sup') {
      userInfo.newsUnreviewedNum = await News.count({ hasReview: false });
    }

    // Car Recommandation
    let carSum = {
      brands: sails.config.custom.brands,
      klasses: sails.config.custom.klasses,
      energies: sails.config.custom.energies,
      drives: sails.config.custom.drives,
      structs: sails.config.custom.structs,
      environStans: sails.config.custom.environStans,
    };

    let newsId = req.param('newsId');
    let newsInfo;
    if (!newsId) {
      res.redirect('/news');
    } else {
      newsInfo = await News.findOne({
        where: { newsId },
        select: ['title', 'time', 'quotation', 'author', 'text', 'hasPic', 'hasReview']
      });
      if (!newsInfo || (!newsInfo.hasReview && userInfo.user.userType !== 'sup')) {
        res.redirect('/news');
      } else {
        newsInfo = {
          title: newsInfo.title,
          time: newsInfo.time.toLocaleString(),
          quotation: newsInfo.quotation.length === 0 ? false : newsInfo.quotation,
          author: newsInfo.author.length === 0 ? '未知' : newsInfo.author,
          text: newsInfo.text,
          picUrl: newsInfo.hasPic ? `/images/newsPic/${newsId}.jpg` : false
        };
        res.view('news/detail', {
          userInfo,
          carSum,
          newsInfo
        });
      }
    }
  }
};

function parseSearchKey(searchKey) {
  searchKey = searchKey.split(/\s+/);
  searchKey = searchKey.filter(function (item) {
    return item.replace(/\s/g, '').length !== 0;
  });
  return searchKey;
}

function prolongStr(str, dstLen) {
  while (str.length < dstLen) {
    str += str;
  }
  str = str.slice(0, dstLen);
  return str;
}
