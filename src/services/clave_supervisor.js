import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL_HAMACHI;

// CLAVE SUPERVISOR 

export const createClaveSupervisor = async (claveSupervisor) => {
    try {
        const response = await axios({
            url: `${baseUrl}/clavesupervisor`,
            method: 'POST',
            data: claveSupervisor
        });
        return response;
    } catch (error) {
        console.log('createClaveSupervisor', error);
    }
}

export const showClaveSupervisorTodayBySucursalAndTurno = async (sucursalId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/clavesupervisor/sucursal/${sucursalId}/today/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showClaveSupervisorTodayBySucursalAndTurno', error);
    }
}

export const findSupervisorByClave = async (clave) => {
    try {
        const response = await axios({
            url: `${baseUrl}/clavesupervisor/clave/${clave}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSupervisorByClave', error);
    }
}

export const showClaveSupervisorTodayBySucursalAndSchedule = async (sucursalId, hora_apertura, hora_cierre) => {
    try {
        const response = await axios({
            url: `${baseUrl}/clavesupervisor/sucursal/${sucursalId}/today/apertura/${hora_apertura}/cierre/${hora_cierre}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showClaveSupervisorTodayBySucursalAndSchedule', error);
    }
}

export const updateClaveSupervisor = async (claveSupervisorId, claveSupervisor) => {
    try {
        const response = await axios({
            url: `${baseUrl}/clavesupervisor/${claveSupervisorId}`,
            method: 'PUT',
            data: claveSupervisor
        });
        return response;
    } catch (error) {
        console.log('updateClaveSupervisor', error);
    }
}