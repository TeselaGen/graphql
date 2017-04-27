var Sequelize = require('sequelize');
module.export (models) => {
  
  const {User,Material,Sequence} = models;

  Material.hasMany(Sequence, {
    as: "sequence_material",
    foreignKey: "sequence_material"
  });

  Sequence.belongsTo(Material, {
    as: "material",
    foreignKey: "materialId"
  });



  User.hasMany(Sequence, {
    as: "sequences",
    foreignKey: "ownerId"
  });

  Sequence.belongsTo(User, {
    as: "user",
    foreignKey: "ownerId"
  });



  User.hasMany(Material, {
    as: "materials",
    foreignKey: "ownerId"
  });

  Material.belongsTo(User, {
    as: "user",
    foreignKey: "ownerId"
  });
}