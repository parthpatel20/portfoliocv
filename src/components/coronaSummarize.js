import React, { useState, useEffect, Fragment } from 'react';
import { Grid, Paper, makeStyles } from '@material-ui/core';

export const CoronaSummarize = (props) => {
    const style = makeStyles((theme) => ({
        div: {
            flexGrow: 1,
            textAlign: "center",
            "margin-left":"30%"
        },
        paper: {
            backgroundColor: "Black !important", color: "White", textAlign: "center", margin: "10px",
            padding: "15px", marginBottom: "0px"
        },
        valSpan: {
            fontSize: "20px",
            fontWeight: "Bold"
        }
    }
    )
    )
    const classes = style()

    return (
        <div className={style.div}>
            <Grid container spacing={3}>
                <Grid item xs="auto" sm="auto">
                    <Paper className={classes.paper} color="White" elevation={3}>
                        <span className={style.valSpan}><b>{props.summarize.country_name}</b></span>
                    </Paper>
                </Grid>
                <Grid item xs="auto" sm="auto">
                    <Paper className={classes.paper} color="White" elevation={3}>
                        <span>Total Cases : <span style={{ color: "red" }} className={classes.valSpan}>{props.summarize.cases}</span> </span>
                    </Paper>
                </Grid>
                <Grid item xs="auto" sm="auto">
                    <Paper className={classes.paper} color="White" elevation={3}>
                        <span>Total Deaths : <span className={classes.valSpan}>{props.summarize.deaths}</span> </span>
                    </Paper>
                </Grid>
                <Grid item xs="auto" sm="auto">
                    <Paper className={classes.paper} color="Green" elevation={3}>
                        <span>Total Recovered : <span style={{ color: "Green" }} className={classes.valSpan}>{props.summarize.total_recovered}</span> </span>
                    </Paper>
                </Grid>
                <Grid item xs="auto" sm="auto">
                    <Paper className={classes.paper} color="Blue" elevation={3}>
                        <span>New Cases : <span style={{ color: "Blue" }} className={classes.valSpan}>{props.summarize.new_cases}</span> </span>
                    </Paper>
                </Grid>
                <Grid item xs="auto" sm="auto">
                    <Paper className={classes.paper} color="Orange" elevation={3}>
                        <span>New Deaths : <span style={{ color: "Orange" }} className={classes.valSpan}>{props.summarize.new_deaths}</span> </span>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )

}