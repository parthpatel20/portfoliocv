import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const getDataFromAPIs = (url, host) => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            "headers": {
                "x-rapidapi-host": host,
                "x-rapidapi-key": "69163bf992msh837f0c5cea40733p142bbbjsne070d349101b",
            }
        }
        ).then((response) => {
            resolve(response.data);
        }).catch((err) => {
            reject(err)
        });
    });
};
