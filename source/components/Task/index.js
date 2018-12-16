// Core
import React, { PureComponent, createRef } from "react";
import moment from "moment";

// Instruments
import Styles from "./styles.m.css";

// Components
import Checkbox from "../../theme/assets/Checkbox";
import Star from "../../theme/assets/Star";
import Edit from "../../theme/assets/Edit";
import Remove from "../../theme/assets/Remove";

export default class Task extends PureComponent {
    state = {
        isTaskEditing: false,
        newMessage:    this.props.message,
    };

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

    taskInput = createRef();

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;

        _updateTaskAsync(this._getTaskShape({ favorite: !favorite }));
    };
    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;

        _updateTaskAsync(this._getTaskShape({ completed: !completed }));
    };

    _setTaskEditingState = (edit) => {
        this.setState(
            { isTaskEditing: edit },

            () => {
                if (edit) {
                    this.taskInput.current.focus();
                }
            }
        );
    };

    _updateTaskMessageOnClick = () => {
        if (this.state.isTaskEditing) {
            this._updateTask();

            return null;
        }

        this._setTaskEditingState(true);
    };

    _updateNewTaskMessage = (event) => {
        this.setState({ newMessage: event.target.value });
    };

    _updateTask = () => {
        const { message, _updateTaskAsync } = this.props;
        const { newMessage } = this.state;

        if (newMessage === message) {
            this._setTaskEditingState(false);

            return null;
        }
        this._setTaskEditingState(false);

        _updateTaskAsync(this._getTaskShape({ message: newMessage }));
    };

    _cancelUpdatingTaskMessage = () => {
        this.setState({ newMessage: this.props.message });
    };

    _updateTaskMessageOnKeyDown = (event) => {
        if (this.state.newMessage === "") {
            return null;
        }
        if (event.key === "Enter") {
            this._updateTask();
            this._setTaskEditingState(false);
        } else if (event.key === "Escape") {
            this._setTaskEditingState(false);
            this._cancelUpdatingTaskMessage();
        }
    };

    render () {
        const { id, created, completed, favorite } = this.props;
        const { isTaskEditing, newMessage } = this.state;

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        inlineBlock
                        onClick = { this._toggleTaskCompletedState }
                    />

                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { newMessage }
                    />
                </div>

                <div className = { Styles.actions }>
                    <Star
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        onClick = { this._updateTaskMessageOnClick }
                        className = { Styles.updateTaskMessageOnClick }
                        checked = { isTaskEditing }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                    />
                    <Remove
                        className = { Styles.removeTask }
                        onClick = { this._removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        inlineBlock
                    />
                </div>
            </li>
        );
    }
}
