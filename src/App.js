import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';
import CoronaViz from './components/coronaViz';
import { Container, Grid ,AppBar,Toolbar,Menu,Icon,IconButton,Typography, Divider} from '@material-ui/core';
import color from '@material-ui/core/colors/amber';


function App() {
  return (
    <div style={{backgroundColor:"#3b3a38"}}>
      <div><AppBar position="static" style={{backgroundColor:"Black",alignItems:"center"}}>
        <Toolbar>
          <Typography variant="h6" >
            CoVid-19 ViZ
          </Typography>
         </Toolbar>
      </AppBar>
      </div>
      <div>
        <CoronaViz />
      </div>
      <br/>
      <div><AppBar position="static" style={{backgroundColor:"Black"}}>
        <Grid container spacing={2} style={{float:"left"}}>
          <Grid item xs={12} sm={6} lg={2} md={2} >
          <Typography style={{marginLeft:"10px"}} >
            
          </Typography>
          </Grid>
          <Grid item xs={12} sm={6} lg={8} md={6} >
          <Typography variant="h6" style={{textAlign:"center"}} >
            Designed By : <a style={{color:"white"}} href="https://www.linkedin.com/in/parthpatel20/">PARTH PATEL</a>
          </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} lg={2} md={6} >
          <Typography  style={{textAlign:"right",marginRight:"10px"}} >
            Tech : React, MapBox, Cluster, Metereal-Ui
          </Typography>
          </Grid>
          </Grid>
      </AppBar>
      </div>
    </div>)
}

export default App;
