import React, { Component } from 'react'
import PropTypes from 'prop-types'
import wrapWithLoadData from './wrapWithLoadData'

class CommentInput extends Component {
    static propTypes = {
        onSubmit: PropTypes.func,
        data: PropTypes.any,
        saveData: PropTypes.func.isRequired
    }
    constructor (props) {
        super(props)
        this.state = {
            username: props.data,
            content: ''
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handleContentChange = this.handleContentChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleUsernameBlur = this.handleUsernameBlur.bind(this)
    }
    
    componentDidMount() {
        this.textarea.focus()
    }

    handleUsernameChange (event) {
        this.setState({
            username: event.target.value
        })
    }

    handleUsernameBlur (event) {
        this.props.saveData(event.target.value)
    }

    handleContentChange (event) {
        this.setState({
          content: event.target.value
        })
    }

    handleSubmit () {
        if (this.props.onSubmit) {
            const { username, content } = this.state
            this.props.onSubmit({
                username,
                content,
                createdTime: +new Date()
            })
        }
        this.setState({
            content: ''
        })
    }

    render () {
        return (
            <div className='comment-input'>
                <div className='comment-field'>
                    <span className='comment-field-name'>用户名：</span>
                    <div className='comment-field-input'>
                        <input
                            value={this.state.username}
                            onBlur={this.handleUsernameBlur}
                            onChange={this.handleUsernameChange}
                        />
                    </div>
                </div>
                <div className='comment-field'>
                    <span className='comment-field-name'>评论内容：</span>
                    <div className='comment-field-input'>
                        <textarea
                            value={this.state.content}
                            ref={(textarea) => this.textarea = textarea}
                            onChange={this.handleContentChange}
                        />
                    </div>
                </div>
                <div className='comment-field-button'>
                    <button onClick={this.handleSubmit}>发布</button>
                </div>
            </div>
        )
    }
}

CommentInput = wrapWithLoadData(CommentInput, 'username')
export default CommentInput