import './Track.css';
import React from 'react';

export default class Track extends React.Component {
  constructor(props) {
    super(props)

    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
  }

  renderAction() {
      if (this.props.isRemoval) {
        return <button className='Track-action' onClick={this.removeTrack}>-</button>;
      } else {
        return <button className='Track-action' onClick={this.addTrack} >+</button>;
      }
  }

  addTrack() {
    this.props.onAdd(this.props.track)
  }

  removeTrack() {
    this.props.onRemove(this.props.track)
  }

  unPackArtists() {
    let maxIndex = this.props.track.artists.length -1
    return this.props.track.artists.map((artist, index )=> 
    <a href={artist.external_urls.spotify} target="_blank" rel="noreferrer noopener">{artist.name}{this.artistSpacing(index,maxIndex)}</a>)
  }

  artistSpacing(index, maxIndex) {
    if(index < maxIndex) return ", "
  }

  render() {  
    console.log(this.unPackArtists())
    return (
        <div className="Track">
            <div className="Track-information">
              <a href={this.props.track.url} target="_blank" rel="noreferrer noopener"><h3>{this.props.track.name}</h3></a>
                <p>{this.unPackArtists()} | <a href={this.props.track.albumUrl} target="_blank" rel="noreferrer noopener">{this.props.track.album}</a></p>
                <audio
                  controls
                  src={this.props.track.preview} >
                </audio>
            </div>
            {this.renderAction()}
        </div>
    );
  }
}