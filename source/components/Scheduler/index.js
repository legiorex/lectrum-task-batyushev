// Core
import React, { Component } from "react";

import FlipMove from "react-flip-move";

// Instruments
import Styles from "./styles.m.css";
import { sortTasksByGroup } from "instruments";
import { api } from "../../REST"; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

// Components
import Task from "../Task";
import Spinner from "../Spinner";
import Checkbox from "../../theme/assets/Checkbox";
export default class Scheduler extends Component {
    state = {
        tasks:           [],
        isTasksFetching: false,
        newTaskMessage:  "",
        tasksFilter:     "",
    };

    componentDidMount () {
        this._fetchTasksAsync();
    }
    _setTasksFetchingState = (state) => {
        this.setState({ isTasksFetching: state });
    };

    _fetchTasksAsync = async () => {
        this._setTasksFetchingState(true);
        const tasks = await api.fetchTasks();

        this.setState({ tasks });
        this._setTasksFetchingState(false);
    };

    _createTaskAsync = async (event) => {
        const { newTaskMessage } = this.state;

        if (!newTaskMessage) {
            return null;
        }

        this._setTasksFetchingState(true);
        event.preventDefault();
        const task = await api.createTask(newTaskMessage);

        this.setState(({ tasks }) => ({
            tasks:          [task, ...tasks],
            newTaskMessage: "",
        }));
        this._setTasksFetchingState(false);
    };

    _updateNewTaskMessage = (event) => {
        this.setState({ newTaskMessage: event.target.value });
    };

    _removeTaskAsync = async (id) => {
        this._setTasksFetchingState(true);
        await api.removeTask(id);

        const newTasks = this.state.tasks.filter((task) => {
            return task.id !== id;
        });

        this.setState({ tasks: newTasks });
        this._setTasksFetchingState(false);
    };

    _updateTaskAsync = async (updateTask) => {
        this._setTasksFetchingState(true);

        await api.updateTask(updateTask);

        this.setState(({ tasks }) => ({
            tasks: tasks.map(
                (task) => task.id === updateTask.id ? updateTask : task
            ),
        }));
        this._setTasksFetchingState(false);
    };

    _updateTasksFilter = (event) => {
        this.setState({
            tasksFilter: event.target.value.toLowerCase(),
        });
    };

    _completeAllTasksAsync = async () => {
        if (this._getAllCompleted()) {
            return null;
        }
        this._setTasksFetchingState(true);

        await api.completeAllTasks(this.state.tasks);

        const completedTask = this.state.tasks.map((task) => {
            return { ...task, completed: true };
        });

        this.setState({ tasks: completedTask });
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
        return this.state.tasks.every((task) => {
            return task.completed;
        });
    };

    render () {
        const {
            tasks,
            newTaskMessage,
            tasksFilter,
            isTasksFetching,
        } = this.state;

        const filterTask = tasks.filter((task) => {
            // поиск задач
            return task.message.toLowerCase().includes(tasksFilter);
        });

        const sortTask = sortTasksByGroup(filterTask); // фильтрация задач

        const tasksJSX = sortTask.map((task) => {
            // рендер массива задач и передача пропсов
            return (
                <Task
                    key = { task.id }
                    { ...task }
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskAsync = { this._updateTaskAsync }
                />
            );
        });

        return (
            <section className = { Styles.scheduler }>
                <Spinner isSpinning = { isTasksFetching }>
                    <div className = { Styles.Spinner } />
                </Spinner>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>

                        <input
                            onChange = { this._updateTasksFilter }
                            placeholder = 'Поиск'
                            type = 'search'
                            value = { tasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = { Styles.createTask }
                                maxLength = { 50 }
                                placeholder = 'Описaние моей новой задачи'
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div className = { Styles.overlay }>
                            <ul>
                                <FlipMove
                                    delay = { 0 }
                                    disableAllAnimations = { false }
                                    duration = { 400 }
                                    easing = 'ease-in-out'
                                    enterAnimation = 'elevator'
                                    leaveAnimation = 'elevator'
                                    maintainContainerHeight = { false }
                                    staggerDelayBy = { 0 }
                                    staggerDurationBy = { 0 }
                                    typeName = 'div'
                                    verticalAlignment = 'top'>
                                    {tasksJSX}
                                </FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            onClick = { this._completeAllTasksAsync }
                            checked = { this._getAllCompleted() }
                            color1 = '#363636'
                            color2 = '#fff'
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
