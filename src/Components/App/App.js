import './App.css';
import React from 'react';
import Playlist from '../Playlist/Playlist'
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Spotify from '../../util/Spotify';

/* Note to self: did not complete steps 96-99 on https://www.codecademy.com/paths/full-stack-engineer-career-path/tracks/fscp-22-react-part-ii/modules/wdcp-22-jammming/projects/jammming-prj to Deploy */

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
      searchResults: [],
      playlistTracks: [],
      allResults: [],
      playlistName: "New Playlist"
    }

    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }

  addTrack(track){
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    else {
      this.setState(prevState => ({
        playlistTracks: [...prevState.playlistTracks, track],
        searchResults: prevState.searchResults.filter(song => song.id !== track.id)
      }));
    }
  }

  removeTrack(track){
    let playlistIds = [];
    if (this.state.playlistTracks.length > 1) {
      playlistIds = [...this.state.playlistTracks.id]
      playlistIds.pop(track.id)
    }
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      this.setState(prevState => ({
        playlistTracks: prevState.playlistTracks.filter(song => song.id !== track.id),
        searchResults: prevState.allResults.filter(song => !playlistIds.includes(song.id))
      }));
    }
    else {
      return;
    }
  }

  updatePlaylistName(name){
    this.setState({playlistName: name})
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(song => song.uri)
    Spotify.savePlayList(this.state.playlistName, trackUris)
    this.setState(prevState =>({
      playlistName: "New Playlist",
      playlistTracks: [],
      searchResults: prevState.allResults
    }))
  }

  search(term) {
    let playlistIds = [];
    if (this.state.playlistTracks.length !== 0) playlistIds = [...this.state.playlistTracks.id]
    Spotify.search(term)
      .then(searched => this.setState(prevState=>({
        searchResults: searched.filter(song => !playlistIds.includes(song.id)),  
        allResults: searched  
      })));
  }

  render() {
    Spotify.getAccessToken()
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults 
              searchResults={this.state.searchResults} 
              onAdd={this.addTrack} />
            <Playlist 
              playlistTracks={this.state.playlistTracks}
              playlistName={this.state.playlistName}
              onRemove={this.removeTrack} 
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}