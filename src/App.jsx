import React from "react";
import "./App.css";
import queryString from "query-string";
import Themetoggle from "./component/Themetoggle";
import PlaylistCounter from "./component/PlaylistCounter";
import HoursCounter from "./component/HoursCounter";
import Followers from "./component/Followers";
import Filter from "./component/Filter";
import Playlist from "./component/Playlist";
import Signin from "./component/Signin";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serverData: {},
      filterString: "",
    };
  }
  componentDidMount() {
    let accessToken = queryString.parse(window.location.search).access_token;
    if (!accessToken) return;

    const user = async () => {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      const data = await response.json();
      this.setState({
        user: {
          name: data.display_name,
          href: data.external_urls.spotify,
          profile: data.images[0].url,
          followers: data.followers.total,
        },
      });
    };

    const userPlaylist = async () => {
      const response = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      const playlistData = await response.json();
      const playlists = playlistData.items;
      const trackDataPromises = playlists.map((item) => {
        const trackhref = async () => {
          const tracksResponse = await fetch(item.tracks.href, {
            headers: { Authorization: "Bearer " + accessToken },
          });
          return tracksResponse.json();
        };
        return trackhref();
      });
      return Promise.all(trackDataPromises).then((trackDatas) => {
        trackDatas.forEach((trackData, i) => {
          playlists[i].trackDatas = trackData.items
            .map((item) => item.track)
            .map((trackData) => ({
              name: trackData.name,
              duration: trackData.duration_ms / 1000,
            }));
        });
        this.setState({
          playlists: playlists.map((item) => {
            return {
              name: item.name,
              id: item.id,
              imageUrl: item.images[0].url,
              songs: item.trackDatas.slice(0, 3),
              uri: item.uri,
            };
          }),
        });
      });
    };

    user().catch(
      (err) => console.error(err) + console.log(err + "User async function.")
    );
    userPlaylist().catch(
      (err) =>
        console.error(err) + console.log(err + "Playlist async function.")
    );
  }
  render() {
    let playlistToRender =
      this.state.user && this.state.playlists
        ? this.state.playlists.filter((playlist) => {
            let matchesPlaylist = playlist.name
              .toLowerCase()
              .includes(this.state.filterString.toLowerCase());
            let matchesSong = playlist.songs.find((song) =>
              song.name
                .toLowerCase()
                .includes(this.state.filterString.toLowerCase())
            );
            return matchesPlaylist || matchesSong;
          })
        : [];
    return (
      <div className="App">
        {this.state.user ? (
          <div>
            <Themetoggle />
            <h1
              style={{
                fontSize: "calc(35px + 2vmin)",
                margin: "2.rem",
              }}
            >
              <a
                style={{
                  backgroundImage: `url(${this.state.user.profile})`,
                  backgroundSize: "cover",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
                className="App-link"
                target="_blank"
                rel="noopener noreferrer"
                href={this.state.user.href}
              >
                {this.state.user.name}
              </a>
              's playlists
            </h1>
            <PlaylistCounter playlists={playlistToRender} />
            <Followers user={this.state.user} />
            <HoursCounter playlists={playlistToRender} />
            <Filter
              onTextChange={(text) => {
                this.setState({ filterString: text });
              }}
            />
            {playlistToRender.map((playlist) => (
              <Playlist playlist={playlist} key={playlist.id} />
            ))}
          </div>
        ) : (
          <div>
            <Signin />
          </div>
        )}
      </div>
    );
  }
}

export default App;
