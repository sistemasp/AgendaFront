import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// PAGO PATÓLOGO

export const createPagoPatologo = async (pagoPatologo) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoPatologo`,
            method: 'POST',
            data: pagoPatologo
        });
        return response;
    } catch (error) {
        console.log('createPagoPatologo', error);
    }
}

export const showTodayPagoPatologoBySucursalTurno = async (patologoId, sucursalId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoPatologo/${patologoId}/sucursal/${sucursalId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showTodayPagoPatologoBySucursalTurno', error);
    }
}