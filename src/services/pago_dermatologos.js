import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// PAGO DERMATÓLOGO

export const createPagoDermatologo = async (pagoDermatologo) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoDermatologo`,
            method: 'POST',
            data: pagoDermatologo
        });
        return response;
    } catch (error) {
        console.log('createPagoDermatologo', error);
    }
}

export const showTodayPagoDermatologoBySucursalTurno = async (dermatologoId, sucursalId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pagoDermatologo/${dermatologoId}/sucursal/${sucursalId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showTodayPagoDermatologoBySucursalTurno', error);
    }
}