import React, { Component } from 'react';

import Styles from '../Scheduler/styles.m.css';

class Footer extends Component {
    render () {
        return (
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
        );
    }
}
export default Footer;
