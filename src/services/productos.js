import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// PRODUCTOS

export const getAllProductos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/producto`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getProductos', error);
    }
}

export const findProductoByServicio = async (servicioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/producto/servicio/${servicioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findProductoByServicio', error);
    }
}