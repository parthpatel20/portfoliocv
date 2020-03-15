import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { getDataFromAPIs, DataFromApi } from './coronaApi';
import { countries } from '../utils/countries';
import { makeStyles } from '@material-ui/core/styles';
import { CoronaMap } from './coronaMap';
import { Grid, Container, Paper,useMediaQuery, Button, List, Divider, ListItem, Input, ListItemText, Typography } from '@material-ui/core';
import { CoronaSummarize } from './coronaSummarize';

const CoronaViz = () => {
    const [crApiData, setCrApiData] = useState([]);
    const [coronaVizData, setCoronaVizData] = useState([]);
    const [coronaSummary, setCoronaSummary] = useState([]);
    const [coronaSummarize, setCoronaSummarize] = useState([]);
    const [singleCountryData, setSingleCountryData] = useState();
    const [countryName, setCountryName] = useState();
    const matches = useMediaQuery('(min-width:600px)');
    
    useEffect(() => {
        getDataFromAPIs("https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php", "coronavirus-monitor.p.rapidapi.com")
            .then(response => {
                setCrApiData(response.countries_stat);
            })
            .catch(err => {
                console.log(err);
            });

        getDataFromAPIs("https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php",
            "coronavirus-monitor.p.rapidapi.com")
            .then(response => {
                setCoronaSummary(response);
            })
            .catch(err => {
                console.log(err);
            });
    }, [])
    useEffect(() => {
        Makedata()
    }, [crApiData])
    const Makedata = () => {
        var margeData = [];
        if (crApiData.length !== 0) {
            crApiData.map((ca) => {
                countries.some(ct => {
                    if (ct.country.toLowerCase() === ca.country_name.toLowerCase()) {
                        var data = {
                            country_name: ct.country,
                            cases: ca.cases,
                            deaths: ca.deaths,
                            region: ca.region,
                            serious_critical: ca.serious_critical,
                            total_recovered: ca.total_recovered,
                            new_deaths: ca.new_deaths,
                            new_cases: ca.new_cases,
                            lat: ct.latitude,
                            long: ct.longitude,
                        }
                        margeData.push(data);
                    }
                })
            });
            setCoronaVizData(margeData);
        }
    }
    useEffect(() => {
        summarize();
    }, [coronaSummary])

    useEffect(() => {
        if (countryName !== null) {
            summarize();
        }
    }, [countryName])
    const summarize = () => {

        var summarize = {
            country_name: 'WorldWide',
            cases: coronaSummary.total_cases,
            deaths: coronaSummary.total_deaths,
            total_recovered: coronaSummary.total_recovered,
            new_deaths: coronaSummary.new_deaths,
            new_cases: coronaSummary.new_cases,
            lat: 36.198461,
            long: 23.075699,
            zoom: 5
        }
        setCoronaSummarize(summarize)

    }
    const useStyles = makeStyles(theme => ({
        root: {
            flexGrow: 1,
        },
        buttonCss: { textAlign: "center", fontWeight: "bold", color: 'white' }, list: {
            height: (matches)?420:200,
            color: "white",
            overflow: 'auto'
        },
        paper: {
            backgroundColor: "#3d3b3b !important", color: "White", textAlign: "center", margin: "10px",
            padding: "15px", marginBottom: "0px"
        },
        textBox: {
            borderColor: "#3d3b3b !important", color: "White", textAlign: "center", margin: "10px",
            padding: "15px", marginBottom: "0px"
        },
    }));

    const onCountryClick = (data) => {
        setSingleCountryData({})
        setSingleCountryData(data)
    }
    const handleChange = (e) => {
        setCountryName(e.target.value);
    }
    const countryList = () => {
        return (<List className={classes.list}>
            {coronaVizData.map((cd, i) => {
                if (countryName && cd.country_name.toString().toLowerCase().includes(countryName.toLowerCase())) {
                    return (
                        <ListItem key={i}>
                            <Button className={classes.buttonCss} key={i} fullWidth data={cd}
                                onClick={() => onCountryClick(cd)} >
                                <ListItemText primary={cd.country_name} secondary={<span style={{ color: "#999494" }}>{cd.cases} </span>}></ListItemText>
                            </Button>
                        </ListItem>
                    )
                }
            })}
            <Divider />
        </List>
        )
    }
    const renderCountries = () => {
        return (
            <div style={{ margin: "10px", borderColor: 'white', borderWidth: '2px' }}>
                <div><Paper className={classes.paper} color="White" elevation={3}>
                    <span><b>Countries</b></span>
                </Paper><br />
                    <Input className={classes.textBox} placeholder="EX: India" value={countryName} onChange={(e) => handleChange(e)} />
                </div>

                {(countryName) ? countryList() : ""}
            </div>

        )
    }
    const classes = useStyles();
    const VizData = () => {
        const data = (singleCountryData) ? singleCountryData : coronaSummarize;
        return (<div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={12} style={{ textAlign: "center" }}>
                    <CoronaSummarize summarize={data} worldWide={countryName}></CoronaSummarize>
                </Grid>
                <Grid container xs={12} spacing={3}>
                    <Grid item xs={12} sm={6} md={6} lg={2} xl={4}>
                        {renderCountries()}
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={10} xl={8}>
                        <CoronaMap coronaData={coronaVizData} summarize={(singleCountryData) ? singleCountryData : []}></CoronaMap></Grid>
                </Grid>
            </Grid>
        </div>)
    }
    return (
        <div>
            {(coronaVizData.length !== 0) ? VizData()
                : 'Loading...'}
        </div>
    );
}

export default CoronaViz;