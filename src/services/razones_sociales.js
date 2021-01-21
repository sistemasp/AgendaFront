import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// RAZON SOCIAL

export const showAllRazonSocials = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/razonsocial`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllRazonSocials', error);
    }
}

export const findRazonSocialById = async (razonSocialId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/razonsocial/${razonSocialId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findRazonSocialById', error);
    }
}

export const updateRazonSocial = async (razonSocialId, razonSocial) => {
    try {
        const response = await axios({
            url: `${baseUrl}/razonsocial/${razonSocialId}`,
            method: 'PUT',
            data: razonSocial
        });
        return response;
    } catch (error) {
        console.log('updateRazonSocial', error);
    }
}

export const createRazonSocial = async (razonSocial) => {
    try {
        const response = await axios({
            url: `${baseUrl}/razonsocial`,
            method: 'POST',
            data: razonSocial
        });
        return response;
    } catch (error) {
        console.log('createRazonSocial', error);
    }
}