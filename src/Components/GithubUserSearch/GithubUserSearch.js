import React, { Component, Fragment } from 'react';
import Rx from 'rx';
import './GithubUserSearch.css';
import { ClientID } from '../../config';

class GithubUserSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: "",
            result: [],
            error: false,
            errmsg: ""
        }
        this.updateInputValue = this.updateInputValue.bind(this);
    }

    updateInputValue(e) {
        this.setState({
            inputValue: e.target.value
        });
        let SearchBox = Rx.Observable.fromEvent(
            document.getElementById("search-box"), 'keyup')
            .map((event) => {
                return document.getElementById("search-box").value;
            });
            
        SearchBox
            .debounce(500)
            .distinctUntilChanged()
            .concatMap((searchTerm) => {
                return Rx.Observable.fromPromise(
                    fetch(`https://api.github.com/search/users?q=${searchTerm}+sort:followers?client_id=${ClientID}`)
                ).catch(() => Rx.Observable.empty());
            })
            .subscribe((response => {
                response.json().then(result => {
                    if (result.message) {
                        this.setState({ error: true, errmsg: result.message })
                    }
                    if (result.items) {
                        let tableRows = result.items.map((user, i) => {
                            return <tr key={i}>
                                <td>{user.login}</td>
                                <td>{user.score}</td>
                            </tr>
                        })
                        this.setState({ result: tableRows, error: false });
                    }
                })
            }));
    }

    handleSubmit(event) {
        event.preventDefault();
    }

    render() {
        return (
            <Fragment>
                <nav className="navbar navbar-nav navbar-default">
                    <div className="container">
                        <div className="col-lg-12 col-md-12 com-sm-12 col-12">
                            <form onSubmit={this.handleSubmit}>
                                <input autoFocus id="search-box" type="text" style={{ marginRight: '1%', float: 'left' }}
                                    className="searchInput col-4 col-sm-5 col-md-5 col-lg-5 form-control" placeholder="Search user..."
                                    value={this.state.inputValue} onChange={this.updateInputValue} />
                            </form>
                        </div>
                        {
                            (this.state.result.length && this.state.inputValue.length) ?
                                <table className="w3-table-all w3-card-4 result-table">
                                    <tbody>
                                        <tr>
                                            <th>First Name</th>
                                            <th>Points</th>
                                        </tr>
                                        {this.state.result}
                                    </tbody>
                                </table>
                                :
                                (!this.state.error) ?
                                    <div className="card col-lg-4 col-md-4 noSearchWord">
                                        <h4>Enter something to search!!</h4>
                                    </div> : ""
                        }
                        {
                            (this.state.error) ?
                                <div className="card col-lg-4 col-md-4 errorMessage">
                                    <h4> {this.state.errmsg} </h4>
                                </div> : ""
                        }
                    </div>
                </nav>
            </Fragment>
        )
    }
}
export default GithubUserSearch;