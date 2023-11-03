// deno-lint-ignore-file no-unused-vars
import express, {Response,Request} from "npm:express@4.18.2";
import { addmonumento } from "../resolvers/post.ts";
import { getall, getbase, getone} from "../resolvers/gets.ts";
import { update } from "../resolvers/puts.ts";
import { delone } from "../resolvers/deletes.ts";
//import { bloqueo, envio, masdinero, transpaso, venta } from "../resolvers/puts.ts";
//import { delc, deletes } from "../resolvers/deletes.ts";


const app = express();
app.use(express.json())


app.get("/",getbase)
.get("/api/monumentos",getall)
.get("/api/monumentos/:id",getone)
.delete("/api/monumentos/:id?",delone)
.post("/api/monumentos",addmonumento)
.put("/api/monumentos/:id?",update)




app.listen(8000, () => {
  console.log("Server is running on port 8000\n");
});


