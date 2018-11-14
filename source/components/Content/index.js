import React, { Component } from 'react';

import CreateTask from 'components/CreateTask';
import Tasks from 'components/Tasks';

class Content extends Component {
    render () {
        return (
            <section>
                <CreateTask />
                <Tasks />
            </section>
        );
    }
}
export default Content;
