import React, { Component } from 'react';
import Head from '../Head';
import { Form, Input, Button, Checkbox,Drawer, Col, Row, Select, DatePicker } from 'antd';
import { Cascader ,Card  } from 'antd';
import axios from 'axios';
import { PageHeader } from 'antd';
import { Route } from 'react-router-dom';
import { DropboxOutlined,PlusOutlined } from '@ant-design/icons';
import { Table, Tag } from 'antd';
import {parse} from 'mathjs'


export default class OnePoint extends Component
{
  constructor(props)
    {
        super(props);
        this.state={
            options:[],
            eq:null,
            xinitial:null,
            result:null,
            dataTable:[]
        }
    }

    componentDidMount()
    {
        // axios.get('http://localhost:8080/show_One.php')//Docker//
        axios.get('http://localhost/Numer/server/show_One.php')
        .then(res=>{
            console.log(res.data);
            let item =[];
            let optionsArr = [];
            res.data.map(dataMap=>{
                let optionsObj = {};
                if(dataMap.E_Type==="OnePoint")
                {
                    item = item.concat(dataMap.E_Name);
                    optionsObj.value = dataMap.E_Name;
                    optionsObj.label = dataMap.E_Name;
                    optionsArr.push(optionsObj);
                    console.log(optionsObj);
                }
            })
            this.setState({
                options:optionsArr
            })
        })
    }

    Equet = (EqForSloveFuntion,xvalueforSlove) => {
   
      const NodeEqua = parse(EqForSloveFuntion);     
      const Equa = NodeEqua.compile();      
      let scope = {
          x:xvalueforSlove
      }
      return Equa.eval(scope);
       
  }
  
  err = (xiw1, xi) => {
      var er = ((Math.abs((xiw1 - xi) / xiw1))*100)/100;
      return er;
  }
  
  getValue = () => {
  
      const {eq,xinitial} = this.state;
      var xiinmain = parseFloat(xinitial);  
      let tableArrData = [];
      console.log(eq,xiinmain);
      var i=0;
      var xiw1inmain;
      var fixerrorValue = 0.00001;
      var errorValue=1;
      
      while(errorValue >= fixerrorValue)
      {
        xiw1inmain = this.Equet(eq,xiinmain);
        errorValue= this.err(xiw1inmain,xiinmain);

        let tableObjData = {};
        tableObjData.index = i;
        tableObjData.xiinmain = xiinmain;
        tableObjData.xiw1inmain = xiw1inmain;
        tableObjData.errorValue = errorValue;
        tableArrData.push(tableObjData);
        console.log("XMVALUE = ", xiw1inmain);
        console.log("I value =", i);
        console.log("This is errorvalue = ", errorValue);
        console.log("This is fixvalueerror = ", fixerrorValue); 
        xiinmain=xiw1inmain;       
        i++;
      }
      this.setState({
        dataTable:tableArrData,
        result:xiw1inmain
      })
  }
  EquationOne = () =>{
    const formData = new FormData();
    formData.append("E_Name",this.state.eq);
    formData.append("E_Type","OnePoint");
    formData.append("E_Diff","");
    const config = {
      headers: {
          "content-type": "multipart/form-data"
          }
      };
    axios.post('http://localhost/Numer/server/insertdata.php',formData,config)
    .then(res=>{
      console.log(res);
    })
    .catch(err=>{
       throw err 
    })
  }
  showResult=()=>{
    const columns = [
      {
        title: 'No',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: 'Xinitial',
        dataIndex: 'xiinmain',
        key: 'xiinmain',
      },
      {
        title: 'XValue',
        dataIndex: 'xiw1inmain',
        key: 'xiw1inmain',
      },
      {
        title: 'Error',
        dataIndex: 'errorValue',
        key: 'errorValue',
      },
    ];
    if(this.state.result!==null)
    {
      return <div>
        <h5>This is Result of One-Point Iteration : {this.state.result}</h5><br/>
        <Table dataSource={this.state.dataTable} columns={columns} rowKey="Index" style={{marginLeft:"5%" , marginRight:"5%" , background:"lightblue" }} size="middle"/>
      </div>

    }
  }

    onChange = (value) => {
      console.log(value[0]);
      this.setState({
        eq:value[0]
      })
    }
    
    // Just show the latest item.
    displayRender = (label) => {
      return label[label.length - 1];
    }

    onChangeSwitch = (checked) => {
      console.log(checked)
      this.setState({
        SwitchOpen:checked
      })
    }
  
    state = { visible: false };

    state = { visible: false };

    showDrawer = () => {
      this.setState({
        visible: true,
      });
    };
  
    onClose = () => {
      this.setState({
        visible: false,
      });
    };
    onSub =()=>{
      this.setState({
        visible: false
      });
      this.EquationOne();
    }

    render() {
      return (
        <div >
        <Head/>
          <PageHeader
            className="site-page-header"
            onBack={() => window.history.back()}
            title="One-Point"
            subTitle="This is a subtitle"
          />
            <Card style={{backgroundColor:"#66CCFF",width:"100%",height:"100%"}}>
            <p>
            <h1 style={{fontSize:50}}>Calculator</h1>
            <h5>Select Function</h5>
            <Button type="primary" onClick={this.showDrawer}>
            <PlusOutlined /> ADD Equation
          </Button>
          <Drawer
            title="Insert new Equation"
            width={720}
            onClose={this.onClose}
            visible={this.state.visible}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
              <div
                style={{
                  textAlign: 'right',
                }}
              >
                <Button
                  onClick={this.onClose}
                  style={{ marginRight: 8 }}
                >
                  Cancel
                </Button>
                <Button onClick={this.onSub} type="primary">
                  Submit
                </Button>
              </div>
            }
          >
            <Form layout="vertical" hideRequiredMark >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="Equation"
                    label="Equation"
                    rules={[{ required: true, message: 'Please enter Equation' }]}
                    
                  >
                    <Input size="large" placeholder="Please enter Equation"  onChange={e=>this.setState({eq:e.target.value})} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Drawer>
            <Cascader
              options={this.state.options}
              expandTrigger="hover"
              displayRender={this.displayRender}
              onChange={this.onChange}
            />
          </p>
          <br/>
          <br/>
          <div>
          <span style={{fontSize:25}}>Initial</span>        
            <Input placeholder="Input Initial" style={{width:"20em" , marginLeft:"1%" , marginRight:"5%"}} onChange={e=>this.setState({xinitial:e.target.value})}/>
          </div>
          <br/>
          <p>
          <DropboxOutlined style={{fontSize:50}}  onClick={this.getValue}> 
            
            </DropboxOutlined>
            <h1>Submit</h1>
          </p>
          <br/>
          {this.showResult()}
          </Card>
          
          
      </div>
      
      )
    }
  }
