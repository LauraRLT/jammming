const clientId = '4bf57038006f4f2c871f0853dad7cf1c'
const redirectUri = 'https://laurarlt-jammming.netlify.app/'
const spotifyUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;

let accessToken;

const Spotify = {
    getAccessToken(){
        if(this.accessToken){
            return accessToken;
        }
        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[0]);
            //Clear params, to get new access when token expires
            window.setTimeout(() => accessToken = '', expiresIn * 6000);
            //Line below basically deletes your access token
            //window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = spotifyUrl;
        }
    },

    search(term){
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`}

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term.replace(' ', '%20')}` , {headers: headers}
        /* instead of {headers: headers}
          {headers: {Authorization: `Bearer ${accessToken}`}
        }*/)
        .then(response => {return response.json();})
        .then(jsonResponse => {
            if(!jsonResponse.tracks){return [];}
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        });           
    },

    savePlayList(name, trackURIs){
        if(!name || !trackURIs.length){
            console.log('name and trakcuris not set');
            return;
        }
        const accessToken = Spotify.getAccessToken();
        //Uncomment line below to see access token in the console
        console.log(`savePlaylist() accessToken - ${accessToken}`);
        const headers = { Authorization: `Bearer ${accessToken}` }
        let userId;

        return fetch(`https://api.spotify.com/v1/me`, {headers: headers})
        .then(response => response.json())
        .then(jsonResponse => {
            userId = jsonResponse.id;
            //Uncomment line below to see user id in the console
            //console.log(`savePlaylist() userId - ${userId}`);
            //instead of  return fetch(`https://api.spotify.com/v1/me/users/${userId}/playlists`,

            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: name})
            })
            .then(response => response.json())
            .then(jsonResponse => { const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackURIs})
                });
            });
        });
    }
}
export default Spotify