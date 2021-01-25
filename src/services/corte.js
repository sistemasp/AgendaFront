import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// CORTE 

export const createCorte = async (corte) => {
    try {
        const response = await axios({
            url: `${baseUrl}/corte`,
            method: 'POST',
            data: corte
        });
        return response;
    } catch (error) {
        console.log('createCorte', error);
    }
}

export const showCorteTodayBySucursalAndTurno = async (sucursalId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/corte/sucursal/${sucursalId}/today/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showCorteTodayBySucursalAndTurno', error);
    }
}

export const showCorteTodayBySucursalAndSchedule = async (sucursalId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/corte/sucursal/${sucursalId}/today/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showCorteTodayBySucursalAndSchedule', error);
    }
}

export const updateCorte = async (corteId, corte) => {
    try {
        const response = await axios({
            url: `${baseUrl}/corte/${corteId}`,
            method: 'PUT',
            data: corte
        });
        return response;
    } catch (error) {
        console.log('updateCorte', error);
    }
}

export const findCortesByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/corte/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCortesByRangeDateAndSucursal', error);
    }
}