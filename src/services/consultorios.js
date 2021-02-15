import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// CONSULTORIOS

export const findSurgeryBySucursalId = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSurgeryBySucursalId', error);
    }
}

export const findSurgeryBySucursalAndDermatologoId = async (sucursalId, dermatologoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/sucursal/${sucursalId}/dermatologo/${dermatologoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSurgeryBySucursalAndDermatologoId', error);
    }
}

export const findSurgeryBySucursalIdWaitingList = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/waitinglist/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSurgeryBySucursalIdWaitingList', error);
    }
}

export const findSurgeryBySucursalIdAndFree = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/sucursal/${sucursalId}/libre`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSurgeryBySucursalIdAndFree', error);
    }
}

export const createSurgery = async (consultorio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio`,
            method: 'POST',
            data: consultorio
        });
        return response;
    } catch (error) {
        console.log('createSurgery', error);
    }
}

export const updateSurgery = async (surgeryId, surgery) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/${surgeryId}`,
            method: 'PUT',
            data: surgery
        });
        return response;
    } catch (error) {
        console.log('updateSurgery', error);
    }
}

export const breakFreeSurgeryByIdPaciente = async (surgeryId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/liberar/paciente/${surgeryId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeSurgeryByIdPaciente', error);
    }
}

export const breakFreeSurgeryByIdDermatologo = async (surgeryId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consultorio/liberar/dermatologo/${surgeryId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeSurgeryByIdDermatologo', error);
    }
}