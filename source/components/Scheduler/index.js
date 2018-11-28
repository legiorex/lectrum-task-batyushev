// Core
import React, { Component } from "react";

import Task from "../Task";

// Instruments
import Styles from "./styles.m.css";
import { getUniqueID } from "instruments";
import { api } from "../../REST"; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    constructor () {
        super();
        this._updateMessage = this._updateMessage.bind(this);
        this._handleFormSubmit = this._handleFormSubmit.bind(this);
        this._createTask = this._createTask.bind(this);
        this._removeTask = this._removeTask.bind(this);
        this._favoriteState = this._favoriteState.bind(this);
    }

    state = {
        tasks: [
            {
                id:        "it14f",
                message:   "Тестовая задача 1",
                completed: false,
                favorite:  true,
            },
            {
                id:        "153",
                message:   "Тестовая задача 2",
                completed: false,
                favorite:  false,
            }
        ],
        isSpinning: false,
        newMessage: "",
    };

    _createTask = (newMessage) => {
        const task = {
            id:        getUniqueID(),
            message:   newMessage,
            completed: false,
        };

        this.setState(({ tasks }) => ({
            tasks:      [task, ...tasks],
            isSpinning: false,
        }));
    };

    _updateMessage (event) {
        this.setState({ newMessage: event.target.value });
    }

    _handleFormSubmit (event) {
        event.preventDefault();
        this._submitTask();
    }

    _submitTask () {
        const { newMessage } = this.state;

        if (!newMessage) {
            return null;
        }

        this._createTask(newMessage);
        this.setState({ newMessage: "" });
    }

    _removeTask (id) {

        const newTasks = this.state.tasks.filter((task) => {

            return task.id !== id;
        });

        this.setState({ tasks: newTasks });
    }

    _favoriteState (id) {
        const newFavoriteState = this.state.tasks.map((task) => {
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
            
        });

        this.setState({
            tasks: newFavoriteState,
            isSpinning: false,
            newMessage: "",

        });

    }

    render () {
        const { tasks, newMessage } = this.state;

        const tasksJSX = tasks.map((task) => {
            return <Task key = { task.id } { ...task } _favoriteState = { this._favoriteState } _removeTask = { this._removeTask } />;
        });

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = 'Поиск' type = 'search' value = '' />
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
                                <div style = { { position: "relative" } }>
                                    {tasksJSX}
                                </div>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <div>
                            <svg version = '1.1' viewBox = '0 0 27 27'>
                                <g>
                                    <rect
                                        fill = '#363636'
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
