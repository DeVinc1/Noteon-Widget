import axios from 'axios';
import { getSpotifyAccessToken } from './spotifyAuth.js';

const spotifyEndpoints ={
    playlist: 'https://api.spotify.com/v1/playlists/{playlist_id}/items?fields=items(track(name,artists(name),album(images(url))))',
    album: 'https://api.spotify.com/v1/albums/{id}/tracks'
}

const spotifyToken = await getSpotifyAccessToken();

function _getMusicSourceAndId(sourceURL){
    /*
     * Formato de URL de playlists do Spotify https://open.spotify.com/playlist/id_000000000?si=code_000000000
     * Formato  de URL de albúm do Spotify https://open.spotify.com/intl-pt/album/id_000000000?si=code_000000000
     */
    
    switch(true){
        case sourceURL.includes('playlist'): {
            const playlistID = sourceURL.split('/playlist/')[1].split('?')[0];
            return {source: 'playlist', id: playlistID};
        }
        case sourceURL.includes('album'): {
            const albumID = sourceURL.split('/album/')[1].split('?')[0];
            return {source: 'album', id: albumID};
        }
        default:
            return null;
    }
}

function _getSpotifyEndpoint(source, id){
    if(source === 'playlist'){
        return spotifyEndpoints.playlist.replace('{playlist_id}', id);
    } else if(source === 'album'){
        return spotifyEndpoints.album.replace('{id}', id);
    } else {
        return null;
    }
}

export async function getSpotifyMusicData(sourceURL){
    const sourceInfo = _getMusicSourceAndId(sourceURL);
    const endpoint = _getSpotifyEndpoint(sourceInfo.source, sourceInfo.id);

    if(!endpoint){
        return null;
    }
}