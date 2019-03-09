import React, { Component, Fragment } from 'react';
import './SearchUsers.css';

class SearchUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: "",
            result: []
        }
        this.updateInputValue = this.updateInputValue.bind(this);
    }

    updateInputValue(e) {
        this.setState({
            inputValue: e.target.value
        });
        if (e.target.value.length) {
            fetch('https://api.github.com/search/users?q=' + e.target.value + '+sort:followers')
                .then(res => res.json())
                .then(res => {
                    if (res.items) {
                        let tableRows = res.items.map((user, i) => {
                            return <tr key={i}>
                                <td>{user.login}</td>
                                <td>{user.score}</td>
                            </tr>
                        })
                        this.setState({ result: tableRows });
                        // console.log(this.state.result);
                    }
                })
                .catch(e => console.error(e));
        }
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
                                <div className="card col-lg-4 col-md-4 noSearchWord">
                                    <h4>Enter something to search!!</h4>
                                </div>
                        }
                    </div>
                </nav>
            </Fragment>
        )
    }
}
export default SearchUsers;