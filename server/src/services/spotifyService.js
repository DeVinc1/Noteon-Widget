import axios from 'axios';
import { getSpotifyAccessToken } from './spotifyAuth.js';

const spotifyEndpoints ={
    playlist: 'https://api.spotify.com/v1/playlists/{playlist_id}/items?fields=items(track(name,artists(name),album(images(url))))',
    album: 'https://api.spotify.com/v1/albums/{id}/tracks'
}

function _getMusicSourceAndId(sourceURL){
    if (!sourceURL || typeof sourceURL !== 'string') {
        return { source: null, id: null };
    }

    // Formato de URL de playlists do Spotify https://open.spotify.com/playlist/id000000000?si=code_000000000
    // Formato  de URL de albúm do Spotify https://open.spotify.com/intl-pt/album/id000000000?si=code_000000000
    const resourceMatch = sourceURL.match(/\/(playlist|album)\/([^/?]+)/); // IDs do Spotify não podem conter barras nem pontos, então essa Regex é suficiente

    if (resourceMatch) {
        return { source: resourceMatch[1], id: resourceMatch[2] };
    }

    return { source: null, id: null };
}

function _createSpotifyEndpoint(source, id){
    switch(true){
        case source === 'playlist': {
            return spotifyEndpoints.playlist.replace('{playlist_id}', id);
        }
        case source === 'album': {
            return spotifyEndpoints.album.replace('{id}', id);
        }
        default:
            return null;
    }
}

export async function getSpotifyMusicData(sourceURL){
    const sourceInfo = _getMusicSourceAndId(sourceURL);
    const endpoint = _createSpotifyEndpoint(sourceInfo.source, sourceInfo.id);

    if(!endpoint){
        return null;
    }

    const spotifyToken = await getSpotifyAccessToken();
    const responseMusicData = await axios.get(endpoint, {
        headers: {
            'Authorization': `Bearer ${spotifyToken}`
        }
    })

    if(sourceInfo.source === 'playlist'){
         //TODO: realizar sanitização dos dados como playlist
    }
    else if(sourceInfo.source === 'album'){
        //TODO: realizar sanitização dos dados como album
    }

    return null;
}