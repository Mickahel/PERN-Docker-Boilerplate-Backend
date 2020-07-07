const  DataTypes = require('sequelize');

function createDataModel (sequelize){
    const Model = sequelize.define("model", {
        title: {
            type: DataTypes.STRING,
            unique:true
        },
        description: {
            type: DataTypes.STRING,
        }
    })

    /*Model.associate = (models) =>{
        Model.belongsToMany(models.Team, {
            through: 'member',
            foreignKey: "userId"
        })
    }*/
    
    return Model
}

module.exports = createDataModel