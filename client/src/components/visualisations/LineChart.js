import React from 'react';
import PropTypes from 'prop-types';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export default function LineChart(props) {
    const { series, title, yAxisTitle, seriesName1, seriesName2 } = props;
    const options = {
        title: {
            text: title
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: { // Primary yAxis
            title: {
                text: yAxisTitle,
            },
            labels: {
                format: '{value}'
            }
        },
        series: [{
            name: seriesName1,
            type: 'spline',
            data: series.first
            }, {
            name: seriesName2,
            type: 'spline',
            data: series.second
        }]
    };
    return (
        <HighchartsReact highcharts={Highcharts} options={options} />
    );
}

LineChart.propTypes = {
    series: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    yAxisTitle: PropTypes.string.isRequired,
    seriesName1: PropTypes.string.isRequired,
    seriesName2: PropTypes.string.isRequired
}