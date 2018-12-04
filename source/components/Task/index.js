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
        isEditing:   false,
        editMessage: '',
    };

    _removeTask = () => {
        const { _removeTask, id } = this.props;

        _removeTask(id);
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

    render () {
        const { id, message, created, completed, favorite } = this.props;
        const { isEditing, editMessage } = this.state;

        
        const messageTask = () => {
            if (!editMessage) {
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
