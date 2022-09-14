import { Model, InferAttributes, InferCreationAttributes, DataTypes, Sequelize } from "sequelize"

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: number
    declare userId: string
    declare accountId: number
}

class Account extends Model<InferAttributes<Account>, InferCreationAttributes<Account>> {
    declare id: number
    declare username: string
    declare salt: Buffer
    declare verifier: Buffer
}

export default (uri: string) => {
    const sequelize = new Sequelize(uri)

    User.init({
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        accountId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: 'account',
                key: 'id'
            }
        }
    }, {
        sequelize,
        tableName: 'user',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            },
            {
                name: "accountId",
                using: "BTREE",
                fields: [
                    { name: "accountId" },
                ]
            },
        ]
    })

    Account.init({
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            comment: "Identifier"
        },
        username: {
            type: DataTypes.STRING(32),
            allowNull: false,
            defaultValue: "",
            unique: "idx_username"
        },
        salt: {
            type: DataTypes.BLOB,
            allowNull: false
        },
        verifier: {
            type: DataTypes.BLOB,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'account',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "id" },
                ]
            },
            {
                name: "idx_username",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "username" },
                ]
            },
        ]
    })

    await sequelize.sync()
}