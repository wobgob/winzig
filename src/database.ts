import { Model, InferAttributes, InferCreationAttributes, DataTypes, Sequelize, CreationOptional } from "sequelize"

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>
    declare userId: string
    declare accountId: number
}

export class Account extends Model<InferAttributes<Account>, InferCreationAttributes<Account>> {
    declare id: CreationOptional<number>
    declare username: string
    declare salt: Buffer
    declare verifier: Buffer
}

export type Database = { sequelize: Sequelize, account: typeof Account, user: typeof User }

export default (uri: string): Database => {
    const sequelize = new Sequelize(uri)

    return {
        sequelize: sequelize,
        user: User.init({
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
        }),
        account: Account.init({
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
    }
}