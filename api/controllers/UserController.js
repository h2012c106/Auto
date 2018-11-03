/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  /**
   * `UserController.signup()`
   */
  signup: async function (req, res) {
    if (!req.session.userId) {
      let userQry = await User.findOne({
        where: {
          userName: req.body.userName
        },
        select: ['userId']
      });

      if (userQry) {
        return res.json({
          success: false,
          errorType: 'exist',
          info: '该用户名已存在，请更换用户名'
        });
      } else {
        try {
          let newUser = await User.create({
            userName: req.body.userName,
            pwd: req.body.pwd,
            userType: req.body.userType
          });

          req.session.userId = newUser.userId;
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
    } else {
      return res.json({
        success: false,
        errorType: 'logged',
        info: '您已处于登录状态，请先注销'
      });
    }
  },

  /**
   * `UserController.login()`
   */
  login: async function (req, res) {
    if (!req.session.userId) {
      let userQry = await User.findOne({
        where: {
          userName: req.body.userName
        },
        select: ['userId', 'userName', 'userType', 'pwd']
      });

      if (!userQry) {
        return res.json({
          success: false,
          errorType: 'userName',
          info: '用户名不存在，请重新输入'
        });
      } else if (userQry.pwd !== req.body.pwd) {
        return res.json({
          success: false,
          errorType: 'pwd',
          info: '密码错误，请重新输入'
        });
      } else {
        if (req.body.remMe && !req.isSocket) {
          req.session.cookie.maxAge = sails.config.custom.rememberMeCookieMaxAge;
        }
        req.session.userId = userQry.userId;
        return res.json({
          success: true
        });
      }
    } else {
      return res.json({
        success: false,
        errorType: 'logged',
        info: '您已处于登录状态，请先注销'
      });
    }
  },

  /**
   * `UserController.logout()`
   */
  logout: async function (req, res) {
    req.session.cookie.maxAge = -1;
    if (req.session.userId) {
      delete req.session.userId;
    }
    return res.json({
      success: true
    });
  },

  /**
   * `UserController.index()`
   */
  index: async function (req, res) {

    // User illegal visit
    if (req.session.userId !== Number(req.param('userId'))) {
      return res.redirect('/');
    }

    // User status detection
    let userInfo = {
      isLogged: false,
      user: null
    };
    if (req.session.userId) {
      let userQry = await User.findOne({
        where: { userId: req.session.userId },
        select: ['userId', 'userName', 'userType', 'pwd']
      });
      if (userQry) {
        userInfo.user = JSON.parse(JSON.stringify(userQry));
        userInfo.isLogged = true;
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

    return res.view('user/user-setting', {
      userInfo
    });
  },

  /**
   * `UserController.alter()`
   */
  alter: async function (req, res) {
    let userId = Number(req.body.userId);

    // User illegal alter
    if (req.session.userId !== userId) {
      return res.json({
        success: false,
        errorType: 'illegal',
        info: '您无权修改他人用户信息'
      });
    }

    let newUserInfo = {
      userName: req.body.userName,
      pwd: req.body.pwd
    };
    newUserInfo = await User.update({ userId }, newUserInfo).fetch();
    if (newUserInfo) {
      return res.json({
        success: true
      });
    } else {
      return res.json({
        success: false,
        errorType: 'orm_error',
        info: '数据库出错，请重试'
      });
    }
  },

  /**
   * `UserController.delete()`
   */
  delete: async function (req, res) {
    let userId = Number(req.body.userId);

    // User illegal alter
    if (req.session.userId !== userId) {
      return res.json({
        success: false,
        errorType: 'illegal',
        info: '您无权修改他人用户信息'
      });
    }

    delete req.session.userId;
    await User.destroy({ userId });
    return res.json({
      success: true
    });
  }

};

