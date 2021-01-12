import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

export const showAllDermapen = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllDermapen', error);
    }
}

export const showAllDermapenBySucursal = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllDermapenBySucursal', error);
    }
}

export const showAllDermapenBySucursalAsistio = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/sucursal/${sucursalId}/asistio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllDermapenBySucursalAsistio', error);
    }
}

export const findDermapenByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDermapenByDate', error);
    }
}

export const findDermapenByDateAndSucursal = async (dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDermapenByDateAndSucursal', error);
    }
}

export const findDermapenByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDermapenByRangeDateAndSucursal', error);
    }
}

export const findDermapenByRangeDateAndSucursalAndService = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, serviceId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}/service/${serviceId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDermapenByRangeDateAndSucursalAndService', error);
    }
}

export const findHistoricDermapenByPaciente = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/historic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricDermapenByPaciente', error);
    }
}

export const findHistoricDermapenByPacienteAndService = async (pacienteId, serviceId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/historic/${pacienteId}/servicio/${serviceId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricDermapenByPacienteAndService', error);
    }
}

export const findDermapenById = async (dermapenId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/${dermapenId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDermapenById', error);
    }
}

export const createDermapen = async (dermapen) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen`,
            method: 'POST',
            data: dermapen
        });
        return response;
    } catch (error) {
        console.log('createDermapen', error);
    }
}

export const updateDermapen = async (dermapenId, dermapen) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/${dermapenId}`,
            method: 'PUT',
            data: dermapen
        });
        return response;
    } catch (error) {
        console.log('updateDermapen', error);
    }
}

export const waitingDermapenList = async (sucursalId, statusAsistioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('waitingDermapenList', error);
    }
}

export const findDermapenByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDermapenByPayOfDoctorTurno', error);
    }
}

export const findDermapensByPayOfDoctorHoraAplicacion = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDermapensByPayOfDoctorHoraAplicacion', error);
    }
}

export const findDermapensByPayOfDoctorHoraAplicacionPA = async (sucursalId, dermatologoId, canceladoCPId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/sucursal/${sucursalId}/dermatologo/${dermatologoId}/canceladocp/${canceladoCPId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDermapensByPayOfDoctorHoraAplicacionPA', error);
    }
}

export const showAllDermapenBySucursalPendiente = async (sucursalId, pendienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/dermapen/sucursal/${sucursalId}/pendiente/${pendienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllDermapenBySucursalPendiente', error);
    }
}