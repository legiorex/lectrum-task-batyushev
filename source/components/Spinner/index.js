// Core
import React, { Component } from "react";

// Instruments
import Styles from "./styles.m.css";

export default class Spinner extends Component {
    render () {
        const { isTasksFetching } = this.props;

        return isTasksFetching ? <div className={Styles.spinner} /> : null;
    }
}
