import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

export const showAllAparatologia = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllAparatologia', error);
    }
}

export const showAllAparatologiaBySucursal = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllAparatologiaBySucursal', error);
    }
}

export const showAllAparatologiaBySucursalAsistio = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/sucursal/${sucursalId}/asistio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllAparatologiaBySucursalAsistio', error);
    }
}

export const findAparatologiaByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findAparatologiaByDate', error);
    }
}

export const findAparatologiaByDateAndSucursal = async (dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findAparatologiaByDateAndSucursal', error);
    }
}

export const findAparatologiaByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findAparatologiaByRangeDateAndSucursal', error);
    }
}

export const findAparatologiaByRangeDateAndSucursalAndService = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, serviceId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}/service/${serviceId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findAparatologiaByRangeDateAndSucursalAndService', error);
    }
}

export const findHistoricAparatologiaByPaciente = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/historic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricAparatologiaByPaciente', error);
    }
}

export const findHistoricAparatologiaByPacienteAndService = async (pacienteId, serviceId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/historic/${pacienteId}/servicio/${serviceId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricAparatologiaByPacienteAndService', error);
    }
}

export const findAparatologiaById = async (aparatologiaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/${aparatologiaId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findAparatologiaById', error);
    }
}

export const createAparatologia = async (aparatologia) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia`,
            method: 'POST',
            data: aparatologia
        });
        return response;
    } catch (error) {
        console.log('createAparatologia', error);
    }
}

export const updateAparatologia = async (aparatologiaId, aparatologia) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/${aparatologiaId}`,
            method: 'PUT',
            data: aparatologia
        });
        return response;
    } catch (error) {
        console.log('updateAparatologia', error);
    }
}

export const waitingAparatologiaList = async (sucursalId, statusAsistioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('waitingAparatologiaList', error);
    }
}

export const findAparatologiaByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findAparatologiaByPayOfDoctorTurno', error);
    }
}

export const findAparatologiasByPayOfDoctorHoraAplicacion = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findAparatologiasByPayOfDoctorHoraAplicacion', error);
    }
}

export const findAparatologiasByPayOfDoctorHoraAplicacionPA = async (sucursalId, dermatologoId, canceladoCPId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/sucursal/${sucursalId}/dermatologo/${dermatologoId}/canceladocp/${canceladoCPId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findAparatologiasByPayOfDoctorHoraAplicacionPA', error);
    }
}

export const showAllAparatologiasBySucursalPendiente = async (sucursalId, pendienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/aparatologia/sucursal/${sucursalId}/pendiente/${pendienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllAparatologiasBySucursalPendiente', error);
    }
}