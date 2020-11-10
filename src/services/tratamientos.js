import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// TRATAMIENTOS

export const getAllTreatments = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tratamiento`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getTreatments', error);
    }
}

export const findTreatmentByServicio = async (servicioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/tratamiento/servicio/${servicioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findTreatmentByServicio', error);
    }
}