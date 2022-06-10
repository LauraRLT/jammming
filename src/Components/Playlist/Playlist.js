import './Playlist.css';
import TrackList from '../TrackList/TrackList'
import React from 'react';

export default class Playlist extends React.Component {
  constructor(props) {
    super(props)

    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
  }

  handleNameChange(e) {
    this.props.onNameChange(e.target.value)
  }

  handleFocus(e) {
    e.target.select();
  }

  render() {  
    return (
        <div className="Playlist">
          <p className='instructions'>Click Below to Change Playlist Name</p>
            <input value={this.props.playlistName} onChange={this.handleNameChange} onFocus={this.handleFocus}/>
                <TrackList 
                  tracks={this.props.playlistTracks} 
                  onRemove={this.props.onRemove}
                  isRemoval={true} />
            <button className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
        </div>
    );
  }
}