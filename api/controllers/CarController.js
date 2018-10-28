/**
 * CarController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  /**
   * `CarController.index()`
  */
  index: async function (req, res) {
    const qsTextKeys = ['brandName', 'carClass', 'energy', 'drive', 'environStan', 'struct'];
    const qsNumKeys = ['price', 'paiLiang_ml', 'maxTorque_nm', 'maxSpeed_kmh',
      '_0_100_s', 'youHao_lkm', 'wheelbase'];

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

    // Car Plateform
    let carQry = await Car.find({
      where: assemQry(req, qsTextKeys, qsNumKeys),
      select: ['carId', 'carName', 'subBrandName', 'brandName', 'picName']
    });
    carQry = await sails.helpers.distinct(carQry, 'carId');
    let carInfo = [];
    carQry.forEach(function (c) {
      let picUrl = `/images/autoPic/${c.picName}`;
      let carUrl = c.carId;
      carInfo.push({
        carUrl,
        carName: c.carName,
        subBrandName: c.subBrandName,
        // brandName: c.brandName,
        picUrl
      });
    });
    carInfo = carInfo.sort(function (x, y) {
      if (x.subBrandName === y.subBrandName) {
        return x.carName < y.carName ? -1 : 1;
      } else {
        return x.subBrandName < y.subBrandName ? -1 : 1;
      }
    });

    return res.view('car/index', {
      userInfo,
      carInfo,
      carSum
    });
  }

};

function assemQry(req, qsTextKeys, qsNumKeys) {
  let qry = {};
  qsTextKeys.forEach(function (key) {
    if (!isUndefined(req.param(key))) {
      qry[key] = req.param(key);
    }
  });
  qsNumKeys.forEach(function (key) {
    let key_0 = `${key}_0`;
    let key_1 = `${key}_1`;
    if (!isUndefined(req.param(key_0)) && !isUndefined(req.param(key_1))) {
      num_l = Math.min(Number(req.param(key_0)), Number(req.param(key_1)));
      num_r = Math.max(Number(req.param(key_0)), Number(req.param(key_1)));
      qry[key] = {
        '>=': num_l,
        '<=': num_r
      };
    } else if (!isUndefined(req.param(key_0))) {
      qry[key] = {
        '>=': Number(req.param(key_0))
      };
    } else if (!isUndefined(req.param(key_1))) {
      qry[key] = {
        '<=': Number(req.param(key_1)),
        '>=': 0
      };
    }
  });
  return qry;
}

function isUndefined(obj) {
  if (typeof obj === 'undefined') {
    return true;
  } else {
    return false;
  }
}