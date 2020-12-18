import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// AREAS

export const findAreasByTreatmentServicio = async (servicioId, tratamientoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/area/servicio/${servicioId}/tratamiento/${tratamientoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findAreasByTreatmentServicio', error);
    }
}

export const findAreaById = async (id) => {
    try {
        const response = await axios({
            url: `${baseUrl}/area/${id}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findAreaById', error);
    }
}