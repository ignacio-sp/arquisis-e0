// require("dotenv").config();
module.exports = {
    development: {
        username: process.env.DATABASE_USER || 'default_user',
        password: process.env.DATABASE_PASSWORD || 'default_password',
        database: process.env.DATABASE_NAME || 'goatdb',
        host: process.env.DATABASE_HOST || 'db',
        dialect: 'postgres',
        logging: console.log,
      },
      test: {
        username: process.env.TEST_DATABASE_USER || 'test_user',
        password: process.env.TEST_DATABASE_PASSWORD || 'test_password',
        database: process.env.TEST_DATABASE_NAME || 'test_goatdb',
        host: process.env.TEST_DATABASE_HOST || 'localhost',
        dialect: 'postgres',
        logging: false, 
      },
      production: {
        username: process.env.DATABASE_USER || 'prod_user',
        password: process.env.DATABASE_PASSWORD || 'prod_password',
        database: process.env.DATABASE_NAME || 'prod_goatdb',
        host: process.env.DATABASE_HOST || 'db',
        dialect: 'postgres',
        logging: false, 
        dialectOptions: {
          ssl: {
            require: true, 
            rejectUnauthorized: false, 
          }
        },
      },
    };
