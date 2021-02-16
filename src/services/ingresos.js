import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// INGRESO

export const createIngreso = async (ingreso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/ingreso`,
            method: 'POST',
            data: ingreso
        });
        return response;
    } catch (error) {
        console.log('createIngreso', error);
    }
}

export const showIngresosTodayBySucursalAndTurno = async (sucursalId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/ingreso/sucursal/${sucursalId}/today/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showIngresosTodayBySucursalAndTurno', error);
    }
}

export const showIngresosTodayBySucursalAndHoraAplicacion = async (sucursalId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/ingreso/sucursal/${sucursalId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showIngresosTodayBySucursalAndHoraAplicacion', error);
    }
}

export const showIngresosTodayBySucursalAndHoraAplicacionPA = async (sucursalId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/ingreso/sucursal/${sucursalId}/apertura/${hora_apertura}/cierre/${hora_cierre}/pa`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showIngresosTodayBySucursalAndHoraAplicacionPA', error);
    }
}

export const findIngresoById = async (ingresoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/ingreso/${ingresoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findIngresoById', error);
    }
}

/*export const findIngresoByPago = async (pagoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/ingreso/pago/${pagoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findIngresoByPago', error);
    }
}*/

export const updateIngreso = async (ingresoId, ingreso) => {
    try {
        const response = await axios({
            url: `${baseUrl}/ingreso/${ingresoId}`,
            method: 'PUT',
            data: ingreso
        });
        return response;
    } catch (error) {
        console.log('updateIngreso', error);
    }
}

export const deleteIngreso = async (ingresoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/ingreso/${ingresoId}`,
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.log('deleteIngreso', error);
    }
}