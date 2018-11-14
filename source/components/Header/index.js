import React, { Component } from 'react';

class Header extends Component {
    render () {
        return (
            <header>
                <h1>Планировщик задач</h1>
                <input placeholder = 'Поиск' type = 'search' value = '' />
            </header>
        );
    }
}
export default Header;
