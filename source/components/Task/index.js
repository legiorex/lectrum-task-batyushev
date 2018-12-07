// Core
import React, { PureComponent, createRef } from 'react';
import moment from 'moment';

// Instruments
import Styles from './styles.m.css';
import { api, TOKEN } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Components
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';
import { isNull } from 'util';

export default class Task extends PureComponent {
    taskInput = createRef();
    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    state = {
        isEditing:   false,
        editMessage: null,
    };

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);

    };

    _favoriteTask = () => {
        const { _favoriteTask, id } = this.props;

        _favoriteTask(id);
    };

    _editTask = () => {
        const { isEditing } = this.state;

        if (!isEditing) {
            return this.setState({ isEditing: true });
        }

        return this.setState({ isEditing: false });
    };

    _completedTask = () => {
        const { _completedTask, id } = this.props;

        _completedTask(id);
    };
    _onChangeTask = (event) => {

        this.setState({ editMessage: event.target.value });

    };

    _updateTaskMessageOnKeyDown = (event) => {

        const { id, created, completed, favorite, _updateTaskMessage } = this.props;
        
        let { editMessage } = this.state;

        if (event.key === "Enter") {
            if (editMessage === "") {
                return null;
            }
            editMessage = event.target.value;
            const updateTask = { id, message: editMessage, created, favorite, completed };

            this.setState({ isEditing: false });
            _updateTaskMessage(updateTask);

        } else if (event.key === "Escape") {

            this.setState({ isEditing: false, editMessage: null });

        }

    }

    render () {
        const { id, message, created, completed, favorite } = this.props;
        const { isEditing, editMessage } = this.state;

        const messageTask = () => {
            if (editMessage === null) {
                return message;
            }

            return editMessage;
        };

        return (
            <li className = { Styles.task } key = { id }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        onClick = { this._completedTask }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                    />
                    <div>
                        <input
                            onChange = { this._onChangeTask }
                            onKeyDown = { this._updateTaskMessageOnKeyDown }
                            ref = { this.taskInput }
                            disabled = { !isEditing }
                            maxLength = '50'
                            type = 'text'
                            value = { messageTask() }
                        />
                        <div className = { Styles.timeTask }>
                            {moment.unix(created).format('MMMM D h:mm:ss a')}
                        </div>
                    </div>
                </div>

                <div className = { Styles.actions }>
                    <Star
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._favoriteTask }
                    />
                    <Edit
                        onClick = { this._editTask }
                        className = { Styles.updateTaskMessageOnClick }
                        inlineBlock
                        checked = { isEditing }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                    />
                    <Remove
                        onClick = { this._removeTask }
                        inlineBlock
                        color1 = '#3B8EF3'
                        color2 = '#000'
                    />
                </div>
            </li>
        );
    }
}
