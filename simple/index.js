
const sequelize_fixtures = require("sequelize-fixtures");
const {
  getSchema
} = require("graphql-sequelize-crud");
const Sequelize = require("sequelize");
const express = require("express");
const graphqlHTTP = require("express-graphql");

const app = express();
const sequelize = new Sequelize(
  "postgres://graphql_sequelize_test:graphql_sequelize_test@localhost:5432/graphql_sequelize_test"
);
// const sequelize = new Sequelize('database', 'username', 'password', {
//   // sqlite! now!
//   dialect: 'sqlite',

//   // the storage engine for sqlite
//   // - default ':memory:'
//   // storage: 'path/to/database.sqlite'

//   // disable logging; default: console.log
//   // logging: false

// });

const User = sequelize.define(
  "User", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    timestamps: true
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
      allowNull: false,
      validate: {
        isIn: [
          ["DNA", "microbialStrain"]
        ]
      }
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [
          ["registered", "target"]
        ]
      }
    },
    sourceSystem: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sourceSystemId: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    timestamps: true
  }
);

const Todo = sequelize.define(
  "Todo", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false
    },
    completed: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  }, {
    timestamps: true
  }
);

const TodoAssignee = sequelize.define(
  "TodoAssignee", {
    primary: {
      type: Sequelize.BOOLEAN
    }
  }, {
    timestamps: true
  }
);

User.hasMany(Material, {
  as: "materials",
  foreignKey: "ownerId"
});

Material.belongsTo(User, {
  as: "user",
  foreignKey: "ownerId"
});

User.hasMany(Todo, {
  as: "todos",
  foreignKey: "userId"
});
Todo.belongsTo(User, {
  as: "user",
  foreignKey: "userId"
});

// belongsToMany
User.belongsToMany(Todo, {
  as: "assignedTodos",
  through: TodoAssignee
});
Todo.belongsToMany(User, {
  as: "assignees",
  through: TodoAssignee
});

sequelize
  .drop()
  .then(function() {
    return sequelize.sync({
        force: true
      })
      .then(() => {
        const schema = getSchema(sequelize);

        var models = {
          User: User,
          Material: Material,
        };

        var fixtures = [{
            model: "User",
            data: {
              id: 12,
              email: 'asagag',
              password: 'asagag',
              firstName: 'tom',
              lastName: 'rich'
            }
          }

        ];

        for (var i = 0; i < 100; i++) {
          fixtures.push({
            model: "Material",
            data: {
              type: 'DNA',
              status: 'registered',
              sourceSystem: 'agahaha' + i,
              sourceSystemId: 'agahaha',
              ownerId: 12,
            }
          })
        }

        sequelize_fixtures.loadFixtures(fixtures, models).then(function() {
          console.log('fixtures loaded')
            // doStuffAfterLoad();
        });

        app.use(
          "/graphql",
          graphqlHTTP({
            schema: schema,
            graphiql: true
          })
        );

        const port = 3001;
        app.listen(port, () => {
          console.log(`Listening on port ${port}`);
        });
      });

  })