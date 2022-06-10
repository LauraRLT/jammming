import './SearchResults.css';
import TrackList from '../TrackList/TrackList'
import React from 'react';

export default class SearchResults extends React.Component {
  render() {  
    return (
        <div className="SearchResults">
            <h2>Search Results</h2>
            <TrackList 
              tracks={this.props.searchResults} 
              onAdd={this.props.onAdd} 
              isRemoval={false} />
        </div>
    );
  }
}