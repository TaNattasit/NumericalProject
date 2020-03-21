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



export default class FalsePosition extends Component
{
  constructor(props)
    {
        super(props);
        this.state={
          options:[],
          eq : null,
          xlvalue : null,
          xrvalue :null,
          result : null
        }
    }

    componentDidMount()
    {
        axios.get('http://localhost/Numer/server/show_False.php')
        .then(res=>{
            console.log(res.data);
            let item =[];
            let optionsArr = [];

            res.data.map(dataMap=>{
                let optionsObj = {};
                if(dataMap.E_Type==="FalsePosition")
                {
                    item = item.concat(dataMap);
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
   Equet = (EqForSloveFuntion,xvalueforSlove)=>{
    const NodeEqua = parse(EqForSloveFuntion); 
    const Equa = NodeEqua.compile();
    let scope = {
      x:xvalueforSlove
    }
    return Equa.eval(scope);      
  }

err = (xmold, xmnew)=>{
    var er = ((Math.abs((xmnew - xmold) / xmnew)) * 100) / 100;
    return er;
}

getValue = ()=>{

  const {eq,xlvalue,xrvalue} = this.state;    
  var xl = parseFloat(xlvalue);
  var xr = parseFloat(xrvalue);
  let tableArrData = [];
  console.log(eq,xl,xr);
  var fxl = this.Equet(eq,xl);
  var fxr = this.Equet(eq,xr);
  var xm = xr - ((fxr * (xl - xr)) / (fxl - fxr))
  console.log(this.state);
  var xmArr = new Array();
  var fxmArr = new Array();
  var xmoldinmain = xm;
  xmArr[0] = xm;
  
  var fxm;
  var i = 0;
  var fixvalueerror = 0.00001;
  var errorvalue = 1;
  while (errorvalue >= fixvalueerror) {
    fxl = this.Equet(eq,xl);
    fxr = this.Equet(eq,xr);
      if (i != 0) {
        xm = xr - ((fxr * (xl - xr)) / (fxl - fxr))
      }
      fxm = this.Equet(eq,xm);
      if ((fxm * fxl) > 0) {
        xl=xm    
      }
      else {
          xr=xm
      }
      if (i != 0) {
          errorvalue = this.err(xmoldinmain, xm);
          xmoldinmain = xm;
          console.log("If Work");
      }
      let tableObjData = {};
      tableObjData.index = i;
      tableObjData.xl = xl;
      tableObjData.xr = xr;
      tableObjData.xm = xm;
      tableObjData.errorvalue = errorvalue;
      tableArrData.push(tableObjData);
      console.log("XMVALUE = ", xm);
      console.log("I value =", i);
      console.log("This is errorvalue = ", errorvalue);
      console.log("This is fixvalueerror = ", fixvalueerror);
      xmArr[i] = xm;
      fxmArr[i] = fxm;
      i++;
    }
    this.setState({
      dataTable:tableArrData,
      result:xm
    })
  }
  EquationFalse = () =>{
    const formData = new FormData();
    formData.append("E_Name",this.state.eq);
    formData.append("E_Type","FalsePosition");
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
            title: 'XL',
            dataIndex: 'xl',
            key: 'xl',
          },
          {
            title: 'XR',
            dataIndex: 'xr',
            key: 'xr',
          },
          {
            title: 'XM',
            dataIndex: 'xm',
            key: 'xm',
          },
          {
            title: 'Error',
            dataIndex: 'errorvalue',
            key: 'errorvalue',
          },
        ];
        if(this.state.result!==null)
        {
          return <div>
            <h5>This is Result of FalsePosition : {this.state.result}</h5><br/>
            <Table dataSource={this.state.dataTable} columns={columns} rowKey="Index" style={{marginLeft:80 , marginRight:80 , background:"lightblue" }}/>
          </div>
        }else{
          return <div>
            <h5>This is Result of Bisection : {this.state.result}</h5><br/>
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
      this.EquationFalse();
    }
    
    

    render() {
      return (
        <div >
        <Head/>
          <PageHeader
            className="site-page-header"
            onBack={() => window.history.back()}
            title="False-Position"
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
            <span style={{fontSize:25}}>XL</span>        
            <Input size="large" placeholder="Input XL" style={{width:250 , marginLeft:50 , marginRight:50 , marginBottom:10}} onChange={e=>this.setState({xlvalue:e.target.value})}/>
            <span style={{fontSize:25}}>XR</span>       
            <Input  size="large"placeholder="Input XR" style={{width:250 , marginLeft:50 , marginRight:50 , marginTop:10}} onChange={e=>this.setState({xrvalue:e.target.value})}/>
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