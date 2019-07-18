import React from 'react';
import 'antd/dist/antd.css';
import {
  Form,
  Input,
  Button,
  Spin,
  Icon,
  notification,
  message,
  Divider,
  Result
} from 'antd';
import QueueAnim from 'rc-queue-anim';

const { Search } = Input;
class App extends React.Component {

  state = {
    step: 0,
    loading: false,
    disable: false,
    btnText: "获取验证码",
    tel: "",
    code: "",
    vail_tel: { vail: "", help: "" },
    vail_code: { vail: "", help: "" },
    M_s: 0
  }

  componentWillMount() {
    document.title = "注册 -  涂叶云";
    fetch(`https://openapi.twoyecloud.com/user/preloading`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({})
    }).then(res => res.json()).then(
      data => {
        if (data.status == "SUCCESS") this.setState({ step: 1 })
      }
    ).catch(function (e) {
      notification.error({
        message: '响应错误码：408',
        duration: null,
        description:
          '服务器长时间未给予响应，可能是由于服务器内部错误，也可能是由于您的网络连接不通畅造成的。',
      });
    })
  }

  send = () => {
    const reg = /0?(13|14|15|17|18|19)[0-9]{9}/;
    if (!reg.test(this.state.tel)) this.setState({ vail_tel: { vail: "error", help: "请输入正确的手机号码" } })
    else {
      this.setState({ disable: true, vail_tel: { vail: "", help: "" } });
      const that = this;
      fetch(`https://openapi.twoyecloud.com/user/Msg_reg`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: this.state.tel
      }).then(res => res.json()).then(
        data => {
          if (data.status == "SUCCESS") {
            message.success("验证码已发送，请查收。");
            let B = 120;

            let A = setInterval(() => {
              B--;
              if (B > 0) {
                that.setState({ btnText: B + " S" });
              }
              else {
                clearInterval(A);
                that.setState({ disable: false, btnText: "获取验证码" })
              }
            }, 1000);
          }
          else {
            message.error(JSON.stringify(data));
            that.setState({ disable: false, btnText: "获取验证码" })
          }
        }
      ).catch(function (e) {
        message.error((JSON.parse(e)).error);
        that.setState({ disable: false, btnText: "获取验证码" })
      })
    }
  }

  login = () => {
    const reg = /0?(13|14|15|17|18|19)[0-9]{9}/;
    if (!reg.test(this.state.tel)) this.setState({ vail_tel: { vail: "error", help: "请输入正确的手机号码" } });
    else if (this.state.code == "") this.setState({ vail_tel: { vail: "", help: "" }, vail_code: { vail: "error", help: "验证码不可以为空！" } });
    else {
      this.setState({ loading: true, vail_code: { vail: "", help: "" } });
      const that = this;
      fetch(`https://openapi.twoyecloud.com/user/GetToken_1`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          tel: that.state.tel,
          usercode: that.state.code
        })
      }).then(res => res.json()).then(
        data => {
          this.setState({ loading: false });
          if (data.status == "SUCCESS") {
            this.setState({ M_s: 1 })
          }
          else {
            message.error(data.res)
          }
        }
      ).catch(function (e) {
        this.setState({ loading: false });
        message.error((JSON.parse(e)).error);
      })
    }
  }

  render() {

    const styles = <style jsx>
      {
        `
        body,html{
          overflow-y:hidden;
          min-width:960px;
          background:#f9f9f9;
          padding:0;
          margin:0;
        }
        @font-face {
          font-family: 'webfont';
          font-display: swap;
          src: url('//at.alicdn.com/t/webfont_acozdas8hld.eot'); /* IE9*/
          src: url('//at.alicdn.com/t/webfont_acozdas8hld.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
          url('//at.alicdn.com/t/webfont_acozdas8hld.woff2') format('woff2'),
          url('//at.alicdn.com/t/webfont_acozdas8hld.woff') format('woff'), /* chrome、firefox */
          url('//at.alicdn.com/t/webfont_acozdas8hld.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
          url('//at.alicdn.com/t/webfont_acozdas8hld.svg#Alibaba-PuHuiTi-Regular') format('svg'); /* iOS 4.1- */
        }
        `
      }
    </style>

    const A_S = [
      <div style={{ width: "450px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "webfont", textAlign: "center" }}>欢迎加入涂叶云</h1>
        <p style={{ textAlign: "center", marginBottom: "40px" }}>极简制作 一键呈现</p>
        <Form>
          <Form.Item
            label="手机号码"
            validateStatus={this.state.vail_tel.vail}
            help={this.state.vail_tel.help}
          >
            <Input size="large" onChange={e => this.setState({ tel: e.target.value })} maxLength="11" />
          </Form.Item>
          <Form.Item
            label="验证码"
            validateStatus={this.state.vail_code.vail}
            help={this.state.vail_code.help}
          >
            <Search
              enterButton={<Button type="primary" disabled={this.state.disable}>{this.state.btnText}</Button>}
              size="large"
              onSearch={this.send}
              onChange={vaule => this.setState({ code: vaule.target.value })}
              maxLength="6"
            />
          </Form.Item>
          <Form.Item>
            <Button
              shape="round"
              size="large"
              style={{ width: "150px", display: "block", margin: "0 auto", marginTop: "30px" }}
              type="primary"
              loading={this.state.loading}
              onClick={this.login}
            >注册</Button>
          </Form.Item>
          <Form.Item>

          </Form.Item>
        </Form>
        <p style={{ textAlign: "center" }}>已有账号？<a href="https://login.twoyecloud.com">点此登录</a></p>
        <Divider />
        <p style={{ textAlign: "center" }}>注册则视作您同意和遵守我们的<a href="https://doc.twoyecloud.com/service">《服务政策》</a>和<a href="https://doc.twoyecloud.com/privacy">《隐私权政策》</a></p>
      </div>,
      <Result
        status="success"
        title="恭喜您，注册成功！"
        subTitle="此账号为您在涂叶云平台的基础账号，可被用作涂叶云任意场景"
        extra={<a href="https://login.twoyecloud.com">点此登录</a>}
        style={{ background: "#f9f9f9" }}
      />
    ];


    const A = <div>
      <QueueAnim
        animConfig={[
          { opacity: [1, 0], translateX: [0, 100] },
          { opacity: [1, 0], translateX: [0, -100] }
        ]}
        duration={1000}
      >
        <table style={{ width: "100%" }} key="0">
          <tr>
            <td style={{ width: "30%" }}>
              <img src="https://twoyecloud.oss-cn-beijing.aliyuncs.com/kimXVLnrAfnjvSNrjgVJ.png" style={{ height: "100vh" }} />
            </td>
            <td>
              {A_S[this.state.M_s]}
            </td>
          </tr>
        </table>
      </QueueAnim>
    </div>;

    const B = <Spin spinning style={{ marginTop: "100px", width: "100%" }} size="large" >
      <table style={{ width: "100%", height: "100%" }}>
        <tr>
          <td>
            <div style={{ height: "100vh" }}></div>
          </td>
        </tr>
      </table>
    </Spin>

    const C = [B, A];

    return (
      <div>
        {C[this.state.step]}
        {styles}
      </div>
    );
  }
}

export default App;
