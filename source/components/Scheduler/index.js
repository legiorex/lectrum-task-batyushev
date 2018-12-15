// Core
import React, { Component } from 'react';

import FlipMove from 'react-flip-move';

// Instruments
import Styles from './styles.m.css';
import { sortTasksByGroup } from 'instruments';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Components
import Task from '../Task';
import Spinner from '../Spinner';
import Checkbox from '../../theme/assets/Checkbox';
export default class Scheduler extends Component {
    state = {
        tasks: [
            {
                id:        '',
                message:   '',
                completed: '',
                favorite:  '',
                created:   '',
            }
        ],
        isTasksFetching: false,
        newTaskMessage:  '',
        tasksFilter:     '',
    };

    _setTasksFetchingState = (state) => {
        this.setState({ isTasksFetching: state });
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }
    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);
        const tasks = await api.fetchTasks();

        this.setState({
            tasks,
            isTasksFetching: false,
        });
    };

    _createTaskAsync = async ( event) => {

        const { newTaskMessage } = this.state;

        if (!newTaskMessage) {
            return null;
        } 

        this._setTasksFetchingState(true);
        event.preventDefault();
        const task = await api.createTask(newTaskMessage);
        

        this.setState(({ tasks }) => ({
            tasks:           [task, ...tasks],            
            newTaskMessage:  '',
        }));
        this._setTasksFetchingState(false);
    };

    _updateNewTaskMessage = (event) => {
        this.setState({ newTaskMessage: event.target.value });
    };

    _updateTaskAsync = async (updateTask) => {
        this._setTasksFetchingState(true);
        await api.updateTask(updateTask);
        this._setTasksFetchingState(false);
    }


    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);
        await api.removeTask(id);

        const newTasks = this.state.tasks.filter((task) => {
            return task.id !== id;
        });

        this.setState({ tasks: newTasks });
        this._setTasksFetchingState(false);
    };

    _favoriteTask = async (id) => {
        this._setTasksFetchingState(true);
        const favoriteSetState = this.state.tasks.map((task) => {
            task.id === id ? task.favorite = !task.favorite : task;

            return task;
        });

        await api.updateTask(favoriteSetState);
        this.setState({ tasks: favoriteSetState, isTasksFetching: false });
    };
    _completedTask = async (id) => {
        this._setTasksFetchingState(true);
        const completedSetState = this.state.tasks.map((task) => {
            task.id === id ? task.completed = !task.completed : task;

            return task;
        });

        await api.updateTask(completedSetState);
        this.setState({ tasks: completedSetState, isTasksFetching: false });
    };
    _updateTasksFilter = (event) => {
        event.preventDefault();

        this.setState({ tasksFilter: event.target.value });
    };
    _submitOnEnter = (event) => {
        const enterKey = event.key === 'Enter';

        if (enterKey) {
            event.preventDefault();
        }
    };
    _completeAllTasksAsync = async () => {

        if (this._getAllCompleted()) {
            return null;
        }
        this._setTasksFetchingState(true);
        const completedTask = this.state.tasks.map((task) => {
            return { ...task, completed: true };
        });

        await api.completeAllTasks(completedTask);
        this.setState({ tasks: completedTask});
        this._setTasksFetchingState(false);
    };

    _updateTaskMessage = async (updateTask) => {
        this._setTasksFetchingState(true);

        const editMessageTask = this.state.tasks.map(
            (task) => task.id === updateTask.id ? updateTask : task
        );

        await api.updateTask(editMessageTask);
        this.setState({ tasks: editMessageTask, isTasksFetching: false });
    };

    _getAllCompleted = () => {
        return (
            this.state.tasks.every((task) => {
                return task.completed;
            })
        );
    }

    render () {
        const { tasks, newTaskMessage, tasksFilter, isTasksFetching } = this.state;

        const filterTask = tasks.filter((task) => {
            // поиск задач
            return task.message
                .toUpperCase()
                .includes(tasksFilter.toUpperCase());
        });

        const sortTask = sortTasksByGroup(filterTask); // фильтрация задач

        const tasksJSX = sortTask.map((task) => {
            // рендер массива задач и передача пропсов
            return (

                <Task
                    key = { task.id }
                    { ...task }
                    _completedTask = { this._completedTask }
                    _favoriteTask = { this._favoriteTask }
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskMessage = { this._updateTaskMessage }
                />

            );
        });

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isTasksFetching = { isTasksFetching } />
                    <header>
                        <h1>Планировщик задач</h1>

                        <input
                            onChange = { this._updateTasksFilter }
                            onKeyPress = { this._submitOnEnter }
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { tasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit={this._createTaskAsync }>
                            <input
                                maxLength = '50'
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button type = 'submit'>Добавить задачу</button>
                        </form>
                        <div>
                            <ul>
                                <div style = { { position: 'relative' } }>
                                    <FlipMove
                                        duration = { 500 }
                                        enterAnimation = 'accordionVertical'
                                        leaveAnimation = 'accordionVertical'
                                        staggerDurationBy = '30'
                                        typeName = 'ul'>
                                        {tasksJSX}
                                    </FlipMove>

                                </div>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            onClick = { this._completeAllTasksAsync }
                            inlineBlock
                            checked = { this._getAllCompleted() }
                            color1 = '#363636'
                            color2 = '#FFF'
                        />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
