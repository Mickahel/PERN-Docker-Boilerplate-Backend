const config = {
  base: {
    longTitle: "PERN Boilerplate",
    shortTitle: "PERNB",
    apiDocsLink: "/api-docs",
    contact: {
      name: "Michelangelo De Francesco",
      url: "https://www.linkedin.com/in/michelangelodefrancesco",
      email: "df.michelangelo@gmail.com",
    },
  },
  production: {
    databaseConfig: {
      options: {
        host: "localhost",
        dialect: "postgres",
        logging: (msg) => logger.silly(msg),
      }
    }
  },
  development: {
    databaseConfig: {
      options: {
        host: "192.168.99.100",
        dialect: "postgres",
        logging: false,
      }
    }
  },
};

function generateEnum(enumObject, namesFunction) {
  for (var key in enumObject) {
    if (enumObject.hasOwnProperty(key)) {
        this[key] = enumObject[key]
    }
  }
  //this.prototype.names = namesFunction(Object.freeze(enumObject)) // ? returns an array
}
generateEnum.prototype.names= function(){
  if(typeof Object.values(this)[0] ==="string") return Object.values(this)
  else if(typeof Object.values(this)[0] ==="object" && Object.values(this)[0].name) return Object.values(this).map((type)=>type.name)
  return
}

const roles = new generateEnum(
  {
    SUPERADMIN: { name: "SUPERADMIN", permissionLevel: 2 },
    ADMIN: { name: "ADMIN", permissionLevel: 1 },
    BASE: { name: "BASE", permissionLevel: 0 },
  }
)

const statuses = new generateEnum(
  {
    ACTIVE: "ACTIVE",
    PENDING: "PENDING",
    DISABLED: "DISABLED"
  }
)

module.exports = {
  config: {
    ...(process.env.NODE_ENV === 'production' ? config.production : config.development),
    ...config.base
  },
  roles,
  statuses
}; 
