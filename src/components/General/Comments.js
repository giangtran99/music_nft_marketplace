import { Comment, Avatar, Form, Button, List, Input, Tooltip } from 'antd';
import moment from 'moment';
import React from 'react'
import { request } from '../../helpers/utils';

const { TextArea } = Input;

const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props} />}
    />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button className="text-black" htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Add Comment
            </Button>
        </Form.Item>
    </>
);

class CommentComponents extends React.Component {

    state = {
        currentUser: JSON.parse(localStorage.getItem("user")),

        comments: [],
        submitting: false,
        value: '',
    };


    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });

        let body = {
            content: this.state.value,
            metamask_address: this.props.metamask_address,
            nft_id: this.props.nft_id,
        }

        request("/api/comments/create", body, {}, "POST")
        setTimeout(() => {
            this.setState({
                submitting: false,
                value: '',
                comments: [
                    {
                        author: this.state.currentUser.name,
                        avatar: this.state.currentUser.avatar_picture ? 
                        `${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${this.state.currentUser.avatar_picture}` : 
                        "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
                        content: <p>{this.state.value}</p>,
                        datetime: moment().fromNow(),
                    },
                    ...this.state.comments,
                ],
            });
        }, 1000);
    };

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    async componentDidMount() {
        const result = await request(`/api/comments/nft/${this.props.nft_id}`, {}, {}, "GET")
        console.log("@@result", result)
        this.setState({
            comments: result.map(item => {
                return {
                    author: <a href={`/creator/${item.metamask_address}`}>{item.user_name}</a>,
                    avatar: item.avatar_picture ? `${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${item.avatar_picture}` 
                    : "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
                    content: <p>{item.content}</p>,
                    datetime: moment(new Date(item.created_at)).fromNow(),
                }

            })
        })
    }
    render() {
        const { comments, submitting, value } = this.state;

        return (
            <>
                {localStorage.getItem("token") ?
                    <Comment
                        avatar={<Avatar src={this.state.currentUser.avatar_picture ? 
                            `${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${this.state.currentUser.avatar_picture}`
                            : "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"}
                            alt={this.state.currentUser.name} />}
                        content={
                            <Editor
                                onChange={this.handleChange}
                                onSubmit={this.handleSubmit}
                                submitting={submitting}
                                value={value}
                            />
                        }
                    />
                    : null}
                {comments.length > 0 && <CommentList comments={comments} />}

            </>
        );
    }
}

export default CommentComponents;