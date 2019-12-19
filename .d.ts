declare module "redis" {

    export interface RedisClient extends NodeJS.EventEmitter {
        setAsync(key:string, value:string): Promise<void>;
        getAsync(key:string): Promise<string>;
    }

}