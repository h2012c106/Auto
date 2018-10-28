/**
 * News.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'news',

  primaryKey: 'newsId',

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    newsId: {
      type: 'string',
      allowNull: false,
      required: true
    },
    title: {
      type: 'string',
      allowNull: false,
      required: true
    },
    time: {
      type: 'string',
      columnType: 'datetime',
      allowNull: false,
      required: true
    },
    author: {
      type: 'string',
      allowNull: false,
      required: true
    },
    quotation: {
      type: 'text',
      allowNull: true
    },
    text: {
      type: 'text',
      allowNull: false,
      required: true
    },
    hasPic: {
      type: 'boolean',
      allowNull: false,
      defaultsTo: false
    },
    hasReview: {
      type: 'boolean',
      allowNull: false,
      defaultsTo: false
    }
  }

};

