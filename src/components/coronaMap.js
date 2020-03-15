import React, { useState, useEffect, Fragment, useRef } from 'react';
import ReactMap, { Marker, Popup, FlyToInterpolator } from 'react-map-gl'
import useSupercluster from "use-supercluster";
import '../../src/App.css';
import { Divider,useMediaQuery  } from '@material-ui/core';

export const CoronaMap = (props) => {
    const [coronaData, setCoronaData] = useState(props.coronaData);
    const [popUpData, setPopUpData] = useState()
    const matches = useMediaQuery('(min-width:600px)');
    useEffect(() => {
        const data = props.summarize
        if (data.length !== 0) {
            setViewPort({ latitude: data.lat, longitude: data.long, zoom: 4 })
        }
    }, [props.summarize])

    const sliceCoronaData = coronaData //Slice it
    const [viewPort, setViewPort] = useState({
        latitude: 36.198461,
        longitude: 23.075699,
        zoom: 0.5
    });
    const mapRef = useRef();

    const points = sliceCoronaData.map((scd, i) => (
        {
            type: "Feature",
            properties: {
                cluster: false,
                dataId: i + 1,
                country_name: scd.country_name,
                cases: scd.cases,
                deaths: scd.deaths,
                region: scd.region,
                serious_critical: scd.serious_critical,
                total_recovered: scd.total_recovered,
                new_deaths: scd.new_deaths,
                new_cases: scd.new_cases,
            },
            geometry: {
                type: "Point",
                coordinates: [
                    parseFloat(scd.long),
                    parseFloat(scd.lat)
                ]
            }
        }
    )
    );

    //Clustering..

    //bounds..
    const bounds = mapRef.current
        ? mapRef.current
            .getMap()
            .getBounds()
            .toArray()
            .flat()
        : null;

    //clusterbound..
    const { clusters, supercluster } = useSupercluster(
        {
            points: points,
            bounds,
            zoom: viewPort.zoom,
            options: { radius: 50, maxZoom: 20 }
        });
    const expansionZoom = (clusterId, lat, long) => {
        const exZoom = Math.min(
            supercluster.getClusterExpansionZoom(clusterId),
            20
        );

        setViewPort({
            ...viewPort,
            lat,
            long,
            zoom: exZoom,
            transitionInterpolator: new FlyToInterpolator({
                speed: 2
            }),
            transitionDuration: "auto"
        });
    }

    const renderPopUP = () => {

        if (popUpData) {
            const [longitude, latitude] = popUpData.geometry.coordinates;
            const properties = popUpData.properties;
            const {
                cluster: isCluster,
                point_count: pointCount
            } = popUpData.properties;

            if (isCluster) {
                return (<Popup latitude={latitude} longitude={longitude} >
                    <div>
                        <h3>{pointCount} Countries affeted with Corona in this radius</h3>
                        *please Zoom In for more data
                    </div>
                </Popup>)
            }
            return (<Popup latitude={latitude} longitude={longitude} >
                <div>
                    <h3>{properties.country_name}</h3>
                    <Divider />
                    <span> Total Cases: <b>{properties.cases}</b></span>
                    <span> Recovered: <b>{properties.total_recovered}</b></span>
                    <span> Deaths: <b>{properties.deaths}</b></span>
                    <br />
                    <br />

                    <b>Last 24 hours Updates..</b>
                    <Divider></Divider>
                    <span> New Cases: <b>{properties.total_recovered}</b></span>
                    <span> New Deaths: <b>{properties.deaths}</b></span>
                </div>
            </Popup>)
        }
    }
    //Making points
    return (<div className="map">
        <ReactMap style={{ "margin": "auto" }} {...viewPort} maxZoom={20} height={(matches)?600:500} width={(matches)?1250:400}
            mapStyle="mapbox://styles/mapbox/dark-v10"//"mapbox://styles/parthpatel20/ck7pp6a4709ts1it9o5kqzn58"
            mapboxApiAccessToken="pk.eyJ1IjoicGFydGhwYXRlbDIwIiwiYSI6ImNrN3BvYXR3ajBtZWMzbG1mY2NkazhnbnAifQ.SXjAt57cvBoq1rYQ9WaCvg"
            ref={mapRef}
            onViewportChange={(port) => {
                setViewPort(port)
            }}
        >
            {
                (clusters) ?
                    clusters.map((cluster, i) => {
                        var summ = (props.summarize.length !== 0) ? props.summarize : null
                        const [longitude, latitude] = cluster.geometry.coordinates;
                        const properties = cluster.properties;
                        const {
                            cluster: isCluster,
                            point_count: pointCount
                        } = cluster.properties;
                        if (isCluster) {
                            return (<Marker key={`cluster-${cluster.id}`}
                                latitude={latitude} longitude={longitude}
                            >
                                <span onMouseOver={(e) => {
                                    e.preventDefault();
                                    setPopUpData(cluster);
                                }} 
                                onMouseOut={(e) => {
                                    e.preventDefault();
                                    setPopUpData(null);
                                }}

                                onClick={() => { expansionZoom(cluster.id, latitude, longitude) }} style={{
                                    height: `${5 + (pointCount / points.length) * 500}px`,
                                    width: `${5 + (pointCount / points.length) * 500}px`,
                                    backgroundColor: "Red",
                                    opacity: (summ) ? "0.1" : 0.8,
                                    borderRadius: "100%",
                                    
                                    display: "inline-block",
                                    textAlign: "center",
                                    border: "2px solid black"
                                }}></span>
                            </Marker>)
                        }
                        var cases = properties.cases.replace(",", "");
                        return (<Marker key={i} style={{
                        }} latitude={latitude} longitude={longitude}
                        >
                            <span onMouseOver={(e) => {
                                e.preventDefault();
                                setPopUpData(cluster);
                            }} style={{
                                height: "30px",
                                width: "30px",
                                backgroundColor: (cases >= 1000) ? (cases >= 6500) ? "Red" : "#ab3e0c" : (cases >= 500) ? "Orange" : "#8c6107",
                                opacity: (summ) ? "0.1" : 0.8,
                                borderRadius: "100%",
                                borderColor: "black",
                                borderWidth: "2px",
                                display: "inline-block",
                                textAlign: "center"
                            }}
                                onMouseOut={(e) => {
                                    e.preventDefault();
                                    setPopUpData(null);
                                }}
                            ></span>
                        </Marker>)
                    }) : ""

            }
            {
                (supercluster) ? supercluster.points.map((sc, i) => {
                    const [longitude, latitude] = sc.geometry.coordinates;
                    var summ = (props.summarize.length !== 0) ? props.summarize : null
                    if (summ) {
                        if (summ.country_name === sc.properties.country_name) {

                            return (<Marker key={i} style={{
                            }} latitude={latitude} longitude={longitude}
                            >
                                <span
                                    onMouseOver={(e) => {
                                        e.preventDefault();
                                        setPopUpData(sc);
                                    }}
                                    onMouseOut={(e) => {
                                        e.preventDefault();
                                        setPopUpData(null);
                                    }}
    
                                    className=".blink_me" style={{
                                        height: "100px",
                                        width: "100px",
                                        backgroundColor: (sc.properties.cases >= 1000) ? (sc.properties.cases >= 6500) ? "Red" : "#ab3e0c" : (sc.properties.cases >= 500) ? "Orange" : "#8c6107",
                                        opacity: "1",
                                        borderRadius: "100%",
                                        borderColor: "black",
                                        borderWidth: "2px",
                                        display: "inline-block",
                                        textAlign: "center"
                                    }}></span>
                            </Marker>)
                        }
                    }
                }) : ""
            }

            {
                renderPopUP()
            }
        </ReactMap>
    </div >)
}