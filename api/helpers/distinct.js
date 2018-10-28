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
    let helpSet = new Set();

    return exits.success(inputs.arr.filter(function (item) {
      let val = item[inputs.key];
      if (helpSet.has(val)) {
        return false;
      } else {
        helpSet.add(val);
        return true;
      }
    }));

  }


};

