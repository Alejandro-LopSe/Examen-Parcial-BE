// deno-lint-ignore-file
// deno-lint-ignore-file no-var
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { MongoClient, Database } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import {Monumento} from "./types.ts"

const env = await load();
const url = env["MONGO_URL"]
const db_name = env["DB_NAME"]



const connectMongoDB = async (): Promise<Database> => {


  try{

    const mongo_url = url

    const client = new MongoClient();
    await client.connect(mongo_url);

    const db = client.database(db_name);

    return db;

  }catch(error){
    
    console.log(error)
    return error
  }
  
};

const db = await connectMongoDB();
console.info(`MongoDB ${db.name} connected`);

export const monumentoscolleccion = db.collection<Monumento>("Monumentos")




