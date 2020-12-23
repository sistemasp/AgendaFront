import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

export const showAllFacial = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllFacial', error);
    }
}

export const showAllFacialBySucursal = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllFacialBySucursal', error);
    }
}

export const showAllFacialBySucursalAsistio = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/sucursal/${sucursalId}/asistio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllFacialBySucursalAsistio', error);
    }
}

export const findFacialByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findFacialByDate', error);
    }
}

export const findFacialByDateAndSucursal = async (dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findFacialByDateAndSucursal', error);
    }
}

export const findFacialByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findFacialByRangeDateAndSucursal', error);
    }
}

export const findFacialByRangeDateAndSucursalAndService = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, serviceId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}/service/${serviceId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findFacialByRangeDateAndSucursalAndService', error);
    }
}

export const findHistoricFacialByPaciente = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/historic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricFacialByPaciente', error);
    }
}

export const findHistoricFacialByPacienteAndService = async (pacienteId, serviceId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/historic/${pacienteId}/servicio/${serviceId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricFacialByPacienteAndService', error);
    }
}

export const findFacialById = async (facialId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/${facialId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findFacialById', error);
    }
}

export const createFacial = async (facial) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial`,
            method: 'POST',
            data: facial
        });
        return response;
    } catch (error) {
        console.log('createFacial', error);
    }
}

export const updateFacial = async (facialId, facial) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/${facialId}`,
            method: 'PUT',
            data: facial
        });
        return response;
    } catch (error) {
        console.log('updateFacial', error);
    }
}

export const waitingFacialList = async (sucursalId, statusAsistioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('waitingFacialList', error);
    }
}

export const findFacialByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findFacialByPayOfDoctorTurno', error);
    }
}

export const findFacialesByPayOfDoctorHoraAplicacion = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findFacialesByPayOfDoctorHoraAplicacion', error);
    }
}

export const findFacialesByPayOfDoctorHoraAplicacionPA = async (sucursalId, dermatologoId, canceladoCPId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/sucursal/${sucursalId}/dermatologo/${dermatologoId}/canceladocp/${canceladoCPId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findFacialesByPayOfDoctorHoraAplicacionPA', error);
    }
}

export const showAllFacialBySucursalPendiente = async (sucursalId, pendienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/facial/sucursal/${sucursalId}/pendiente/${pendienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllFacialBySucursalPendiente', error);
    }
}