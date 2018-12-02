// Core
import React, { PureComponent } from "react";
import moment from "moment";

// Instruments
import Styles from "./styles.m.css";

export default class Task extends PureComponent {
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

    _removeTask = () => {
        const { _removeTask, id } = this.props;

        _removeTask(id);
    };

    _favoriteTask = () => {
        const { _favoriteTask, id } = this.props;

        _favoriteTask(id);
    };
    _completedJSX = () => {
        const { completed } = this.props;

        if (completed === false) {
            return "#FFF";
        }

        return "#3B8EF3";
    };

    _favoriteJSX = () => {
        const { favorite } = this.props;

        if (favorite === false) {
            return (
                <path
                    d = 'M61.6 51.4l5.7 26.4L45 64.5 22.7 77.8l5.7-26.4-19.3-16 24.2-2.8L45 8.7l11.6 23.8 24.2 2.8-19.2 16.1zM88 31.3L59.9 28l-13-26.6C46.6.5 45.8 0 45 0s-1.6.5-1.9 1.4L30.1 28 2 31.3c-1.9 0-2.7 2.4-1.2 3.5L23 53.3l-6.4 29.9c-.4 1.4.6 2.6 1.9 2.6.4 0 .8-.1 1.1-.4L45 70.2l25.4 15.2c.4.3.8.4 1.1.4 1.2 0 2.3-1.2 1.9-2.6L67 53.3l22.2-18.5c1.5-1.1.7-3.5-1.2-3.5z'
                    fill = '#000'
                />
            );
        }

        return (
            <path
                d = 'M88 31.3L59.9 28l-13-26.6C46.6.5 45.8 0 45 0s-1.6.5-1.9 1.4L30.1 28 2 31.3c-1.9 0-2.7 2.4-1.2 3.5L23 53.3l-6.4 29.9c-.4 1.4.6 2.6 1.9 2.6.4 0 .8-.1 1.1-.4L45 70.2l25.4 15.2c.4.3.8.4 1.1.4 1.2 0 2.3-1.2 1.9-2.6L67 53.3l22.2-18.5c1.5-1.1.7-3.5-1.2-3.5z'
                fill = '#3B8EF3'
            />
        );
    };
    _completedTask = () => {
        const { _completedTask, id } = this.props;

        _completedTask(id);
    };

    render () {
        const { id, message, created } = this.props;

        return (
            <li className = { Styles.task } key = { id }>
                <div className = { Styles.content }>
                    <div
                        onClick = { this._completedTask }
                        className = { Styles.toggleTaskCompletedState }
                        style = { {
                            width:   25,
                            height:  25,
                            display: "inline-block",
                        } }>
                        <svg
                            style = { { width: 25, height: 25, display: "block" } }
                            version = '1.1'
                            viewBox = '0 0 27 27'>
                            <g>
                                <rect
                                    fill = { this._completedJSX() }
                                    height = '25'
                                    rx = '5'
                                    ry = '5'
                                    stroke = '#3B8EF3'
                                    style = { { strokeWidth: 2 } }
                                    width = '25'
                                    x = '1'
                                    y = '1'
                                />
                                <path
                                    d = 'M22.12 6c-3.12 3.16-6.84 6.36-10.23 9.64l-5.42-4.05L4 14.84l6.78 5.08L12.23 21l1.25-1.25C17 16.2 21.29 12.6 25 8.89z'
                                    fill = '#FFF'
                                />
                            </g>
                        </svg>
                    </div>
                    <div>
                        <input
                            disabled = ''
                            maxLength = '50'
                            type = 'text'
                            value = { message }
                        />
                        <div className = { Styles.timeTask }>
                            {moment.unix(created).format("MMMM D h:mm:ss a")}
                        </div>
                    </div>
                </div>

                <div className = { Styles.actions }>
                    <div
                        className = { Styles.toggleTaskFavoriteState }
                        onClick = { this._favoriteTask }
                        style = { {
                            width:   19,
                            height:  19,
                            display: "inline-block",
                        } }>
                        <svg
                            style = { { width: 19, height: 19, display: "block" } }
                            version = '1.1'
                            viewBox = '0 0 90 85.8'>
                            <g>{this._favoriteJSX()}</g>
                        </svg>
                    </div>
                    <div
                        className = { Styles.updateTaskMessageOnClick }
                        style = { {
                            width:   19,
                            height:  19,
                            display: "inline-block",
                        } }>
                        <svg
                            style = { { width: 19, height: 19, display: "block" } }
                            version = '1.1'
                            viewBox = '0 0 21 21'>
                            <g>
                                <path
                                    d = 'M19.4 3.1L18 1.7 8.6 11l1.4 1.4 9.4-9.3zM19.3.3l1.4 1.4c.4.4.4 1 0 1.4L10.5 13.3c-.1.1-.2.2-.3.2l-2.9 1c-.3.1-.7-.1-.8-.4v-.4l1-2.9c0-.1.1-.2.2-.3L17.9.3c.4-.4 1-.4 1.4 0zM17 9h1v9.5c0 1.4-1.1 2.5-2.5 2.5h-13C1.1 21 0 19.9 0 18.5v-13C0 4.1 1.1 3 2.5 3H12v1H2.5C1.7 4 1 4.7 1 5.5v13c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5V9z'
                                    fill = '#000'
                                />
                            </g>
                        </svg>
                    </div>
                    <div
                        onClick = { this._removeTask }
                        style = { {
                            width:   17,
                            height:  17,
                            display: "inline-block",
                        } }>
                        <svg
                            style = { { width: 17, height: 17, display: "block" } }
                            version = '1.1'
                            viewBox = '0 0 53.8 53.8'>
                            <g>
                                <path
                                    d = 'M53 49.5c1 1 1 2.6 0 3.5-.5.5-1.1.7-1.8.7-.6 0-1.3-.2-1.8-.7L26.9 30.4 4.3 53c-.5.5-1.1.7-1.8.7-.6 0-1.3-.2-1.8-.7-1-1-1-2.6 0-3.5l22.6-22.6L.7 4.3c-1-1-1-2.6 0-3.5 1-1 2.6-1 3.5 0l22.6 22.6L49.5.7c1-1 2.6-1 3.5 0 1 1 1 2.6 0 3.5L30.4 26.9 53 49.5z'
                                    fill = '#000'
                                />
                            </g>
                        </svg>
                    </div>
                </div>
            </li>
        );
    }
}
