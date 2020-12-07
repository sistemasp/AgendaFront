import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL_HAMACHI;

// CANCELACIONES

export const createCancelacion = async (cancelacion) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cancelacion`,
            method: 'POST',
            data: cancelacion
        });
        return response;
    } catch (error) {
        console.log('createCancelacion', error);
    }
}

export const showCancelacionsTodayBySucursalAndTurno = async (sucursalId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cancelacion/sucursal/${sucursalId}/today/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showCancelacionsTodayBySucursalAndTurno', error);
    }
}

export const showCancelacionsTodayBySucursalAndHoraAplicacion = async (sucursalId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cancelacion/sucursal/${sucursalId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showCancelacionsTodayBySucursalAndHoraAplicacion', error);
    }
}