import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";



export type Monumento = {
    _id?: ObjectId;
    Nombre: string;
    Descripcion: string;
    Codigo_postal: number;
    Ciudad?: string;
    Pais?: string;
    Continente?: string;
    Hora?: string;
    Codigo_ISO: string;
    Weather?: string
}
export type P_data = {
    [index: string]: { 
    name: {
    common: string
    }
    cca2: string
    region: string 
}}

export type zip_data ={
    place_name: string;
    postal_code: string 
}

export type time_data ={
    datetime: Date;
}

export type weather_data ={
    current: {
        condition: {
            text: string,
        }
    }
}


export type Error = {
    code: string;
    message: string;
}