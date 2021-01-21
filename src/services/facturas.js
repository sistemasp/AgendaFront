import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// FACTURAS 

export const createFactura = async (factura) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura`,
            method: 'POST',
            data: factura
        });
        return response;
    } catch (error) {
        console.log('createFactura', error);
    }
}

export const findFacturasByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findFacturasByRangeDateAndSucursal', error);
    }
}

export const findFacturaByRazonSocialId = async (razonSocialId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/factura/razonsocial/${razonSocialId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findFacturaByRazonSocialId', error);
    }
}