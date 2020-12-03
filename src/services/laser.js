import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL_HAMACHI;

export const showAllLaser = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllLaser', error);
    }
}

export const showAllLaserBySucursal = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllLaserBySucursal', error);
    }
}

export const showAllLaserBySucursalAsistio = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser/sucursal/${sucursalId}/asistio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllLaserBySucursalAsistio', error);
    }
}

export const findLaserByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findLaserByDate', error);
    }
}

export const findLaserByDateAndSucursal = async (dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findLaserByDateAndSucursal', error);
    }
}

export const findLaserByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findLaserByRangeDateAndSucursal', error);
    }
}

export const findLaserByRangeDateAndSucursalAndService = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, serviceId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}/service/${serviceId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findLaserByRangeDateAndSucursalAndService', error);
    }
}

export const findHistoricLaserByPaciente = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser/historic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricLaserByPaciente', error);
    }
}

export const findHistoricLaserByPacienteAndService = async (pacienteId, serviceId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser/historic/${pacienteId}/servicio/${serviceId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricLaserByPacienteAndService', error);
    }
}

export const findLaserById = async (laserId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser/${laserId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findLaserById', error);
    }
}

export const createLaser = async (laser) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser`,
            method: 'POST',
            data: laser
        });
        return response;
    } catch (error) {
        console.log('createLaser', error);
    }
}

export const updateLaser = async (laserId, laser) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser/${laserId}`,
            method: 'PUT',
            data: laser
        });
        return response;
    } catch (error) {
        console.log('updateLaser', error);
    }
}

export const waitingLaserList = async (sucursalId, statusAsistioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('waitingLaserList', error);
    }
}

export const findLaserByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findLaserByPayOfDoctorTurno', error);
    }
}

export const findLasersByPayOfDoctorHoraAplicacion = async (sucursalId, dermatologoId, atendidoId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findLasersByPayOfDoctorHoraAplicacion', error);
    }
}

export const showAllLaserBySucursalPendiente = async (sucursalId, pendienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/laser/sucursal/${sucursalId}/pendiente/${pendienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllLaserBySucursalPendiente', error);
    }
}