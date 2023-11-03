import { Request, Response } from "npm:express@4.18.2";
 
import { Monumento,Error,P_data,zip_data,weather_data,time_data} from "../mongo/types.ts";
import { monumentoscolleccion} from "../mongo/mongodb.ts";



export const addmonumento = async ( req:Request , res: Response)=>{

    try {
        
        const peticion: Monumento = {
            Nombre: req.body.Nombre,
            Descripcion: req.body.Descripcion,
            Codigo_postal: req.body.Codigo_postal,
            Codigo_ISO: req.body.Codigo_ISO
        }

        if(!peticion.Nombre || !peticion.Descripcion || !peticion.Codigo_postal || !peticion.Codigo_ISO ){
            const error: Error= {
                code: "Faltan_datos",
                message: "Nombre(string) o Descripcion(string), Codigo_postal(number), Codigo_ISO(string) no se ha definido. "
            }
            res.status(500).send(error)
            throw error;
        }
        const exist = await monumentoscolleccion.findOne({Nombre: peticion.Nombre,Codigo_postal: peticion.Codigo_postal})

        if(exist){
            const error: Error= {
                code: "Ya_Existente",
                message: "Ya existe un monumento con ese nombre y codigo postal. "
            }
            res.status(400).send(error)
            throw error;
        }

        const response_iso = await fetch(`https://restcountries.com/v3.1/alpha/${peticion.Codigo_ISO}`);
    
    
        if(response_iso.status!==200){
            
            
            const error = await response_iso.json()
            
            throw error;
        }
        

        const data_iso: P_data = await response_iso.json();
        console.log("codigo iso hecho",data_iso[0].cca2);

        const response_zip = await fetch(`https://zip-api.eu/api/v1/info/${data_iso[0].cca2}-${peticion.Codigo_postal}`);
    
    
        if(response_zip.status!==200){
            
            const error = await response_zip.json()
            
            throw error;
        }
        
        const data_zip: zip_data = await response_zip.json();
        console.log("codigo zip hecho",data_zip);
        const response_time = await fetch(`http://worldtimeapi.org/api/timezone/${data_iso[0].region}/${data_zip.place_name}`);
    
    
        if(response_time.status!==200){
            
            const error = await response_time.json()
            
            throw error;
        }
        

        const data_time: time_data = await response_time.json();
        console.log("codigo time hecho",data_time);
        const response_weather = await fetch(`http://api.weatherapi.com/v1/current.json?key=a9ca4109fafc4443b0c103255230610&q=${data_zip.place_name}&aqi=no`);
    
    
        if(response_weather.status!==200){
            
            const error = await response_weather.json()
            
            throw error;
        }
        
        const data_weather: weather_data = await response_weather.json();
        console.log("codigo weather hecho",data_weather);
        
        const monumento: Monumento = {
            Nombre: peticion.Nombre,
            Descripcion: peticion.Descripcion,
            Codigo_postal: peticion.Codigo_postal,
            Codigo_ISO: peticion.Codigo_ISO,
            Pais: data_iso[0].name.common,
            Ciudad: data_zip.place_name,
            Continente: data_iso[0].region,
            Hora: data_time.datetime.toString().substring(11,19),
            Weather: data_weather.current.condition.text
        }
         
        
        

        

        await monumentoscolleccion.insertOne(monumento)

        res.status(200).send({
            _id: monumento._id?.toString(),
            
                Nombre: peticion.Nombre,
                Descripcion: peticion.Descripcion,
                Codigo_postal: peticion.Codigo_postal,
                Codigo_ISO: peticion.Codigo_ISO,
                Pais: data_iso[0].name.common,
                Ciudad: data_zip.place_name,
                Continente: data_iso[0].region,
                Hora: data_time.datetime.toString().substring(11,19),
                Weather: data_weather.current.condition.text
            })

        return 

    } catch (error) {
        console.log(error);
        return 
    }
}

