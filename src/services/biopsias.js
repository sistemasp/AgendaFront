import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// BIOPSIA

export const createBiopsia = async (biopsias) => {
    try {
        const response = await axios({
            url: `${baseUrl}/biopsia`,
            method: 'POST',
            data: biopsias
        });
        return response;
    } catch (error) {
        console.log('createBiopsia', error);
    }
}

export const findBiopsiasByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/biopsia/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findBiopsiasByRangeDateAndSucursal', error);
    }
}

export const findBiopsiasHistoricByPaciente = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/biopsia/historic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findBiopsiasHistoricByPaciente', error);
    }
}

export const findBiopsiaById = async (id) => {
    try {
        const response = await axios({
            url: `${baseUrl}/biopsia/${id}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findBiopsiaById', error);
    }
}