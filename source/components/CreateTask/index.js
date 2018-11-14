import React, { Component } from 'react';

class CreateTask extends Component {
    render () {
        return (
            <form>
                <input
                    maxLength = '50'
                    placeholder = 'Описaние моей новой задачи'
                    type = 'text'
                    value = ''
                />
                <button>Добавить задачу</button>
            </form>
        );
    }
}
export default CreateTask;
