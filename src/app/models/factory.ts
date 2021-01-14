export interface Point {
    latitude: number;
    longitude: number;
}


export interface Fire {
    id: string;
    intensity: number;
    typeFire: number;
    location: Point;
    size: number;
}


export interface FireStation {
    id: string;
    location: Point;
    name: string;
}

export interface Sensor {
    id: string;
    location: Point;
    name: string;
}

export interface Operation {
    id: string;
    idFireFighter: string[];  
    idVehicle: string[];
    idFire: string;
    location: Point;
}

export interface TypeVehicle {
    id: string;
    name: string;
}

export interface FireStationInfos {
    nbFireFighters: number;
    vehiclesByType: Map<String, number>;
}

export interface Ride {
    operationId: string;
    vehicleId: string;
    listLocalisations: Point[];
    duration: number;	
}