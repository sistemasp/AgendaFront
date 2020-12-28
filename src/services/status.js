import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;

// STATUS

export const showAllStatus = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/status`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllStatus', error);
    }
}