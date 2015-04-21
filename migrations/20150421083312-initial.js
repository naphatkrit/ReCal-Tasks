'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    var tasks = queryInterface.createTable("Tasks", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM,
            values: ["complete", "incomplete"],
            allowNull: false,
            defaultValue: "incomplete"
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        TaskInfoId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: "TaskInfo",
        }
    }, {})
    var taskInfo = queryInterface.createTable("TaskInfo", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        PreviousVersionId: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: "TaskInfo",
        }
    })
    return Sequelize.Promise.all([tasks, taskInfo]);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    var task = queryInterface.dropTable("Tasks");
    var taskInfo = queryInterface.dropTable("TaskInfo");
    return Sequelize.Promise.all([task, taskInfo]);
  }
};
