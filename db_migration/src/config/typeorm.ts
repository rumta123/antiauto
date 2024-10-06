import { registerAs } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";

console.log(__dirname + "/../migrations/*{.ts,.js}")
const config = {
    type: 'postgres',
    host: `${process.env.DATABASE_HOST}`,
    port: `${process.env.DATABASE_PORT}`,
    username: `${process.env.DATABASE_USER}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    entities: [
        __dirname + "/../**/options_dict.entity.ts",
        __dirname + "/../**/options.entity.ts",
        __dirname + "/../**/specifications_dict.entity.ts",
        __dirname + "/../**/specifications.entity.ts",
        __dirname + "/../**/modification.entity.ts",
        __dirname + "/../**/configurations_photo.entity.ts",
        __dirname + "/../**/configuration.entity.ts",
        __dirname + "/../**/generation.entity.ts",
        __dirname + "/../**/model.entity.ts",
        __dirname + "/../**/mark.entity.ts",
        __dirname + "/../**/marklogo.entity.ts",
    ],
    migrations: [__dirname + "/../migrations/*{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: false,
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);