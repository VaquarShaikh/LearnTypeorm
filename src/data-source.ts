import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "@Vaquar7113",
    "database": "testdb",
    "synchronize": true,
    "logging": true,
    "entities": ["src/entity/**/*.ts"],
    "migrations": ["src/migration/**/*.ts"],
    "subscribers": ["src/subscriber/**/*.ts"],
    // "cli": {
    //   "entitiesDir": "src/entity",
    //   "migrationsDir": "src/migration",
    //   "subscribersDir": "src/subscriber"
    // }
})
