import React,{Component} from 'react'
import Head from "./Head"
import { PageHeader } from 'antd';
import { Carousel,Button } from 'antd';
import { Card } from 'antd';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import Bi from './bis.png';
import F from './F.png';
import N from './N.png'
import O from './O.png'
import S from './S.png'
import P from './im_scary.jpg'
import G1 from './gatget1.jpg'
import G2 from './gatget3.jpg'
import G3 from './gatget4.jpg'
const { Meta } = Card;
class Home extends Component{

    render(){
        return(
            <div>
                <Head/>
                <Carousel  autoplay>
                <div className="container">
                <img src={G1}/>
                </div>
                <div className="container">
                <img src={G2}/>
                </div>
                <div className="container">
                <img src={G3}/>
                </div>
            </Carousel>
                <div class="row">
                    <div className="column">
                        <Link to="/Bisection">
                        <Card   hoverable style={{ width: 240, marginLeft:250,marginTop:40}}
                        cover={<img src={Bi}/>}    
                        >    
                        <Meta title="Bisection"  />
                        
                        </Card>
                        
                        </Link>
                    </div>

                    <div className="column">
                    <Link to="/FalsePosition">
                        <Card   hoverable style={{ width: 240, marginLeft:250,marginTop:40}}
                        cover={<img src={F}/>}    
                        >    
                        <Meta title="False-Position" />
                        
                        </Card>
                        </Link>
                    </div>
                    <div className="column">
                    <Link to="/NewtonRhop">
                        <Card   hoverable style={{ width: 240, marginLeft:250,marginTop:40}}
                        cover={<img src={N}/>}    
                        >    
                        <Meta title="Newton-Rhopson" />
                        
                        </Card>
                        </Link>
                    </div>
                </div>
                <div class="row">
                    <div className="column">
                    <Link to="/OnePoint">
                        <Card   hoverable style={{ width: 240, marginLeft:250,marginTop:40}}
                        cover={<img src={O}/>}    
                        >    
                        <Meta title="One-Point"  />
                        
                        </Card>
                        </Link>
                    </div>

                    <div className="column">
                    <Link to="/Secant">
                        <Card   hoverable style={{ width: 240, marginLeft:250,marginTop:40}}
                        cover={<img src={S}/>}    
                        >    
                        <Meta title="Secant" />
                        
                        </Card>
                        </Link>
                    </div>
                    <div className="column">
                        <Card  onClick={this.shoot} hoverable style={{ width: 240, marginLeft:250,marginTop:40}}
                        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}    
                        >    
                        <Meta title="Europe Street beat"/>
                        
                        </Card>
                    </div>
                </div>
                
            </div>
        );
    }
}
export default  Home;