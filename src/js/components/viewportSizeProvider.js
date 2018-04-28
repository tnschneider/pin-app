import React, { Component } from 'react';
import PropTypes from 'prop-types';
export default class ViewportSizeProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewportHeight: window.innerHeight,
            viewportWidth: window.innerWidth
        }

        this.updateDimensions = () => {
            this.setState({
                viewportHeight: window.innerHeight,
                viewportWidth: window.innerWidth
            });
        }
    }

    static childContextTypes = {
        viewportHeight: PropTypes.number.isRequired,
        viewportWidth: PropTypes.number.isRequired
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener('resize', this.updateDimensions);
    }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateDimensions);
    }

    getChildContext() {
		return { 
            viewportHeight: this.state.viewportHeight,
            viewportWidth: this.state.viewportWidth
        };
    }
    
    render() {
        return this.props.children;
    }
}