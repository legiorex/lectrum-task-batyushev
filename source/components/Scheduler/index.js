// Core
import React, { Component } from 'react';

// Components
import Header from 'components/Header';
import Content from 'components/Content';
import Footer from 'components/Footer';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')

export default class Scheduler extends Component {
    render () {
        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Header />
                    <Content />
                    <Footer />
                </main>
            </section>
        );
    }
}
console.log('test');
