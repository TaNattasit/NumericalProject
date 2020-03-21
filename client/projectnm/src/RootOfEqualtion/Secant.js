import React, { Component } from 'react';
import Head from '../Head';
import { Form, Input, Button, Checkbox,Drawer, Col, Row, Select, DatePicker } from 'antd';
import { Cascader ,Card } from 'antd';
import axios from 'axios';
import { PageHeader } from 'antd';
import { Route } from 'react-router-dom';
import { UserOutlined, CloseOutlined ,DropboxOutlined,PlusOutlined} from '@ant-design/icons';
import { Table, Tag } from 'antd';
import {parse} from 'mathjs'
import {Link} from 'react-router-dom'

export default class Secant extends Component
{
  constructor(props)
    {
        super(props);
        this.state={
            proptions:[],
            eq:null,
            Xinitial:null,
            Xinitialminus1:null,
            result:null,
            dataTable:[]
        }
    }

    componentDidMount()
    {
        axios.get('http://localhost:8080/show_Secant.php')//Docker//
        axios.get('http://localhost/Numer/server/show_Se.php')
        .then(res=>{
            console.log(res.data);
            let item =[];
            let optionsArr = [];
            res.data.map(dataMap=>{
                let optionsObj = {};
                if(dataMap.E_Type==="Secant")
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
  
  err = (xmold, xmnew) => {
      var er = ((Math.abs((xmnew - xmold) / xmnew)* 100)) ;
      return er;
  }
  
  getValue = () => {
      const {eq,Xinitial,Xinitialminus1} = this.state;
      var xi_inmain = parseFloat(Xinitial);
      var xi_minus1_inmain = parseFloat(Xinitialminus1);
      var xi_plus1;
      var fpx_inmainValue;
      let tableArrData = [];
      var errorValue = 1;
      var fixerrorValue = 0.0001;
      var i=0;
      while(errorValue>=fixerrorValue)
      {
        xi_plus1=xi_inmain-((this.Equet(eq,xi_inmain)*(xi_minus1_inmain-xi_inmain))/(this.Equet(eq,xi_minus1_inmain)-this.Equet(eq,xi_inmain)));
        errorValue=this.err(xi_plus1,xi_inmain);


          let tableObjData = {};
          tableObjData.index = i;
          tableObjData.xi_plus1 = xi_plus1;
          tableObjData.errorValue = errorValue;
          tableArrData.push(tableObjData);
          // var row = table.insertRow(i);
  
          // var cel0 = row.insertCell(0);
          // var cel1 = row.insertCell(1);
          // var cel2 = row.insertCell(2);
          
          
  
          // cel0.innerHTML = i;
          // cel1.innerHTML = xi_plus1;
          // cel2.innerHTML = errorValue;
          
          
  
          console.log("Secant XiVALUE = ", xi_plus1);
          console.log("This is errorvalue = ", errorValue);
          console.log("This is fixvalueerror = ", fixerrorValue);
          xi_inmain=xi_plus1;
          i++;
      }
      this.setState({
        dataTable:tableArrData,
        result:xi_plus1
      })
  }
  EquationSecant = () =>{
    const formData = new FormData();
    formData.append("E_Name",this.state.eq);
    formData.append("E_Type","Secant");
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
        title: 'X',
        dataIndex: 'xi_plus1',
        key: 'xi_plus1',
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
        <h5>This is Result of Secant Iteration : {this.state.result}</h5><br/>
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
      this.EquationSecant();
    }

  render() {
    return (
      <div>
        <Head/>
        <PageHeader
          className="site-page-header"
          onBack={() => window.history.back()}
          title="Secant"
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
          <span>Input X1</span>        
            <Input size="large" placeholder="Input X1" style={{width:250 , marginLeft:50 , marginRight:50 , marginBottom:10}} onChange={e=>this.setState({Xinitial:e.target.value})}/>
            <span>Input X2</span>       
            <Input size="large" placeholder="Input X2" style={{width:250 , marginLeft:50 , marginRight:50 , marginBottom:10}} onChange={e=>this.setState({Xinitialminus1:e.target.value})}/>
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