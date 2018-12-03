// Core
import React, { Component } from 'react';
import moment from 'moment';

import Task from '../Task';

// Instruments
import Styles from './styles.m.css';
import { getUniqueID, sortTasksByGroup } from 'instruments';
import { api, TOKEN } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    state = {
        tasks: [
            {
                id:        '1',
                message:   'Тестовая задача 1',
                completed: true,
                favorite:  true,
                created:   1543662272,
            },
            {
                id:        '2',
                message:   'Тестовая задача 2',
                completed: true,
                favorite:  false,
                created:   1543662273,
            },
            {
                id:        '3',
                message:   'Тестовая задача 3',
                completed: true,
                favorite:  false,
                created:   1543662274,
            },
            {
                id:        '4',
                message:   'Тестовая задача 4',
                completed: true,
                favorite:  false,
                created:   1543662275,
            }
        ],
        isSpinning: false,
        newMessage: '',
        searchTask: '',
    };
    componentDidMount () {
        this._fetchTasks();
    }

    _fetchTasks = async () => {
        const response = await fetch(api, {
            method: 'GET',
        });
        // console.log(response.json());
        const { data: tasks } = await response.json();

        this.setState({
            tasks,
            isSpinning: false,
        });

    };

    // _createTask = (newMessage) => {
    //     const task = {
    //         id:         getUniqueID(),
    //         message:    newMessage,
    //         completed:  false,
    //         favorite:   false,
    //         created:    moment.utc(),
    //         searchTask: '',
    //     };

    //     this.setState(({ tasks }) => ({
    //         tasks:      [task, ...tasks],
    //         isSpinning: false,
    //     }));
    // };

    _createTask = async (newMessage) => {
        const task = {
            id:         getUniqueID(),
            message:    newMessage,
            completed:  false,
            favorite:   false,
            created:    moment.utc(),
            searchTask: '',
        };

        const response = await fetch(api, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ task }),
        });
        const { data: tasks } = await response.json();

        this.setState(({ tasks }) => ({
            tasks:      [task, ...tasks],
            isSpinning: false,
        }));
    };
    _updateMessage = (event) => {
        this.setState({ newMessage: event.target.value });
    };

    _handleFormSubmit = (event) => {
        event.preventDefault();
        this._submitTask();
    };

    _submitTask = () => {
        const { newMessage } = this.state;

        if (!newMessage) {
            return null;
        }

        this._createTask(newMessage);
        this.setState({
            newMessage: '',
            searchTask: '',
        });
    };

    _removeTask = (id) => {
        const newTasks = this.state.tasks.filter((task) => {
            return task.id !== id;
        });

        this.setState({ tasks: newTasks });
    };
    _favoriteTask = (id) => {
        const favoriteSetState = this.state.tasks.map((task) => {
            if (task.id === id) {
                if (task.favorite === false) {
                    return {
                        ...task,
                        favorite: true,
                    };
                }

                return {
                    ...task,
                    favorite: false,
                };
            }

            return task;
        });

        this.setState({
            tasks: favoriteSetState,
        });
    };
    _completedTask = (id) => {
        const completedSetState = this.state.tasks.map((task) => {
            if (task.id === id) {
                if (!task.completed) {
                    return { ...task, completed: true };
                }

                return { ...task, completed: false };
            }

            return task;
        });

        this.setState({ tasks: completedSetState });
    };
    _searchTask = (event) => {
        event.preventDefault();

        this.setState({ searchTask: event.target.value });
    };
    _submitOnEnter = (event) => {
        const enterKey = event.key === 'Enter';

        if (enterKey) {
            event.preventDefault();
        }
    };
    _completedTaskAll = () => {
        const completedTask = this.state.tasks.map((task) => {
            return { ...task, completed: true };
        });

        this.setState({ tasks: completedTask });
    };

    // _etidTask = (id) => { };

    _onChangeTask = (id, event) => {
        const editMessage = this.state.tasks.map((task) => {
            if (task.id === id) {
                return { ...task, message: event.target.value };
            }

            return task;
        });

        this.setState({ tasks: editMessage });
        console.log(e.target.value);
        console.log(id);
        console.log(editMessage);
    };

    render () {
        const { tasks, newMessage, searchTask } = this.state;

        const filterTask = tasks.filter((task) => {
            // поиск задач
            return task.message
                .toUpperCase()
                .includes(searchTask.toUpperCase());
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
                    _onChangeTask = { this._onChangeTask }
                    _removeTask = { this._removeTask }
                />
            );
        });

        const completedJSX = tasks.every((task) => {
            return task.completed;
        })
            ? '#363636'
            : '#fff';

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>

                        <input
                            onChange = { this._searchTask }
                            onKeyPress = { this._submitOnEnter }
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { searchTask }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._handleFormSubmit }>
                            <input
                                maxLength = '50'
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newMessage }
                                onChange = { this._updateMessage }
                            />
                            <button type = 'submit'>Добавить задачу</button>
                        </form>
                        <div>
                            <ul>
                                <div style = { { position: 'relative' } }>
                                    {tasksJSX}
                                </div>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <div>
                            <svg
                                onClick = { this._completedTaskAll }
                                version = '1.1'
                                viewBox = '0 0 27 27'>
                                <g>
                                    <rect
                                        fill = { completedJSX }
                                        height = '25'
                                        rx = '5'
                                        ry = '5'
                                        stroke = '#363636'
                                        width = '25'
                                        x = '1'
                                        y = '1'
                                    />
                                    <path
                                        d = 'M22.12 6c-3.12 3.16-6.84 6.36-10.23 9.64l-5.42-4.05L4 14.84l6.78 5.08L12.23 21l1.25-1.25C17 16.2 21.29 12.6 25 8.89z'
                                        fill = '#fff'
                                    />
                                </g>
                            </svg>
                        </div>
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
