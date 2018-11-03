/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  /**
   * `AdminController.newsReview()`
   */
  newsReview: async function (req, res) {

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
        if (userQry.userType === 'sup') {
          userInfo.user = JSON.parse(JSON.stringify(userQry));
          userInfo.isLogged = true;
        } else { // Norm and media user cant visit
          return res.redirect('/');
        }
      } else { // Visitor cant visit
        delete req.session.userId;
        return res.redirect('/');
      }
    } else { // Visitor cant visit
      return res.redirect('/');
    }
    // if (userInfo.isLogged && userInfo.user.userType === 'sup') {
    //   userInfo.newsUnreviewedNum = await News.count({ hasReview: false });
    // }

    let newsUnreviewed = await News.find({
      where: { hasReview: false },
      select: ['newsId', 'title', 'author', 'time'],
      sort: 'time DESC'
    });
    newsUnreviewed.forEach(function (n) {
      n.time = n.time.toLocaleString();
    });
    userInfo.newsUnreviewedNum = newsUnreviewed.length;

    return res.view('user/admin-news-review', {
      userInfo,
      newsUnreviewed
    });
  },

  /**
   * `AdminController.newsPass()`
   */
  newsPass: async function (req, res) {

    // User status detection
    if (req.session.userId) {
      let userQry = await User.findOne({
        where: { userId: req.session.userId },
        select: ['userType']
      });
      if (!userQry || userQry.userType !== 'sup') {
        return res.json({
          success: false,
          errorType: 'unauthorized',
          info: '您没有当前操作的权限'
        });
      }
    } else { // Visitor cant visit
      return res.json({
        success: false,
        errorType: 'unauthorized',
        info: '您没有当前操作的权限'
      });
    }

    await News.update({ newsId: req.body.newsIdArr }, { hasReview: true });
    return res.json({
      success: true
    });
  },

  /**
   * `AdminController.newsKill()`
   */
  newsKill: async function (req, res) {

    // User status detection
    if (req.session.userId) {
      let userQry = await User.findOne({
        where: { userId: req.session.userId },
        select: ['userType']
      });
      if (!userQry || userQry.userType !== 'sup') {
        return res.json({
          success: false,
          errorType: 'unauthorized',
          info: '您没有当前操作的权限'
        });
      }
    } else { // Visitor cant visit
      return res.json({
        success: false,
        errorType: 'unauthorized',
        info: '您没有当前操作的权限'
      });
    }

    await News.destroy({ newsId: req.body.newsIdArr });
    const fs = require('fs');
    const picDir = require('path').resolve(sails.config.appPath, 'assets/images/newsPic/') + '\\';
    req.body.newsIdArr.forEach(function (newsId) {
      if (fs.existsSync(picDir + newsId + '.jpg')) {
        fs.unlinkSync(picDir + newsId + '.jpg');
      }
    });
    return res.json({
      success: true
    });
  },


  /**
   * `AdminController.user()`
   */
  user: async function (req, res) {

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
        if (userQry.userType === 'sup') {
          userInfo.user = JSON.parse(JSON.stringify(userQry));
          userInfo.isLogged = true;
        } else { // Norm and media user cant visit
          return res.redirect('/');
        }
      } else { // Visitor cant visit
        delete req.session.userId;
        return res.redirect('/');
      }
    } else { // Visitor cant visit
      return res.redirect('/');
    }
    if (userInfo.isLogged && userInfo.user.userType === 'sup') {
      userInfo.newsUnreviewedNum = await News.count({ hasReview: false });
    }

    let allUser = await User.find({
      select: ['userId', 'userName', 'userType'],
      sort: 'userType ASC'
    });

    return res.view('user/admin-user', {
      userInfo,
      allUser
    });
  },

  /**
   * `AdminController.userAlt()`
   */
  userAlt: async function (req, res) {

    // User status detection
    if (req.session.userId) {
      let userQry = await User.findOne({
        where: { userId: req.session.userId },
        select: ['userType']
      });
      if (!userQry || userQry.userType !== 'sup') {
        return res.json({
          success: false,
          errorType: 'unauthorized',
          info: '您没有当前操作的权限'
        });
      }
    } else { // Visitor cant visit
      return res.json({
        success: false,
        errorType: 'unauthorized',
        info: '您没有当前操作的权限'
      });
    }

    for (let i = 0; i < req.body.userInfoArr.length; ++i) {
      let u = req.body.userInfoArr[i];
      let userId = Number(u.userId);
      if (userId !== req.session.userId) {
        await User.update({ userId }, { userType: u.userType });
      }
    }
    return res.json({
      success: true
    });
  },

  /**
   * `AdminController.userKill()`
   */
  userKill: async function (req, res) {

    // User status detection
    if (req.session.userId) {
      let userQry = await User.findOne({
        where: { userId: req.session.userId },
        select: ['userType']
      });
      if (!userQry || userQry.userType !== 'sup') {
        return res.json({
          success: false,
          errorType: 'unauthorized',
          info: '您没有当前操作的权限'
        });
      }
    } else { // Visitor cant visit
      return res.json({
        success: false,
        errorType: 'unauthorized',
        info: '您没有当前操作的权限'
      });
    }

    let userIdArr = req.body.userIdArr
      .map(function (userId) { return Number(userId); })
      .filter(function (userId) {
        if (userId === req.session.userId) {
          return false;
        } else {
          return true;
        }
      });
    await User.destroy({ userId: userIdArr });
    return res.json({
      success: true
    });
  },

};

