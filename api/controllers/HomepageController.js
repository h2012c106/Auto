/**
 * HomepageController
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
    if(userInfo.isLogged && userInfo.user.userType==='sup'){
      userInfo.newsUnreviewedNum=await News.count({hasReview: false});
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

    // News slider construction
    let newsQry = await News.find({
      where: { hasPic: true, hasReview: true },
      limit: 5,
      sort: 'time DESC',
      select: ['newsId', 'title']
    });
    let picNews = [];
    newsQry.forEach(function (n) {
      picNews.push({
        newsUrl: n.newsId,
        picUrl: `/images/newsPic/${n.newsId}.jpg`,
        title: n.title
      });
    });

    return res.view('homepage/index', {
      userInfo,
      picNews,
      carSum
    });
  }

};

