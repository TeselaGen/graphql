var Chance = require('chance');
var chance = new Chance()
const Sequelize = require("sequelize");
var faker = require('faker');

module.exports = function(sequelize) {
  const AccessLog = sequelize.define(
    "AccessLog", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    }, {
      timestamps: false
    }
  );

  const User = sequelize.define(
    "User", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
      },
      dbId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        get: function() {
          return this.getDataValue('id') 
        },
      },
      email: {
        type: Sequelize.STRING,
        faker: faker.internet.email,
        allowNull: true,
        unique: false,
      },
      password: {
        type: Sequelize.STRING,
        faker: faker.internet.password,
        allowNull: true,
      },
      firstName: {
        type: Sequelize.STRING,
        faker: faker.name.firstName,
        allowNull: true
      },
      lastName: {
        type: Sequelize.STRING,
        faker: faker.name.lastName,
        allowNull: true
      }
    }, {
      timestamps: false
    }
  );

  const Material = sequelize.define(
    "Material", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
        faker: function () {
          return chance.pickone(['DNA', 'microbialStrain'])
        },
        validate: {
          isIn: [
            ["DNA", "microbialStrain"]
          ]
        }
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        faker: function () {
          return chance.pickone(['registered', 'target'])
        },
        validate: {
          isIn: [
            ["registered", "target"]
          ]
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
        faker: faker.name.lastName,

      },
      sourceSystem: {
        type: Sequelize.STRING,
        faker: function () {
          return chance.pickone(['RCC', 'NCBI', 'JBEI'])
        },
        allowNull: true
      },
      sourceSystemId: {
        type: Sequelize.STRING,
        faker: function () {
          return chance.string()
        },
        allowNull: true
      }
    }, {
      timestamps: false
    }
  );

  const Sequence = sequelize.define(
    "Sequence", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
        faker: function () {
          return chance.pickone(['DNA', 'RNA'])
        },
        validate: {
          isIn: [
            ["DNA", "RNA"]
          ]
        }
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        faker: function () {
          return chance.pickone(['registered', 'target'])
        },
        validate: {
          isIn: [
            ["registered", "target"]
          ]
        }
      },
      bps: {
        faker: function () {
          return chance.string({pool: 'atgc', length: 100})
        },
        type: Sequelize.TEXT,
        allowNull: true
      },
    }, {
      timestamps: false
    }
  );

  // const Todo = sequelize.define(
  //   "Todo", {
  //     id: {
  //       type: Sequelize.INTEGER,
  //       autoIncrement: true,
  //       primaryKey: true,
  //       allowNull: true
  //     },
  //     text: {
  //       type: Sequelize.STRING,
  //       allowNull: true
  //     },
  //     completed: {
  //       type: Sequelize.BOOLEAN,
  //       allowNull: true
  //     }
  //   }, {
  //     timestamps: false
  //   }
  // );

  // const TodoAssignee = sequelize.define(
  //   "TodoAssignee", {
  //     primary: {
  //       type: Sequelize.BOOLEAN
  //     }
  //   }, {
  //     timestamps: false
  //   }
  // );



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

  // //////vvvvvvvvvv
  // User.hasMany(Material, {
  //   as: "materialsIMade",
  //   foreignKey: "addedBy"
  // });

  // Material.belongsTo(User, {
  //   as: "who_added",
  //   foreignKey: "addedBy"
  // });
  // //////^^^^^^^^^^

  //////vvvvvvvvvv
  // User.hasMany(Todo, {
  //   as: "todos",
  //   foreignKey: "userId"
  // });
  // Todo.belongsTo(User, {
  //   as: "user",
  //   foreignKey: "userId"
  // });
  // //////^^^^^^^^^^

  // // belongsToMany
  // User.belongsToMany(Todo, {
  //   as: "assignedTodos",
  //   through: TodoAssignee
  // });
  // Todo.belongsToMany(User, {
  //   as: "assignees",
  //   through: TodoAssignee
  // });


  var models = {
    // Todo: Todo,
    User: User,
    Material: Material,
    Sequence: Sequence,
    AccessLog: AccessLog,
  };


  return models
}