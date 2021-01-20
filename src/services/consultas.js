import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

export const getAllConsults = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllConsults', error);
    }
}

export const getAllConsultsBySucursal = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllConsultsBySucursal', error);
    }
}

export const showAllConsultsBySucursalAsistio = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/asistio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllConsultsBySucursalAsistio', error);
    }
}

export const showAllConsultsBySucursalPendiente = async (sucursalId, pendienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/pendiente/${pendienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllConsultsBySucursalPendiente', error);
    }
}

export const findConsultsByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByDate', error);
    }
}

export const findConsultsByDateAndSucursal = async (dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByDateAndSucursal', error);
    }
}

export const findConsultsByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByRangeDateAndSucursal', error);
    }
}

export const findHistoricConsultByPaciente = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/historic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricConsultByPaciente', error);
    }
}

export const findHistoricConsultByDermatologo = async (dermatologoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/historic/dermatologo/${dermatologoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricConsultByDermatologo', error);
    }
}

export const findConsultById = async (consultId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${consultId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultById', error);
    }
}


export const createConsult = async (consulta) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta`,
            method: 'POST',
            data: consulta
        });
        return response;
    } catch (error) {
        console.log('createConsult', error);
    }
}

export const updateConsult = async (consultaId, consulta) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${consultaId}`,
            method: 'PUT',
            data: consulta
        });
        return response;
    } catch (error) {
        console.log('updateConsult', error);
    }
}

export const waitingListConsulta = async (sucursalId, statusAsistioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('waitingListConsulta', error);
    }
}

export const findConsultsByPayOfDoctor = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctor', error);
    }
}

export const findConsultsByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctorTurno', error);
    }
}

export const findConsultsByPayOfDoctorTurnoFrecuencia = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId, turno, frecuenciaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/turno/${turno}/frecuencia/${frecuenciaId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctorTurnoFrecuencia', error);
    }
}

export const findConsultsByPayOfDoctorHoraAplicacion = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctorHoraAplicacion', error);
    }
}

export const findConsultsByPayOfDoctorHoraAplicacionFrecuencia = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre, frecuenciaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}/frecuencia/${frecuenciaId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctorHoraAplicacionFrecuencia', error);
    }
}

export const findConsultsByPayOfDoctorHoraAplicacionFrecuenciaPA = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre, frecuenciaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consulta/sucursal/${sucursalId}/dermatologo/${dermatologoId}/canceladocp/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}/frecuencia/${frecuenciaId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findConsultsByPayOfDoctorHoraAplicacionFrecuenciaPA', error);
    }
}