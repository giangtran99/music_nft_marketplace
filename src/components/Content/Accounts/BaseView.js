import React, { Component, Fragment } from 'react';
import { Form, Input, Upload, Select, Button, Card, Row, Col, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './BaseView.less';
import { request } from '../../../helpers/utils';
import { toast } from 'react-toastify';
// import GeographicView from './GeographicView';
// import PhoneView from './PhoneView';
// import { getTimeDistance } from '@/utils/utils';
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient.create({ host: '127.0.0.1', port: process.env.REACT_APP_IPFS_API_PORT, protocol: 'http' });

const FormItem = Form.Item;
const { Option } = Select;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ value, onChange }) => {
  const [imageUrl, setImageUrl] = React.useState({})
  React.useEffect(() => {
    console.log("@@ngon ngon", value)
    if (value && typeof value === "string") {
      setImageUrl({
        source: `${process.env.REACT_APP_IPFS_URL}:${process.env.REACT_APP_IPFS_GATEWAY_PORT}/ipfs/${value}`
      })
    }
  }, [value])
  return (<Fragment>
    <div className={styles.avatar}>
      <Upload onChange={(data) => {
        let result = {}
        var src = URL.createObjectURL(data.file.originFileObj);
        result.source = src
        setImageUrl(result)

        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data.file.originFileObj);

        reader.onloadend = async () => {
          onChange(reader.result)
        }

      }} fileList={[]}>
        <div class="relative">
          <img width={200} height={200} src={value ? imageUrl?.source : "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"} alt="avatar" />
          <Button className="hidden" icon={<UploadOutlined />}></Button>
        </div>
      </Upload>
    </div>

  </Fragment>
  );
}


class BaseView extends Component {
  form = React.createRef();
  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    Object.keys(this.form.current.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      this.form.current.setFieldsValue(obj);
    });
  };


  getViewDom = ref => {
    this.view = ref;
  };
  async handleSubmit(values) {
    let currentUser = JSON.parse(localStorage.getItem("user"))
    console.log("@@@@this", values)
    let body
    if (typeof values.avatar_picture !== "string") {
      const fileAdded = await ipfs.add(values.avatar_picture);
      body = {
        description: values.description,
        name: values.name,
        avatar_picture: fileAdded.path
      }
    }
    else {
      body = {
        description: values.description,
        name: values.name,
        avatar_picture: values.avatar_picture
      }
    }

    const response = await request(`/api/users/update/${currentUser.metamask_address}`, body, {}, "POST")
    if (response) {
      let newStateCurrentUser = {
        ...currentUser,
        ["description"]: response.description,
        ["name"]: response.name,
        ["avatar_picture"]: response.avatar_picture
      }
      console.log("@@response", response)
      console.log("@@newStateCurrentUser", newStateCurrentUser)
      toast.success("Edit profile success")
      localStorage.removeItem("user")
      localStorage.setItem("user", JSON.stringify(newStateCurrentUser))

    }
  }

  render() {

    console.log("@@this", this.form)
    return (
      <>
        <Card className="shadow-lg b-4 mt-10" border={true} title={"Edit profile"} actions={[]}>
          <Form ref={this.form} layout="vertical" onFinish={this.handleSubmit} hideRequiredMark>
            <Row>
              <Col span={10} offset={2}>
                <FormItem
                  label={"Name"}
                  name="name"
                >
                  <Input />
                </FormItem>
                <FormItem
                  label={"Description"}
                  name="description"
                >
                  <Input.TextArea />
                </FormItem>
              </Col>
              <Col span={8} offset={3}>
                <FormItem
                  label={"Avatar"}
                  name="avatar_picture"
                >
                  <AvatarView />
                </FormItem>

              </Col>
            </Row>
          </Form>
          <Divider></Divider>
          <Col span={10} offset={2}>
            <FormItem
              label={""}
            >
              <Button onClick={() => this.form.current.submit()} className="text-black" type="primary">
                Save changes
              </Button>
            </FormItem>
          </Col>

        </Card>

      </>
    );
  }
}

export default BaseView
