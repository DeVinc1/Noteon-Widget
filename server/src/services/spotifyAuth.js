import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let tokenCache = {
    accessToken: null,
    expiresAt: null,
};

export async function getSpotifyAccessToken() {
    const isCachedTokenValid = tokenCache.accessToken && tokenCache.expiresAt > Date.now()

    if (isCachedTokenValid) {
        return tokenCache.accessToken;
    }

    const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

    const responseToken = await _getAuthTokenSpotify(credentials);

    const { access_token, expires_in } = responseToken.data;

    tokenCache = {
        accessToken: access_token,
        expiresAt: timeNow + (expires_in - 60) * 1000
    };

    return tokenCache.accessToken;
}

function _getAuthTokenSpotify(credentials) {
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