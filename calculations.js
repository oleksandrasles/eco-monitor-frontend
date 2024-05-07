import { getIndicator } from "./functions/Indicator";
import { getObject } from "./functions/Object";

export async function calculateAIR(objectId) {
    
    const object = await getObject(objectId);
    const calcObj = {
        controlPosts: "",
        midConcentration: "",
    }

    if (object) {
        if (object.indicators && object.indicators.length > 0) {
            for(let indicatorId of object.indicators) {
                const indicator = await getIndicator(indicatorId);
                console.log(object.name + " " + indicatorId + " " + indicator.name);

                if(indicator) {
                    if (indicator.name == "controlPosts") calcObj.controlPosts = indicator.values[0].value;
                    if (indicator.name == "midConcentration") calcObj.midConcentration = indicator.values[0].value;
                }
            }
        }
    }

    const AIR = (1/calcObj.controlPosts) * calcObj.midConcentration;
	let level = 0;
	
	if(AIR < 0.6) level = 1;
	else if(AIR >= 0.6 && AIR < 1) level = 2;
	else if(AIR >= 1 && AIR < 1.5) level = 3;
	else if(AIR >= 1.5) level = 4;
    
    return {value: AIR, level};
}

export async function calculateWTR(objectId) {
    
    const object = await getObject(objectId);
    const calcObj = {
        waterConcentration: "",
        GDK: "",
    }

    if (object) {
        if (object.indicators && object.indicators.length > 0) {
            for(let indicatorId of object.indicators) {
                const indicator = await getIndicator(indicatorId);
                console.log(object.name + " " + indicatorId + " " + indicator.name);

                if(indicator) {
                    if (indicator.name == "waterConcentration") calcObj.waterConcentration = indicator.values[0].value;
                    if (indicator.name == "GDK") calcObj.GDK = indicator.values[0].value;
                }
            }
        }
    }

    const WTR = calcObj.waterConcentration / calcObj.GDK;
	let level = 0;
	
	//check levels
	if(WTR < 0.1) level = 1;
	else if(WTR >= 0.2 && WTR < 0.3) level = 2;
	else if(WTR >= 0.3 && WTR < 0.5) level = 3;
	else if(WTR >= 0.5) level = 4;
    
    return {value: WTR, level};
}

export async function calculateIS(objectId) {
    
    const object = await getObject(objectId);
    const calcObj = {
        concentration: "",
        backgroundConcentration: "",
        hazardClass: ""
    }

    if (object) {
        if (object.indicators && object.indicators.length > 0) {
            for(let indicatorId of object.indicators) {
                const indicator = await getIndicator(indicatorId);

                if(indicator) {
                    if (indicator.name == "concentration") calcObj.concentration = indicator.values[0].value;
                    if (indicator.name == "backgroundConcentration") calcObj.backgroundConcentration = indicator.values[0].value;
                    if (indicator.name == "hazardClass") calcObj.hazardClass = indicator.values[0].value;
                }
            }
        }
    }

    let IS = null;
	let level = 1;

    switch (calcObj.hazardClass) {
        case '1':
            IS += 3 * calcObj.concentration / calcObj.backgroundConcentration;
            break;
        case '2':
            IS += 2 * calcObj.concentration / calcObj.backgroundConcentration;
            break;
        case '3':
            IS += 1 * calcObj.concentration / calcObj.backgroundConcentration;
            break;
        default:
            break;
    }
	
	if(IS <= 5) level = 1;
	else if(IS > 5 && IS < 10) level = 2;
	else if(IS >= 10 && IS < 15) level = 3;
	else if(IS >= 15 && IS < 20) level = 4;
	else if(IS >= 20) level = 5;
    
    return {value: IS, level};
    
}

export async function calculateRAD(objectId) {
    
    const object = await getObject(objectId);
    const calcObj = {
        intensity: "",
        radionuclide: "",
    }

    if (object) {
        if (object.indicators && object.indicators.length > 0) {
            for(let indicatorId of object.indicators) {
                const indicator = await getIndicator(indicatorId);
                console.log(object.name + " " + indicatorId + " " + indicator.name);

                if(indicator) {
                    if (indicator.name == "intensity") calcObj.intensity = indicator.values[0].value;
                    if (indicator.name == "radionuclide") calcObj.radionuclide = indicator.values[0].value;
                }
            }
        }
    }

    const RAD = calcObj.intensity * calcObj.radionuclide;
	let level = 0;
	
	if(RAD >= 0.1 && RAD <= 0.2 ) level = 1;
	else if(RAD > 0.2 && RAD < 0.3) level = 2;
	else if(RAD >= 0.3 && RAD <= 1.2) level = 3;
	else if(RAD > 1.2) level = 4;
    
    return {value: RAD, level};
    
}

export async function calculatePX(objectId) {
    
    const object = await getObject(objectId);
    const calcObj = {
        price_index: "",
    }

    if (object) {
        if (object.indicators && object.indicators.length > 0) {
            for(let indicatorId of object.indicators) {
                const indicator = await getIndicator(indicatorId);
                console.log(object.name + " " + indicatorId + " " + indicator.name);

                if(indicator) {
                    if (indicator.name == "price_index") calcObj.price_index = indicator.values[0].value;
                }
            }
        }
    }
	
	const price_index = calcObj.price_index;
	let level = 0;
	
	if(price_index <= 15 ) level = 1;
	else if(price_index > 15 && price_index < 20) level = 2;
	else if(price_index >= 20 && price_index <= 25) level = 3;
	else if(price_index > 25) level = 4;
    
    return {value: price_index, level};
}

export async function calculateHLTH(objectId) {
    
    const object = await getObject(objectId);
    const calcObj = {
        births: "",
        population: "",
    }

    if (object) {
        if (object.indicators && object.indicators.length > 0) {
            for(let indicatorId of object.indicators) {
                const indicator = await getIndicator(indicatorId);
                console.log(object.name + " " + indicatorId + " " + indicator.name);

                if(indicator) {
                    if (indicator.name == "births") calcObj.births = indicator.values[0].value;
                    if (indicator.name == "population") calcObj.population = indicator.values[0].value;
                }
            }
        }
    }
	
	const HLTV = calcObj.births / calcObj.population;
	let level = 0;
	
	if(HLTV <= 20 ) level = 3;
	else if(HLTV > 20 && HLTV < 30) level = 2;
	else if(HLTV >= 30) level = 1;
    
    return {value: HLTV, level};
}

export async function calculateP(objectId) {
    
    const object = await getObject(objectId);
    const calcObj = {
        energyConsumption: "",
        days: "",
    }

    if (object) {
        if (object.indicators && object.indicators.length > 0) {
            for(let indicatorId of object.indicators) {
                const indicator = await getIndicator(indicatorId);
                console.log(object.name + " " + indicatorId + " " + indicator.name);

                if(indicator) {
                    if (indicator.name == "energyConsumption") calcObj.energyConsumption = indicator.values[0].value;
                    if (indicator.name == "days") calcObj.days = indicator.values[0].value;
                }
            }
        }
    }
	
	const P = calcObj.energyConsumption / calcObj.days;
	let level = 0;
	
	if(P <= 3 ) level = 5;
	else if(P > 3 && P < 5) level = 3;
	else if(P >= 5) level = 1;
    
    return {value: P, level};
}