/**
 * ForumController
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

    // Forum selector
    let carQry = await Tag.find({
      where: { tagType: 'car' },
      select: ['tagId', 'tagName']
    });

    let geoQry = await Tag.find({
      where: { tagType: 'geo' },
      select: ['tagId', 'tagName'],
      sort: 'tagName ASC',
    });

    let topicQry = await Tag.find({
      where: { tagType: 'topic' },
      select: ['tagId', 'tagName'],
      sort: 'tagName ASC',
    });

    let tagSelectorInfo = {
      car: carQry,
      geo: geoQry,
      topic: topicQry
    };

    return res.view('forum/index', {
      userInfo,
      carSum,
      tagSelectorInfo,
      curTagId: Number(req.param('tagId'))
    });
  },

  forumHomepage: async function (req, res) {
    let forumQry = await Forum.find({
      limit: Number(req.body.limit),
      sort: 'time DESC',
      select: ['postId', 'title', 'time', 'author', 'text']
    });

    let forumArr = [];
    for (let i = 0; i < forumQry.length; ++i) {
      let f = forumQry[i];
      let reply = await UserForum.count({ postId: f.postId });
      reply -= 1;
      let tagArr = await TagForum.find({
        where: { postId: f.postId },
        select: ['tagId']
      });
      tagArr = tagArr.map(function (item) {
        return item.tagId;
      });
      tagArr = await Tag.find({
        where: { tagId: tagArr },
        select: ['tagId', 'tagName']
      });
      forumArr.push({
        postUrl: `/forum/detail?postId=${f.postId}`,
        title: f.title,
        time: f.time.toLocaleString(),
        author: f.author,
        text: f.text,
        reply,
        tagArr
      });
    }

    return res.json({
      forumArr
    });
  },

  forumQuery: async function (req, res) {
    let tagId = req.body.tagId;
    let searchKey = req.body.searchKey;
    let where = {};

    if (typeof tagId !== 'undefined') {
      let postIdArr = await TagForum.find({
        where: { tagId: Number(tagId) },
        select: ['postId']
      });
      postIdArr = postIdArr.map(function (item) {
        return item.postId;
      });
      if (postIdArr.length > 0) {
        where.postId = postIdArr;
      } else {
        return res.json({
          forumArr: []
        });
      }
    }

    let forumQry = [];
    if (typeof searchKey !== 'undefined' && parseSearchKey(searchKey).length !== 0) {
      searchKey = parseSearchKey(searchKey);
      for (let i = 0; i < searchKey.length; ++i) {
        let key = searchKey[i];
        let titleWhere = JSON.parse(JSON.stringify(where));
        titleWhere.title = { like: `%${key}%` };
        let titleArr = await Forum.find({
          where: titleWhere,
          select: ['postId', 'title', 'time', 'author', 'text']
        });
        let textWhere = JSON.parse(JSON.stringify(where));
        textWhere.text = { like: `%${key}%` };
        let textArr = await Forum.find({
          where: textWhere,
          select: ['postId', 'title', 'time', 'author', 'text']
        });
        forumQry = forumQry.concat(titleArr);
        forumQry = forumQry.concat(textArr);
      }
      forumQry = await sails.helpers.distinct(forumQry, 'postId');
    } else {
      forumQry = await Forum.find({
        where,
        sort: 'time DESC',
        select: ['postId', 'title', 'time', 'author', 'text']
      });
    }

    let forumArr = [];
    for (let i = 0; i < forumQry.length; ++i) {
      let f = forumQry[i];
      let reply = await UserForum.count({ postId: f.postId });
      reply -= 1;
      let tagArr = await TagForum.find({
        where: { postId: f.postId },
        select: ['tagId']
      });
      tagArr = tagArr.map(function (item) {
        return item.tagId;
      });
      tagArr = await Tag.find({
        where: { tagId: tagArr },
        select: ['tagId', 'tagName']
      });
      forumArr.push({
        postUrl: `/forum/detail?postId=${f.postId}`,
        title: f.title,
        time: f.time.toLocaleString(),
        author: f.author,
        text: f.text,
        reply,
        tagArr
      });
    }

    return res.json({
      forumArr
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

    // Forum selector
    let carQry = await Tag.find({
      where: { tagType: 'car' },
      select: ['tagId', 'tagName']
    });

    let geoQry = await Tag.find({
      where: { tagType: 'geo' },
      select: ['tagId', 'tagName'],
      sort: 'tagName ASC',
    });

    let topicQry = await Tag.find({
      where: { tagType: 'topic' },
      select: ['tagId', 'tagName'],
      sort: 'tagName ASC',
    });

    let tagSelectorInfo = {
      car: carQry,
      geo: geoQry,
      topic: topicQry
    };

    return res.view('forum/publish', {
      userInfo,
      tagSelectorInfo,
      curTagId: Number(req.param('tagId'))
    });
  },

  forumPublish: async function (req, res) {

    let userQry;
    // User status detection
    if (req.session.userId) {
      userQry = await User.findOne({
        where: { userId: req.session.userId },
        select: ['userType', 'userName']
      });
      if (!userQry) {
        return res.json({
          success: false,
          errorType: 'unauthorized',
          info: '发帖请先登录'
        });
      }
    } else { // Visitor cant visit
      return res.json({
        success: false,
        errorType: 'unauthorized',
        info: '发帖请先登录'
      });
    }

    if (!req.body.tagArr || req.body.tagArr.length === 0) {
      return res.json({
        success: false,
        errorType: 'misstag',
        info: '请至少选择一个标签'
      });
    }
    let title = req.body.title;
    let text = req.body.text.replace(/\r/g, '').split('\n').filter(function (item) { return item.replace(/\s+/g, '').length !== 0; }).map(function (item) { return `<p>${item}</p>`; }).join('');
    let tagArr = req.body.tagArr.map(function (item) { return Number(item); });
    let time = new Date().toLocaleString();
    let author = userQry.userName;

    try {
      let postId = await Forum.create({
        title,
        text,
        time,
        author
      }).fetch();
      postId = postId.postId;

      await UserForum.create({
        userId: req.session.userId,
        postId,
        reply: text,
        time
      });

      for (let i = 0; i < tagArr.length; ++i) {
        let tagId = tagArr[i];
        await TagForum.create({
          postId,
          tagId
        });
      }

      return res.json({
        success: true,
        info: { postId }
      });
    } catch (err) {
      return res.json({
        success: false,
        errorType: 'orm',
        info: err.details ? err.details : err
      });
    }
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

    // Get title
    let postId = req.param('postId');
    let title;
    if (!postId) {
      return res.redirect('/forum');
    } else {
      postId = Number(postId);
      title = await Forum.findOne({
        where: { postId },
        select: ['title']
      });
      if (!title) {
        return res.redirect('/forum');
      } else {
        title = title.title;
      }
    }

    let replyArr = await UserForum.find({
      where: { postId },
      sort: 'time ASC',
      select: ['userId', 'reply', 'time']
    });

    let tmpArr = [];
    for (let i = 0; i < replyArr.length; ++i) {
      let reply = replyArr[i];
      let userInfo = await User.findOne({
        where: { userId: reply.userId },
        select: ['userName', 'userType']
      });
      if (!userInfo) {
        userInfo = {
          userName: '已注销',
          userType: '已注销'
        };
      } else {
        switch (userInfo.userType) {
          case 'norm':
            userInfo.userType = '普通用户';
            break;
          case 'media':
            userInfo.userType = '媒体';
            break;
          case 'sup':
            userInfo.userType = '管理员';
            break;
        }
      }
      tmpArr.push({
        floor: i + 1,
        userInfo,
        reply: reply.reply,
        time: reply.time.toLocaleString()
      });
    }

    return res.view('forum/detail', {
      userInfo,
      carSum,
      replyArr: tmpArr,
      title
    });
  },

  forumReply: async function (req, res) {

    let userQry;
    // User status detection
    if (req.session.userId) {
      userQry = await User.findOne({
        where: { userId: req.session.userId },
        select: ['userType', 'userName']
      });
      if (!userQry) {
        return res.json({
          success: false,
          errorType: 'unauthorized',
          info: '回复请先登录'
        });
      }
    } else { // Visitor cant visit
      return res.json({
        success: false,
        errorType: 'unauthorized',
        info: '回复请先登录'
      });
    }

    let postId = Number(req.body.postId);
    let userId = req.session.userId;
    let reply = req.body.reply.replace(/\r/g, '').split('\n').filter(function (item) { return item.replace(/\s+/g, '').length !== 0; }).map(function (item) { return `<p>${item}</p>`; }).join('');
    let time = new Date().toLocaleString();

    try {
      await Forum.update({ postId }, { time });

      await UserForum.create({
        userId,
        postId,
        reply,
        time
      });

      return res.json({
        success: true,
        info: { postId }
      });
    } catch (err) {
      return res.json({
        success: false,
        errorType: 'orm',
        info: err.details ? err.details : err
      });
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