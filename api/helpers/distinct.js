module.exports = {


  friendlyName: 'Distinct',


  description: 'Distinct an array.',


  inputs: {
    arr: {
      type: 'ref',
      description: 'The arr to be distincted.',
      required: true
    }, key: {
      type: 'string',
      description: 'The key distincted by.',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    let key = inputs.key;
    let helpMap = {};
    inputs.arr.forEach(function (a, i) {
      let val = a[key];
      if (helpMap.hasOwnProperty(val)) {
        helpMap[val].push(i);
      } else {
        helpMap[val] = [i];
      }
    });
    let keys = Object.keys(helpMap);
    keys.sort(function (a, b) {
      return helpMap[b].length - helpMap[a].length;
    });
    let resArr = keys.map(function (k) {
      return inputs.arr[helpMap[k][0]];
    });

    return exits.success(resArr);
  }


};

