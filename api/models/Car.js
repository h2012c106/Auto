/**
 * Car.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'car',

  primaryKey: 'typeId',

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

    brandName: {
      type: 'string',
      allowNull: false,
      required: true
    },
    subBrandName: {
      type: 'string',
      allowNull: false,
      required: true
    },
    carId: {
      type: 'number',
      allowNull: false,
      required: true
    },
    carName: {
      type: 'string',
      allowNull: false,
      required: true
    },
    carClass: {
      type: 'string',
      allowNull: false,
      required: true
    },
    typeId: {
      type: 'number',
      allowNull: false,
      required: true
    },
    typeName: {
      type: 'string',
      allowNull: false,
      required: true
    },
    price: {
      type: 'number',
      allowNull: false,
      required: true
    },
    energy: {
      type: 'string',
      allowNull: false,
      required: true
    },
    marketTime: {
      type: 'string',
      allowNull: false,
      required: true
    },
    drive: {
      type: 'string',
      allowNull: false,
      required: true
    },
    environStan: {
      type: 'string',
      allowNull: false,
      required: true
    },
    engineName: {
      type: 'string',
      allowNull: false,
      required: true
    },
    paiLiang_ml: {
      type: 'number',
      allowNull: false,
      required: true
    },
    maxTorque_nm: {
      type: 'number',
      allowNull: false,
      required: true
    },
    gearbox: {
      type: 'string',
      allowNull: false,
      required: true
    },
    struct: {
      type: 'string',
      allowNull: false,
      required: true
    },
    maxSpeed_kmh: {
      type: 'number',
      allowNull: false,
      required: true
    },
    _0_100_s: {
      type: 'number',
      allowNull: false,
      required: true
    },
    youHao_lkm: {
      type: 'number',
      allowNull: false,
      required: true
    },
    len_mm: {
      type: 'number',
      allowNull: false,
      required: true
    },
    wid_mm: {
      type: 'number',
      allowNull: false,
      required: true
    },
    hei_mm: {
      type: 'number',
      allowNull: false,
      required: true
    },
    wheelbase_mm: {
      type: 'number',
      allowNull: false,
      required: true
    },
    picName: {
      type: 'string',
      defaultsTo: 'default.jpg'
    }
  }

};

