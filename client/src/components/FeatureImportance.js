import React from 'react';
import PropTypes from 'prop-types';

import BarChart from './visualisations/BarChart';

function transformData(data) {
    let transformedData = [];
    for(const property in data) {
      transformedData.push([property, data[property]]);
    }
    return transformedData;
}

export default function TopExpenseTypes(props) {
    const { data } = props;

    const transformedData = transformData(data);

    return (
        <div>
            <BarChart series={transformedData} title="Feature Importances" yAxisTitle="Importance" />
        </div>
    );
}

TopExpenseTypes.propTypes = {
  data: PropTypes.object.isRequired
}