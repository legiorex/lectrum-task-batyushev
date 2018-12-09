// Core
import React, { Component } from 'react';
import { Transition, CSSTransition, TransitionGroup } from "react-transition-group";

// Instruments
import Styles from './styles.m.css';
import { sortTasksByGroup } from 'instruments';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Components
import Task from "../Task";
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
        isSpinning: false,
        newMessage: '',
        searchTask: '',
    };

    _setTasksFetchingState = (state) => {

        this.setState({ isSpinning: state });

    };

    componentDidMount () {
        this._fetchTasksAsync();
    }
    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);
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
        this._setTasksFetchingState(true);
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
        this._setTasksFetchingState(true);
        await api.removeTask(id);

        const newTasks = this.state.tasks.filter((task) => {
            return task.id !== id;
        });

        this.setState({ tasks: newTasks, isSpinning: false });
    };

    _favoriteTask = async (id) => {
        this._setTasksFetchingState(true);
        const favoriteSetState = this.state.tasks.map((task) => {
            task.id === id ? task.favorite = !task.favorite : task;

            return task;
        });

        await api.updateTask(favoriteSetState);
        this.setState({ tasks: favoriteSetState, isSpinning: false });

    };
    _completedTask = async (id) => {
        this._setTasksFetchingState(true);
        const completedSetState = this.state.tasks.map((task) => {
            task.id === id ? task.completed = !task.completed : task;

            return task;
        });

        await api.updateTask(completedSetState);
        this.setState({ tasks: completedSetState, isSpinning: false });
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
    _completeAllTasksAsync = async () => {
        this._setTasksFetchingState(true);
        const completedTask = this.state.tasks.map((task) => {
            return { ...task, completed: true };
        });

        await api.completeAllTasks(completedTask);
        this.setState({ tasks: completedTask, isSpinning: false });
    };

    _updateTaskMessage = async (updateTask) => {

        this._setTasksFetchingState(true);

        const editMessageTask = this.state.tasks.map((task) =>
            task.id === updateTask.id ? updateTask : task
        );

        await api.updateTask(editMessageTask);
        this.setState({ tasks: editMessageTask, isSpinning: false });
    };

    render () {
        const { tasks, newMessage, searchTask, isSpinning } = this.state;

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
                <CSSTransition
                    classNames = { {
                        enter:       Styles.postInStart,
                        enterActive: Styles.postInEnd,
                        exit:        Styles.postOutStart,
                        exitActive:  Styles.postOutEnd,
                    } }
                    key = { task.id }
                    timeout = { {
                        enter: 500,
                        exit:  400,
                    } }>
                    <TransitionGroup>
                        <Task

                            { ...task }
                            _completedTask = { this._completedTask }
                            _favoriteTask = { this._favoriteTask }
                            _removeTaskAsync = { this._removeTaskAsync }
                            _updateTaskMessage = { this._updateTaskMessage }
                        />
                    </TransitionGroup>

                </CSSTransition>

            );
        });

        const completed = tasks.every((task) => {
            return task.completed;
        });

        return (<section className = { Styles.scheduler }>
            <main>
                <Spinner isSpinning = { isSpinning } />
                <header>
                    <h1>Планировщик задач</h1>

                    <input onChange = { this._updateTasksFilter } onKeyPress = { this._submitOnEnter } placeholder = 'Поиск' type = 'search' value = { searchTask } />
                </header>
                <section>
                    <form onSubmit = { this._handleFormSubmit }>
                        <input maxLength = '50' placeholder = 'Описaние моей новой задачи' type = 'text' value = { newMessage } onChange = { this._updateNewTaskMessage } />
                        <button type = 'submit'>Добавить задачу</button>
                    </form>
                    <div>
                        <ul>
                            <div style = { { position: "relative" } }>
                                <TransitionGroup>{tasksJSX}</TransitionGroup>
                            </div>
                        </ul>
                    </div>
                </section>
                <footer>
                    <Checkbox onClick = { this._completeAllTasksAsync } inlineBlock checked = { completed } color1 = '#363636' color2 = '#FFF' />
                    <span className = { Styles.completeAllTasks }>
                  Все задачи выполнены
                    </span>
                </footer>
            </main>
        </section>);
    }
}
