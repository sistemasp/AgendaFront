import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL_HAMACHI;

// EGRESO

export const createEgreso = async (egreso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/egreso`,
            method: 'POST',
            data: egreso
        });
        return response;
    } catch (error) {
        console.log('createEgreso', error);
    }
}

export const showEgresosTodayBySucursalAndTurno = async (sucursalId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/egreso/sucursal/${sucursalId}/today/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showEgresosTodayBySucursalAndTurno', error);
    }
}

export const showEgresosTodayBySucursalAndHoraAplicacion = async (sucursalId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/egreso/sucursal/${sucursalId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showEgresosTodayBySucursalAndHoraAplicacion', error);
    }
}