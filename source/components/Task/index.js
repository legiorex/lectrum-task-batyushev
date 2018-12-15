// Core
import React, { PureComponent, createRef } from 'react';
import moment from 'moment';

// Instruments
import Styles from './styles.m.css';

// Components
import Checkbox from '../../theme/assets/Checkbox';
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

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
        isEditing:  false,
        newTaskMessage: this.props.message,
    };

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    _favoriteTask = () => {
        const { _favoriteTask, id } = this.props;

        _favoriteTask(id);
    };

    _setTaskEditingState = () => {
        const { isEditing } = this.state;

        this.setState(
            { isEditing: !isEditing },

            () => {
                if (!isEditing) {
                    this.taskInput.current.focus();
                }
            }
        );
    };

    _completedTask = () => {
        const { _completedTask, id } = this.props;

        _completedTask(id);
    };
    _onChangeTask = (event) => {
        this.setState({ newTaskMessage: event.target.value });
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const {
            id,
            created,
            completed,
            favorite,
            _updateTaskMessage,
        } = this.props;

        const { newTaskMessage } = this.state;

        if (event.key === 'Enter') {
            const updateTask = {
                id,
                message: newTaskMessage,
                created,
                favorite,
                completed,
            };

            this.setState({ isEditing: false });
            _updateTaskMessage(updateTask);
        } else if (event.key === 'Escape') {
            this.setState({
                isEditing:  false,
                newTaskMessage: this.props.message,
            });
        }
    };

    render () {
        const { id, created, completed, favorite } = this.props;
        const { isEditing, newTaskMessage } = this.state;

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
                            autoFocus
                            disabled = { !isEditing }
                            maxLength = '50'
                            onChange = { this._onChangeTask }
                            onKeyDown = { this._updateTaskMessageOnKeyDown }
                            ref = { this.taskInput }
                            type = 'text'
                            value = { newTaskMessage }
                        />
                        <div className = { Styles.timeTask }>
                            {moment(created).format('MMMM D h:mm:ss a')}
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
                        onClick = { this._setTaskEditingState }
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
