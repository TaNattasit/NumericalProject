import React,{Component} from "react";
import { Layout, Menu, Breadcrumb } from 'antd';
import {Switch,Route} from "react-router-dom";
import {Link} from "react-router-dom";
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  GithubOutlined,PlusOutlined
} from '@ant-design/icons';


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Head extends Component {
  
    render() {
      return (
        
    <Header>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        
        style={{ lineHeight: '64px',fontSize:30 }}
      >
        <Link to="/">
        <GithubOutlined style={{fontSize:40}} />
        </Link>
        
        <SubMenu
              key="sub1"
              title={
                <span>
                  
                  <span>Numerical Medthod</span>
                </span>
              }
            >
              {/* <Menu.Item key="1"><Link to="/Bisection"/>Bisection</Menu.Item>
              <Menu.Item key="2"><Link to="/FalsePosition"/>FalsePosition</Menu.Item>
              <Menu.Item key="3"><Link to="/NewtonRhop"/>NewtonRhop</Menu.Item>
              <Menu.Item key="4"><Link to="/OnePoint"/>One-Point</Menu.Item>
              <Menu.Item key="5"><Link to="/Secant"/>Secant</Menu.Item> */}
            </SubMenu>
      </Menu>
    </Header>
    
      );
    }
  }
  export default Head;