// Core
import React, { Component } from 'react';
import moment from 'moment';

import Task from '../Task';

// Instruments
import Styles from './styles.m.css';
import { getUniqueID, sortTasksByGroup } from 'instruments';
import { api, TOKEN } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Components
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
        isSpinning: false,
        newMessage: '',
        searchTask: '',
    };
    componentDidMount () {
        this._fetchTasksAsync();
    }
    _fetchTasksAsync = async () => {
        const tasks = await api.fetchTasks();

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

    _createTaskAsync = async (newMessage) => {

        const task = await api.createTask(newMessage);

        this.setState(({ tasks }) => ({
            tasks:      [task, ...tasks],
            isSpinning: false,
        }));
    };

    _updateNewTaskMessage = (event) => {
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

        this._createTaskAsync(newMessage);

        this.setState({
            newMessage: '',
            searchTask: '',
        });
    };

    _removeTaskAsync = async (id) => {

        await api.removeTask(id);

        const newTasks = this.state.tasks.filter((task) => {
            return task.id !== id;
        });

        this.setState({ tasks: newTasks });
    };

    _favoriteTask = async (id) => {
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
        const updateTask = favoriteSetState;

        await api.updateTask(updateTask);

    };
    _completedTask = async (id) => {
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
        const updateTask = completedSetState;

        await api.updateTask(updateTask);
    };
    _updateTasksFilter = (event) => {
        event.preventDefault();

        this.setState({ searchTask: event.target.value });
    };
    _submitOnEnter = (event) => {
        const enterKey = event.key === 'Enter';

        if (enterKey) {
            event.preventDefault();
        }
    };
    _getAllCompleted = async () => {
        const completedTask = this.state.tasks.map((task) => {
            return { ...task, completed: true };
        });

        this.setState({ tasks: completedTask });
        const updateTask = completedTask;

        await api.updateTask(updateTask);
    };

    _updateTaskMessage = (id, updateTask) => {
        console.log(id);

        // const completedTask = this.state.tasks.map(task => {
        //   if(task.id === id){

        //       return [{ task: updateTask}, ...tasks];
        //   }
        // });

        // this.setState({ tasks: completedTask });

        // await api.updateTask(completedTask);
    }

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
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateNewTaskMessage = { this._updateNewTaskMessage }
                />
            );
        });

        const completed = tasks.every((task) => {
            return task.completed;
        });

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>

                        <input
                            onChange = { this._updateTasksFilter }
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
                                onChange = { this._updateNewTaskMessage }
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
                        <Checkbox
                            onClick = { this._getAllCompleted }
                            inlineBlock
                            checked = { completed }
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
