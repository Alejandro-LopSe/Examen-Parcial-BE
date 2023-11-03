import { Request, Response } from "npm:express@4.18.2";
 
import { Monumento,Error,P_data,zip_data,weather_data,time_data} from "../mongo/types.ts";
import { monumentoscolleccion} from "../mongo/mongodb.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";


export const getbase = (req: Request, res: Response) =>{
    res.status(200).send({
        estado: "OK, Informacion: ",
        metodos_post: [{
            path: "/api/monumentos" ,
            uso: "Añadir monumento."
        }],
        metodos_gets: [{
            path: "/api/monumentos/:id" ,
            uso: "Obtiene un monumento."
        },{
            path: "/api/monumentos" ,
            uso: "obtiene todos."
        }],
        metodos_puts: [{
            path: "/api/monumentos/:id" ,
            uso: "actualiza el monumento"
        }],
        metodos_deletes: [{
            path: "/api/monumentos/:id" ,
            uso: "elimina un monumento."
        }],
    })
}



export const getone = async ( req:Request , res: Response)=>{

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

        const response_time = await fetch(`http://worldtimeapi.org/api/timezone/${exist.Continente}/${exist.Ciudad}`);
    
    
        if(response_time.status!==200){
            
            const error = await response_time.json()
            
            throw error;
        }
        

        const data_time: time_data = await response_time.json();
        console.log("codigo time hecho",data_time);
        const response_weather = await fetch(`http://api.weatherapi.com/v1/current.json?key=a9ca4109fafc4443b0c103255230610&q=${exist.Ciudad}&aqi=no`);
    
    
        if(response_weather.status!==200){
            
            const error = await response_weather.json()
            
            throw error;
        }
        
        const data_weather: weather_data = await response_weather.json();
        console.log("codigo weather hecho",data_weather);
        
        const monumento: Monumento = {
            Nombre: exist.Nombre,
            Descripcion: exist.Descripcion,
            Codigo_postal: exist.Codigo_postal,
            Codigo_ISO: exist.Codigo_ISO,
            Pais: exist.Pais,
            Ciudad: exist.Ciudad,
            Continente: exist.Continente,
            Hora: data_time.datetime.toString().substring(11,19),
            Weather: data_weather.current.condition.text
        }
        const hora = monumento.Hora
        
        await monumentoscolleccion.updateOne(exist, {$set: monumento})



        res.status(200).send(monumento)

        return 

    } catch (error) {
        console.log(error);
        return 
    }
}

export const getall = async ( req:Request , res: Response)=>{

    try {
        

        const exist = await monumentoscolleccion.find().toArray()
        const data = exist.map((elem:Monumento)=>{
            return{
               _id: elem._id,
               Nombre: elem.Nombre,
               Pais: elem.Pais
            }
        })
        if(!exist){
            const error: Error= {
                code: "No_Existente",
                message: "No existe ninguno aun. "
            }
            res.status(404).send(error)
            throw error;
        }


        res.status(200).send(data)

        return 

    } catch (error) {
        console.log(error);
        return 
    }
}

