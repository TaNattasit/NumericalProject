import React, { Component } from 'react';
import Head from '../Head';
import { Form, Input, Button, Checkbox,Drawer, Col, Row, Spin } from 'antd';
import { Cascader ,Card } from 'antd';
import axios from 'axios';
import { PageHeader } from 'antd';
import { Route } from 'react-router-dom';
import { UserOutlined, CloseOutlined ,DropboxOutlined,PlusOutlined} from '@ant-design/icons';
import { Table, Tag } from 'antd';
import {parse} from 'mathjs'
import {Link} from 'react-router-dom'

export default class NewtonRaphson extends Component
{
  constructor(props)
    {
        super(props);
        this.state={
            options:[],
            diffs:[],
            eq:null,
            EqDiff:null,
            Xinitial:null,
            result:null,
            dataTable:[]
        }
    }

    componentDidMount()
    {
        // axios.get('http://localhost:8080/show_NewtonRaphson.php')//Docker//
        axios.get('http://localhost/Numer/server/show_New.php')
        .then(res=>{
            console.log(res.data);
            let item =[];
            let optionsArr = [];
            let optionsDiffArr = [];
            res.data.map(dataMap=>{
              let optionsObj = {};
              let optionsDiff = {};
                if(dataMap.E_Type=="Newton")
                {
                    item = item.concat(dataMap.E_Name);
                    optionsObj.value = dataMap.E_Name;
                    optionsObj.label = dataMap.E_Name;
                    optionsDiff.value = dataMap.E_Diff;
                    optionsDiff.label = dataMap.E_Diff;
                    optionsArr.push(optionsObj);
                    optionsDiffArr.push(optionsDiff);
                    console.log(optionsObj);
                    console.log(optionsDiff);
                }
            })
            this.setState({
                options:optionsArr,
                diffs:optionsDiffArr
            })
        })
    }

    Equet = (EqForSloveFuntion,xvalueforSlove,) => {
      const NodeEqua = parse(EqForSloveFuntion); 
      const Equa = NodeEqua.compile();
      let scope = {
          x:xvalueforSlove
      }
      return Equa.eval(scope);
       
  }
  
  err = (xmold, xmnew) => {
      var er = ((Math.abs((xmnew - xmold) / xmnew)) * 100) / 100;
      return er;
  }
  
  getValue = () => {
  
      // var Eq = document.getElementById("InputEquation").value;
      // var EqDiff = document.getElementById("InputEquationDiff").value;
      const {eq,EqDiff,Xinitial} = this.state;
      console.log(Xinitial);
      var xi_inmain  = parseFloat(Xinitial); 
      let tableArrData = [];
      // var table = document.getElementById("InformationTable").getElementsByTagName('tbody')[0];
  
      var xiplus1_inmain;
      var fxi;
      var fxpi;
      var fixerrorValue = 0.0001;
      var errorValue = 1;
      var i=0;
  
  while(errorValue>=fixerrorValue)
  {
      fxi=this.Equet(eq,xi_inmain);
      fxpi=this.Equet(EqDiff,xi_inmain);
      xiplus1_inmain=xi_inmain-(fxi/fxpi);
      errorValue = this.err(xiplus1_inmain,xi_inmain);

      let tableObjData = {};
      tableObjData.index = i;
      tableObjData.xi_inmain = xi_inmain;
      tableObjData.errorValue = errorValue;
      tableArrData.push(tableObjData);
      console.log(xi_inmain,fxi,fxpi);
      console.log("XMVALUE = ", xiplus1_inmain);
      console.log("This is errorvalue = ", errorValue);
      console.log("This is fixvalueerror = ", fixerrorValue);
      xi_inmain=xiplus1_inmain;
      i++;
      }
      this.setState({
        dataTable:tableArrData,
        result:xiplus1_inmain
        
      })
  }   

  EquationNewton = () =>{
    const formData = new FormData();
    formData.append("E_Name",this.state.eq);
    formData.append("E_Type","Newton");
    formData.append("E_Diff",this.state.EqDiff);
    const config = {
      headers: {
          "content-type": "multipart/form-data"
          }
      };
      // axios.post('http://localhost:8080/add_equation.php',formData,config)
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
        title: 'X',
        dataIndex: 'xi_inmain',
        key: 'xi_inmain',
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
        <h5>This is Result of NewtonRaphson is : {this.state.result}</h5><br/>
        <Table dataSource={this.state.dataTable} columns={columns} rowKey="Index" style={{marginLeft:"5%" , marginRight:"5%" , background:"lightblue" }} size="middle"/>
      </div>

    }
  }

    onChange = (value) => {// Function
      console.log(value[0]);
      this.setState({
        eq:value[0]
      })
    }
    displayRender = (label) => {
      return label[label.length - 1];
    }

    onChange2 = (value) => {//Funtion Diff
      console.log(value[0]);
      this.setState({
        EqDiff:value[0]
      })
    }
    displayRender2 = (label) => {
      return label[label.length - 1];
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
      this.EquationNewton();
    }
      render() {
        return (
          <div >
          <Head/>
            <PageHeader
              className="site-page-header"
              onBack={() => window.history.back()}
              title="Newton-Rhopson"
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
                      <Input size="large" placeholder="Please enter Diff"  onChange={e=>this.setState({EqDiff:e.target.value})} />
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
              <Cascader
                options={this.state.diffs}
                expandTrigger="hover"
                displayRender={this.displayRender2}
                onChange={this.onChange2}
              />
            </p>
            <br/>
            <br/>
            <div>
            <span style={{fontSize:25}}>Initial</span>        
              <Input placeholder="Input Initial" style={{width:"20em" , marginLeft:"1%" , marginRight:"5%"}} onChange={e=>this.setState({Xinitial:e.target.value})}/>
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


