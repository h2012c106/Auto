/**
 * CarController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const qsTextKeys = ['brandName', 'carClass', 'energy', 'drive', 'environStan', 'struct'];
const qsNumKeys = ['price', 'paiLiang_ml', 'maxTorque_nm', 'maxSpeed_kmh',
  '_0_100_s', 'youHao_lkm', 'wheelbase'];
const LIMIT = 4;
const RECOMRATE = {
  price: 0.1,
  wheelbase_mm: 1 / 25,
  default: 0.1
};

module.exports = {


  /**
   * `CarController.index()`
  */
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

    // Car Plateform
    let carQry = await Car.find({
      where: assemQry(req, qsTextKeys, qsNumKeys),
      select: ['carId', 'carName', 'subBrandName', 'brandName', 'picName']
    });
    carQry = await sails.helpers.distinct(carQry, 'carId');
    let carInfo = [];
    carQry.forEach(function (c) {
      let picUrl = `/images/autoPic/${c.picName}`;
      let carUrl = `/car/detail?carId=${c.carId}`;
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
  },


  /**
   * `CarController.carDetail()`
  */
  carDetail: async function (req, res) {

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

    let carId = req.param('carId');
    if (!carId) {
      return res.redirect('/car');
    } else {
      carId = Number(carId);
      let carInfo = await Car.find({
        where: { carId },
        limit: 1,
        select: ['brandName', 'carName']
      });
      if (carInfo.length === 0) {
        return res.redirect('/car');
      }
      carInfo = carInfo[0];
      let brandBroCarArr = await Car.find({
        where: {
          carId: { '!=': carId },
          brandName: carInfo.brandName
        },
        select: ['carId', 'carName', 'picName']
      });
      brandBroCarArr = await sails.helpers.distinct(brandBroCarArr, 'carId');
      brandBroCarArr.sort(function () {
        return Math.random() > 0.5 ? 1 : -1;
      });
      brandBroCarArr = brandBroCarArr.slice(0, LIMIT);
      brandBroCarArr = brandBroCarArr.map(function (c) {
        return {
          carUrl: `/car/detail?carId=${c.carId}`,
          picUrl: `/images/autoPic/${c.picName}`,
          carName: c.carName
        };
      });
      let typeArr = await Car.find({
        where: { carId },
        select: ['typeId', 'typeName', 'price']
      });
      typeArr.sort(function (x, y) { return x.price - y.price; })
      return res.view('car/car-detail', {
        userInfo,
        carSum,
        carInfo,
        brandBroCarArr,
        typeArr
      });
    }
  },


  /**
   * `CarController.typeDetail()`
  */
  typeDetail: async function (req, res) {

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

    let typeId = req.param('typeId');
    if (!typeId) {
      return res.redirect('/car');
    } else {
      typeId = Number(typeId);
      let typeInfo = await Car.findOne({
        where: { typeId }
      });
      if (!typeInfo) {
        return res.redirect('/car');
      }
      for (let key in typeInfo) {
        if (qsNumKeys.indexOf(key) !== -1 && typeInfo[key] < 0) {
          typeInfo[key] = '-';
        }
      }
      typeInfo.picUrl = `/images/autoPic/${typeInfo.picName}`;
      typeInfo.score = {};
      typeInfo.score.num = await UserCar.count({ typeId, carId: typeInfo.carId });
      if (typeInfo.score.num === 0) {
        typeInfo.score.score = 0;
      } else {
        typeInfo.score.score = await UserCar.avg('score', { typeId, carId: typeInfo.carId });
      }
      typeInfo.score.score = typeInfo.score.score.toFixed(1);

      let myScore = {
        hasScored: false,
        score: 0
      };
      if (userInfo.isLogged) {
        let score = await UserCar.findOne({
          where: { typeId, carId: typeInfo.carId, userId: userInfo.user.userId },
          select: ['score']
        });
        if (typeof score !== 'undefined') {
          myScore = {
            hasScored: true,
            score: score.score
          };
        }
      }
      myScore.scoreDisplay = myScore.score.toFixed(1);

      return res.view('car/type-detail', {
        userInfo,
        carSum,
        typeInfo,
        myScore
      });
    }
  },

  score: async function (req, res) {

    let userQry;
    // User status detection
    if (req.session.userId) {
      userQry = await User.findOne({
        where: { userId: req.session.userId },
        select: ['userId', 'userName']
      });
      if (!userQry) {
        return res.json({
          success: false,
          errorType: 'unauthorized',
          info: '评分请先登录'
        });
      }
    } else { // Visitor cant visit
      return res.json({
        success: false,
        errorType: 'unauthorized',
        info: '评分请先登录'
      });
    }

    let score = Number(req.body.score);
    let carId = Number(req.body.carId);
    let typeId = Number(req.body.typeId);

    let judge = await UserCar.count({ typeId, carId, userId: userQry.userId });
    if (judge === 0) {
      try {
        await UserCar.create({ typeId, carId, userId: userQry.userId, score });

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
    } else {
      try {
        await UserCar.update({ typeId, carId, userId: userQry.userId }, { score });

        return res.json({
          success: true,
        });
      } catch (err) {
        return res.json({
          success: false,
          errorType: 'orm',
          info: err.details ? err.details : err
        });
      }
    }
  },

  recom: async function (req, res) {

    let type = req.body.type;
    let carId = req.body.carId;
    let price = req.body.price;
    let wheelbase_mm = req.body.wheelbase_mm;

    if (isUndefined(type) || isUndefined(carId) || isUndefined(price) || isUndefined(wheelbase_mm)) {
      return res.json({
        success: false,
        errorType: 'data',
        info: '数据错误'
      });
    }

    carId = Number(carId);
    let where = {
      price: assemQryInterval('price', price),
      wheelbase_mm: assemQryInterval('wheelbase_mm', wheelbase_mm),
      carId: { '!=': carId }
    };

    let carQry = [];
    let catcher = makeWheres(where, req, type);
    if (catcher.pass) {
      for (let i = 0; i < catcher.res.length; ++i) {
        let tmpWhere = catcher.res[i];
        let tmpQry = await Car.find({
          where: tmpWhere,
          select: ['carId', 'carName', 'picName']
        });
        carQry = carQry.concat(tmpQry);
      }
    }
    carQry = await sails.helpers.distinct(carQry, 'carId');
    carQry.sort(function () {
      return Math.random() > 0.5 ? 1 : -1;
    });
    carQry = carQry.slice(0, LIMIT);
    carQry = carQry.map(function (c) {
      return {
        carUrl: `/car/detail?carId=${c.carId}`,
        picUrl: `/images/autoPic/${c.picName}`,
        carName: c.carName
      };
    });

    return res.json({
      carArr: carQry
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

function getInterval(key) {
  return isUndefined(RECOMRATE[key]) ? RECOMRATE.default : RECOMRATE[key];
}

function assemQryInterval(key, val) {
  let interval = getInterval(key);
  val = Number(val);
  return {
    '>=': Math.max(val * (1 - interval), 0),
    '<=': Math.max(val * (1 + interval), 0)
  };
}

function judgeText(val) {
  if (isUndefined(val) || val === '-') {
    return false;
  } else {
    return true;
  }
}

function isNum(str) {
  var regPos = /^\d+(\.\d+)?$/;
  if (regPos.test(str)) {
    return true;
  } else {
    return false;
  }
}

function judgeNum(val) {
  if (isUndefined(val) || !isNum(String(val))) {
    return false;
  } else {
    return true;
  }
}

function makeWheres(where, req, type) {
  let res = [];
  let pass = false;
  if (type === 'shape') {
    let tmp = JSON.parse(JSON.stringify(where));
    if (judgeText(req.body.carClass)) {
      pass = true;
      tmp.carClass = req.body.carClass;
    }
    if (judgeText(req.body.struct)) {
      pass = true;
      tmp.struct = req.body.struct;
    }
    res.push(tmp);
  } else if (type === 'power') {
    let tmp = JSON.parse(JSON.stringify(where));
    if (judgeNum(req.body.paiLiang_ml)) {
      pass = true;
      tmp.paiLiang_ml = assemQryInterval('paiLiang_ml', req.body.paiLiang_ml);
    }
    res.push(tmp);
  } else if (type === 'acce') {
    if (judgeNum(req.body.maxTorque_nm)) {
      let tmp = JSON.parse(JSON.stringify(where));
      pass = true;
      tmp.maxTorque_nm = assemQryInterval('maxTorque_nm', req.body.maxTorque_nm);
      res.push(tmp);
    }
    if (judgeNum(req.body._0_100_s)) {
      let tmp = JSON.parse(JSON.stringify(where));
      pass = true;
      tmp._0_100_s = assemQryInterval('_0_100_s', req.body._0_100_s);
      res.push(tmp);
    }
  } else if (type === 'drive') {
    let tmp = JSON.parse(JSON.stringify(where));
    if (judgeText(req.body.drive)) {
      pass = true;
      tmp.drive = req.body.drive;
    }
    res.push(tmp);
  } else if (type === 'energy') {
    let tmp = JSON.parse(JSON.stringify(where));
    if (judgeText(req.body.energy)) {
      pass = true;
      tmp.energy = req.body.energy;
      let pbss = false;
      if (judgeNum(req.body.youHao_lkm)) {
        pbss = true;
        let ttmp = JSON.parse(JSON.stringify(tmp));
        tmp.youHao_lkm = assemQryInterval('youHao_lkm', req.body.youHao_lkm);
        res.push(ttmp);
      }
      if (judgeText(req.body.environStan)) {
        pbss = true;
        let ttmp = JSON.parse(JSON.stringify(tmp));
        tmp.environStan = req.body.environStan;
        res.push(ttmp);
      }
      if (!pbss) {
        res.push(tmp);
      }
    }
  }
  return {
    pass,
    res
  };
}