import React from 'react';
import PropTypes from 'prop-types';

import LineChart from './visualisations/LineChart';

function getTransformedData(data, xIndex, yIndex) {
  let transformedData = [];
  for(let i=0; i<data.length; i++) {
    if(data[i][xIndex]) {
      let currentDate = new Date(data[i][xIndex].substring(3,5)+"/"+data[i][xIndex].substring(0,2)+"/"+data[i][xIndex].substring(6));
      transformedData.push({
        x: currentDate,
        y: Number(data[i][yIndex])
      });
    }
    
  }
  return transformedData;
}

export default function DailySpending(props) {
    const { actualData, predictions, seriesSelected } = props;
    const transformedActualData = getTransformedData(actualData, 'index', seriesSelected);
    const transformedPredictedData = getTransformedData(predictions, 'index', 'prediction');
    const series = {
      first: transformedActualData,
      second: transformedPredictedData
    };
    return (
        <div>
            <LineChart series={series} title="Active vs Predictions Plot" yAxisTitle="Values" seriesName1="Actual" seriesName2="Predictions" />
        </div>
    );
}

DailySpending.propTypes = {
  actualData: PropTypes.array.isRequired,
  predictions: PropTypes.array.isRequired,
  seriesSelected: PropTypes.string.isRequired,
}