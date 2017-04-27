var each = require("lodash/each");

function generateFakeRecord(model) {
  var fakeRecord = {};
  each(model.attributes, function(attribute) {
    if (attribute.faker) {
      fakeRecord[attribute.fieldName] = attribute.faker();
    }
  });
  return fakeRecord;
}

module.exports = function(sequelize, models) {
  return Promise.resolve().then(function () {
    each(models, function(model) {
      each(model.associations, function(association) {
        // if (association.associationType === "HasMany") {
          var fakeRecord = generateFakeRecord(model);
          fakeRecord[association.as] = [generateFakeRecord(association.target)];
          model.create(fakeRecord, {
            include: [
              {
                model: association.target,
                as: association.as
              }
            ]
          });
        // }
      });
      

      model.create(generateFakeRecord(model));
    });
  })
};