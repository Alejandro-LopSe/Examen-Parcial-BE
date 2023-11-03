import { Request, Response } from "npm:express@4.18.2";
 
import { Monumento,Error,P_data,zip_data,weather_data,time_data} from "../mongo/types.ts";
import { monumentoscolleccion} from "../mongo/mongodb.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";

/*
export const envio = async ( req:Request , res: Response)=>{

    try {
        
        const envio: Envio = {
            objeto: req.body.objeto,
            destino:  req.body.destino
        }

        if(!envio.destino ||!envio.objeto || typeof(envio.objeto)!=="string" ){
            const error: Error= {
                code: "Faltan_datos",
                message: "destino(string) o objeto(string), no se ha definido. "
            }
            res.status(400).send(error)
            throw error;
        }
        
        
        
        const existcoche = await cochecollection.findOne({_id: new ObjectId(envio.objeto)})
        
        
        if(!existcoche){
            const error: Error= {
                code: "No_Existente",
                message: "No existe un coche con ese nombre. "
            }
            res.status(400).send(error)
            throw error;
        }

        const isfree = await concesionariocollection.findOne({_id: new ObjectId(existcoche.direccion)})
        const isnotfree = await clientecollection.findOne({_id: new ObjectId(existcoche.direccion)})

        if(existcoche.direccion && isnotfree){
            const error: Error= {
                code: "No_Disponible",
                message: "Ya se vendio ese coche. "
            }
            res.status(400).send(error)
            throw error;
        }else if(isfree){
            if(isfree.coches.length===10){
                const error: Error= {
                    code: "No_Disponible",
                    message: "Ya se lleno ese concesionario. "
                }
                res.status(400).send(error)
                throw error;
            }else if(isfree.coches.length>0){
                const coches: string[] = isfree.coches.reduce((acc: string[] , elem:  string)=>{

                    if(elem===envio.objeto){
                        return acc
                    }else{
                        return [...acc,elem]
                    }
                    
                },[])
    
                await concesionariocollection.updateOne(isfree,{
                        $set: {
                            coches: coches
                        }
                    
                })
            }
            
        }
        
        const existdestino = await concesionariocollection.findOne({_id: new ObjectId(envio.destino)})
        console.log(existdestino);
        

        if(!existdestino){
            const error: Error= {
                code: "No_Existente",
                message: "No existe un concesionario con ese nombre. "
            }
            res.status(400).send(error)
            throw error;
        }

        
        await concesionariocollection.updateOne(existdestino, 
            {
                $set: {coches: [...existdestino.coches, envio.objeto]}

            }
        )
        await cochecollection.updateOne(existcoche, {
            $set: {
                enventa: true,
                direccion: envio.destino
            }
        })

        res.status(200).send(envio)

        return 

    } catch (error) {
        console.log(error);
        return 
    }
}

export const venta = async ( req:Request , res: Response)=>{

    try {
        
        const envio: Envio = {
            objeto: req.body.objeto,
            destino: req.body.destino
        }

        if(!envio.destino ||!envio.objeto || typeof(envio.objeto)!=="string" ){
            const error: Error= {
                code: "Faltan_datos",
                message: "destino(string) o objeto(string), no se ha definido. "
            }
            res.status(400).send(error)
            throw error;
        }
        
        
        
        const existcoche = await cochecollection.findOne({_id: new ObjectId(envio.objeto)})
        
        
        if(!existcoche){
            const error: Error= {
                code: "No_Existente",
                message: "No existe un coche con ese nombre. "
            }
            res.status(400).send(error)
            throw error;
        }

        const isaviable = await concesionariocollection.findOne({_id: new ObjectId(existcoche.direccion)})
        const existdestino = await clientecollection.findOne({_id: new ObjectId(envio.destino)})

        if(!existdestino ){
            const error: Error= {
                code: "No_Existente",
                message: "No existe un cliente con ese nombre. "
            }
            res.status(400).send(error)
            throw error;
        }else if(existdestino.dinero<existcoche.costo){
            const error: Error= {
                code: "No_Disponible",
                message: "No tiene Suficieente dinero. "
            }
            res.status(400).send(error)
            throw error;
        }else if(isaviable?.bloqueado===true){
            const error: Error= {
                code: "No_Disponible",
                message: "Concesionario bloqueado. "
            }
            res.status(400).send(error)
            throw error;
        }else if(isaviable){
            const coches: string[] = isaviable.coches.reduce((acc: string[] , elem:  string)=>{

                if(elem===envio.objeto){

                    
                    return acc
                }else{
                    return [...acc,elem]
                }
                
            },[])
            
            await concesionariocollection.updateOne(isaviable,{
                    $set: {
                        coches: coches
                    }
                
            })
        }

        const dinero = (existdestino.dinero)-(existcoche.costo)
        console.log(dinero);
        
        
        await clientecollection.updateOne(existdestino, 
            {
                $set: {
                    coches: [...existdestino.coches, envio.objeto],
                    dinero: dinero
                }

            }
        )
        await cochecollection.updateOne(existcoche, {
            $set: {
                enventa: false,
                direccion: envio.destino
            }
        })

        res.status(200).send(envio)

        return 

    } catch (error) {
        console.log(error);
        return 
    }
}

export const transpaso = async ( req:Request , res: Response)=>{

    try {
        
        const envio: Envio = {
            origen: req.body.origen,
            objeto: req.body.objeto,
            destino:  req.body.destino
        }

        if(!envio.destino ||!envio.objeto || !envio.origen || typeof(envio.objeto)!=="string"){
            const error: Error= {
                code: "Faltan_datos",
                message: "origen(string), destino(string) o objeto(string), no se ha definido. "
            }
            res.status(400).send(error)
            throw error;
        }
        
        
        
        const existcoche = await cochecollection.findOne({_id: new ObjectId(envio.objeto)})
        
        
        if(!existcoche){
            const error: Error= {
                code: "No_Existente",
                message: "No existe un coche con ese nombre. "
            }
            res.status(400).send(error)
            throw error;
        }

        const isown = await clientecollection.findOne({_id: new ObjectId(existcoche.direccion)})

        if(isown){
            const find = isown.coches.find((elem:string)=>{elem===envio.objeto})
            if(find){
                const coches: string[] = isown.coches.reduce((acc: string[] , elem: string)=>{

                    if(elem===envio.objeto){
                        return acc
                    }else{
                        return [...acc,elem]
                    }
                    
                },[])
    
                await clientecollection.updateOne(isown,{
                        $set: {
                            coches: coches
                        }
                    
                })
            }else{
                const error: Error= {
                    code: "No_Disponible",
                    message: "No tiene Ese coche. "
                }
                res.status(400).send(error)
                throw error;
            }
            
            
        }
        
        const existdestino = await clientecollection.findOne({_id: new ObjectId(envio.destino)})
        

        if(!existdestino){
            const error: Error= {
                code: "No_Disponible",
                message: "No tiene Suficieente dinero. "
            }
            res.status(400).send(error)
            throw error;
        }

        
        await clientecollection.updateOne(existdestino, 
            {
                $set: {coches: [...existdestino.coches, envio.objeto]}

            }
        )
        await cochecollection.updateOne(existcoche, {
            $set: {
                direccion: envio.destino
            }
        })

        res.status(200).send(envio)

        return 

    } catch (error) {
        console.log(error);
        return 
    }
}
export const masdinero = async ( req:Request , res: Response)=>{

    try {
        
        const envio: Envio = {
            objeto: req.body.objeto,
            destino:  req.body.destino
        }

        if(!envio.destino ||!envio.objeto || typeof(envio.objeto)!=="number" || envio.objeto<0){
            const error: Error= {
                code: "Faltan_datos",
                message: "destino(string) o objeto(number), no se ha definido. "
            }
            res.status(400).send(error)
            throw error;
        }
        
        const existdestino = await clientecollection.findOne({_id: new ObjectId(envio.destino)})
        

        if(!existdestino){
            const error: Error= {
                code: "No_Existente",
                message: "No existe un cliente con ese nombre. "
            }
            res.status(400).send(error)
            throw error;
        }

        
        await clientecollection.updateOne(existdestino, 
            {
                $set: {dinero: envio.objeto+existdestino.dinero}

            }
        )

        res.status(200).send(envio)

        return 

    } catch (error) {
        console.log(error);
        return 
    }
}

export const bloqueo = async ( req:Request , res: Response)=>{

    try {
        
        const envio: Envio = {
            objeto: req.body.objeto,
            destino:  req.body.destino
        }

        if(!envio.destino || typeof(envio.objeto)!=="boolean" ){
            const error: Error= {
                code: "Faltan_datos",
                message: "destino(string) o objeto(boolean), no se ha definido. "
            }
            res.status(400).send(error)
            throw error;
        }
        
        const existdestino = await concesionariocollection.findOne({_id: new ObjectId(envio.destino)})
        

        if(!existdestino){
            const error: Error= {
                code: "No_Existente",
                message: "No existe un coche con ese nombre. "
            }
            res.status(400).send(error)
            throw error;
        }

        
        await concesionariocollection.updateOne(existdestino, 
            {
                $set: {bloqueado: envio.objeto}

            }
        )

        res.status(200).send(envio)

        return 

    } catch (error) {
        console.log(error);
        return 
    }
}
*/

export const update = async ( req:Request , res: Response)=>{

    try {
        
        const id = req.params.id

        if( !id ){
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

        await monumentoscolleccion.updateOne(exist, {$set: monumento})

        res.status(200).send(
            "actualizado."
            )

        return 

    } catch (error) {
        console.log(error);
        return 
    }
}

