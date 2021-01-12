import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// ESTETICA ( TOXINAS Y RELLENOS )

export const createEstetica = async (estetica) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica`,
            method: 'POST',
            data: estetica
        });
        return response;
    } catch (error) {
        console.log('createEstetica', error);
    }
}

export const findEsteticaByDateAndSucursal = async (dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEsteticaByDateAndSucursal', error);
    }
}

export const updateEstetica = async (idEstetica, estetica) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/${idEstetica}`,
            method: 'PUT',
            data: estetica
        });
        return response;
    } catch (error) {
        console.log('updateEstetica', error);
    }
}

export const findEsteticaById = async (esteticaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/${esteticaId}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findEsteticaById', error);
    }
}

export const findEsteticaByConsultaId = async (consultaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/consulta/${consultaId}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findEsteticaByConsultaId', error);
    }
}

export const findEsteticasByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEsteticasByRangeDateAndSucursal', error);
    }
}

export const waitingListEstetica = async (sucursalId, statusAsistioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('waitingListEstetica', error);
    }
}

export const findEsteticasHistoricByPaciente = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/historic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEsteticasHistoricByPaciente', error);
    }
}

export const findEsteticasByPayOfDoctorHoraAplicacion = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEsteticasByPayOfDoctorHoraAplicacion', error);
    }
}

export const findEsteticasByPayOfDoctorHoraAplicacionPA = async (sucursalId, dermatologoId, canceladoCPId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/sucursal/${sucursalId}/dermatologo/${dermatologoId}/canceladocp/${canceladoCPId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEsteticasByPayOfDoctorHoraAplicacionPA', error);
    }
}