function generateFakeRecord(model) {
  var fakeRecord = {};
  each(model.attributes, function(attribute) {
    if (attribute.faker) {
      fakeRecord[attribute.fieldName] = attribute.faker();
    }
    if (attribute.fieldName === 'createdAt' || attribute.fieldName === 'updatedAt') {
      fakeRecord[attribute.fieldName] = new Date(Date.now())
    }
  });
  return fakeRecord;
}

const sequelize_fixtures = require("sequelize-fixtures");
var each = require("lodash/each");
module.exports = function(sequelize, models) {
  return Promise.resolve().then(function () {
    each(models, function(model) {
      var includeArray = []
      var fakeRecord = generateFakeRecord(model);

      each(model.associations, function(association) {
        // if (association.associationType === "HasMany") {
          fakeRecord[association.as] = [generateFakeRecord(association.target)];
          includeArray.push({
                model: association.target,
                as: association.as
              })
        // }
      });
      model.create(fakeRecord, {
        include: includeArray
      });
      

      // model.create(generateFakeRecord(model));
    });
  })
  // Object.keys(models).forEach(function (key) {
  //    var model = models[key]
  //    Object.keys(model.attributes).forEach(function (key) {
  //       var attribute = attributes[key]

  //    })
  // })
  // var fixtures = [{
  //   model: "User",
  //   data: {
  //     email: "tom@gmail.com",
  //     password: "asagag",
  //     firstName: "tom",
  //     lastName: "rich"
  //   }
  // }, {
  //   model: "User",
  //   data: {
  //     email: "sam@gmail.com",
  //     password: "asagag",
  //     firstName: "sam",
  //     lastName: "d"
  //   }
  // }];

  // for (var i = 1; i < 10; i++) {
  //   fixtures.push({
  //     model: "Material",
  //     data: {
  //       type: "DNA",
  //       status: "registered",
  //       sourceSystem: "agahaha" + i,
  //       sourceSystemId: "agahaha",
  //       ownerId: 1,
  //       addedBy: 2,
  //       name: "material_" + i,
  //       dateCreated: "monday the 4th",
  //       lastEdited: "tuesday the 9th"
  //     }
  //   });
  // }

  // var bps = "";

  // for (var i = 0; i < 10; i++) {
  //   bps += "acagagat";
  // }

  // for (var i = 1; i < 10; i++) {
  //   fixtures.push({
  //     model: "Sequence",
  //     data: {
  //       type: "DNA",
  //       status: "registered",
  //       sourceSystem: "agahaha" + i,
  //       sourceSystemId: "agahaha",
  //       ownerId: 1,
  //       bps: bps,
  //       materialId: i % 5 + 1
  //     }
  //   });
  // }

  // return sequelize_fixtures.loadFixtures(fixtures, models).then(function() {
  //   console.log("fixtures loaded");
  //   // doStuffAfterLoad();
  // });
};