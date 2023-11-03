import { Request, Response } from "npm:express@4.18.2";
 
import { Error} from "../mongo/types.ts";
import { monumentoscolleccion} from "../mongo/mongodb.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";





export const delone = async ( req:Request , res: Response)=>{

    try {
        
        const id = req.params.id

        if(!id ){
            const error: Error= {
                code: "Faltan_datos",
                message: "id(string) no se ha definido. "
            }
            res.status(500).send(error)
            throw error;
        }
        const exist = await monumentoscolleccion.findOne({_id: new ObjectId(id)})

        if(!exist){
            const error: Error= {
                code: "No_Existente",
                message: "No existe un monumento con ese id. "
            }
            res.status(404).send(error)
            throw error;
        }

        await monumentoscolleccion.deleteOne(exist)
        res.status(200).send("eliminado.")

        return 

    } catch (error) {
        console.log(error);
        return 
    }
}