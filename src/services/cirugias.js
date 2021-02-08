import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

export const createCirugia = async (cirugia) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia`,
            method: 'POST',
            data: cirugia
        });
        return response;
    } catch (error) {
        console.log('createCirugia', error);
    }
}

export const updateCirugia = async (idCirugia, cirugia) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/${idCirugia}`,
            method: 'PUT',
            data: cirugia
        });
        return response;
    } catch (error) {
        console.log('updateCirugia', error);
    }
}

export const findCirugiaById = async (cirugiaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/${cirugiaId}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findCirugiaById', error);
    }
}

export const findCirugiaByConsultaId = async (consultaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/consulta/${consultaId}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findCirugiaByConsultaId', error);
    }
}

export const findCirugiaByDateAndSucursal = async (dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCirugiaByDateAndSucursal', error);
    }
}

export const findCirugiasByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCirugiasByRangeDateAndSucursal', error);
    }
}

export const waitingListCirugia = async (sucursalId, statusAsistioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/waitingList/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('waitingListCirugia', error);
    }
}

export const findCirugiasHistoricByPaciente = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/historic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCirugiasHistoricByPaciente', error);
    }
}

export const findCirugiasByPayOfDoctorHoraAplicacion = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCirugiasByPayOfDoctorHoraAplicacion', error);
    }
}

export const findCirugiasByPayOfDoctorHoraAplicacionPA = async (sucursalId, dermatologoId, canceladoCPId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/sucursal/${sucursalId}/dermatologo/${dermatologoId}/canceladocp/${canceladoCPId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('finCirugiasByPayOfDoctorHoraAplicacionPA', error);
    }
}

export const findCirugiasByPayOfPatologoHoraAplicacion = async (sucursalId, patologoId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/sucursal/${sucursalId}/patologo/${patologoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCirugiasByPayOfPatologoHoraAplicacion', error);
    }
}