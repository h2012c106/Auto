/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': {
  //   view: 'homepage/index'
  // },
  'GET /user/setting': 'UserController.index',

  'GET /admin/setting/news-review': 'AdminController.newsReview',
  'GET /admin/setting/user': 'AdminController.user',

  'GET /': 'HomepageController.index',

  'GET /car': 'CarController.index',
  'GET /car/detail': 'CarController.carDetail',
  'GET /car/type/detail': 'CarController.typeDetail',
  
  'GET /news': 'NewsController.index',
  'GET /news/detail': 'NewsController.detail',
  'GET /news/publish': 'NewsController.publish',

  'GET /forum': 'ForumController.index',
  'GET /forum/detail': 'ForumController.detail',
  'GET /forum/publish': 'ForumController.publish',

  'POST /user/alter': 'UserController.alter',
  'POST /user/delete': 'UserController.delete',

  'POST /login': 'UserController.login',
  'POST /signup': 'UserController.signup',
  'POST /logout': 'UserController.logout',

  'POST /car-score': 'CarController.score',
  'POST /car-recom': 'CarController.recom',
  
  'POST /news-homepage': 'NewsController.newsHomepage',
  'POST /news-query': 'NewsController.newsQuery',
  'POST /news-publish': 'NewsController.newsPublish',
  
  'POST /forum-homepage': 'ForumController.forumHomepage',
  'POST /forum-query': 'ForumController.forumQuery',
  'POST /forum-publish': 'ForumController.forumPublish',
  'POST /forum-reply': 'ForumController.forumReply',
  
  'POST /admin/setting/news-pass': 'AdminController.newsPass',
  'POST /admin/setting/news-kill': 'AdminController.newsKill',
  'POST /admin/setting/user-alt': 'AdminController.userAlt',
  'POST /admin/setting/user-kill': 'AdminController.userKill',

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝



  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝


  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝


};
