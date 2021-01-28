import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// ESQUEMA

export const createEsquema = async (esquema) => {
    try {
        const response = await axios({
            url: `${baseUrl}/esquema`,
            method: 'POST',
            data: esquema
        });
        return response;
    } catch (error) {
        console.log('createEsquema', error);
    }
}

export const findEsquemaById = async (id) => {
    try {
        const response = await axios({
            url: `${baseUrl}/esquema/${id}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEsquemaById', error);
    }
}