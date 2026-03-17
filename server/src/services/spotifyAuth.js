import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let tokenCache = {
    accessToken: null,
    expiresAt: null,
};

/**
 * Obter o token de acesso ao Spotify de forma cacheada
 * @returns O token de acesso ao Spotify.
 */
export async function getSpotifyAccessToken() {
    const timeNow = Date.now();

    if (tokenCache.accessToken && tokenCache.expiresAt > timeNow) {
        return tokenCache.accessToken;
    }

    const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

    const responseToken = await getTokensFromSpotify(credentials);

    const { access_token, expires_in } = responseToken.data;

    tokenCache = {
        acessToken: access_token,
        expiresAt: timeNow + (expires_in - 60) * 1000
    };

    return tokenCache.accessToken;
}

/**
 * Obter os tokens de credencial a partir das chaves de API do Spotify.
 * @param {*} credentials - As credenciais de user client e user secret do Spotify encodadas em base64;
 * @returns  o token de acesso ao Spotify e o seu tempo de expiração.
 */
function getTokensFromSpotify(credentials) {
    return axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
}

