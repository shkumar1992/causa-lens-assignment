import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import TopExpenseTypes from '../components/FeatureImportance';
import DailySpending from '../components/ActiveVsPrediction';
import TableComponent from '../components/visualisations/Table';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  table: {
    minWidth: 650,
  },
}));

export default function Dashboard() {

  // constructor(props) {
  //   super(props);

  //   this.state = {
  //       data: [],
  //       series: [],
  //       seriesSelected: ''
  //   };

  //   this.handleChange = this.handleChange.bind(this);
  // }

  const [series, setSeries] = useState([]);
  const [seriesSelected, setSeriesSelected] = useState('');
  const [data, setData] = useState([]);
  const [confusionMetric, setConfusionMetric] = useState({});
  const [featureImportance, setFeatureImportance] = useState({});
  const [modelSummary, setModelSummary] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [scoringMetrics, setScoringMetrics] = useState({});

  const handleChange = (event) => {
    setSeriesSelected(event.target.value);
  };

  useEffect(() => {
    axios.get('http://localhost:3001/series')
      .then(function (response) {
        // handle success
        setSeries(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  }, []);

  useEffect(() => {
    if(seriesSelected !== '') {
      axios.get(`http://localhost:3001/data/${seriesSelected}`)
        .then(function (response) {
          // handle success
          setData(response.data);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
  }, [series, seriesSelected]);

  useEffect(() => {
    if(seriesSelected !== '') {
      axios.get(`http://localhost:3001/predict/${seriesSelected}`)
        .then(function (response) {
          // handle success
          setPredictions(response.data.predictions);
          setFeatureImportance(response.data.featureImportance);
          setModelSummary(response.data.modelSummary);
          setScoringMetrics(response.data.scoring_metrics);
          setConfusionMetric(response.data.confusionMetric);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
    }
    
  }, [series, seriesSelected]);

  useEffect(() => {
    if(series && series.length > 0) {
      setSeriesSelected(series[0]);
    }
  }, [series]);

  const classes = useStyles();

  const dataPlot = () => {
    if((data !== [] && data.length > 0) && (predictions !== [] && predictions.length > 0)) {
      return (
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
              <DailySpending actualData={data} predictions={predictions} seriesSelected={seriesSelected} />
          </Paper>
        </Grid>
      );
    } else {
      return ;
    }
  }

  const features = () => {
    if(featureImportance && Object.keys(featureImportance).length > 0 && featureImportance.constructor === Object) {
      return (
        <Grid item xs={12} md={6}>
          <Paper className={classes.paper}>
              <TopExpenseTypes data={featureImportance}/>
          </Paper>
        </Grid>
      );
      
    } else {
      return;
    }
  }

  const confusionMatrix = () => {
    if(confusionMetric && Object.keys(confusionMetric).length > 0 && confusionMetric.constructor === Object) {
      let transformedArray = [];
      transformedArray.push(["Positive(Predicted)", confusionMetric.truePositive, confusionMetric.falsePositive]);
      transformedArray.push(["Negative(Predicted)", confusionMetric.falseNegative, confusionMetric.trueNegative]);
      let headers = ["", "Positive(Actual)", "Negative(Actual)"];
      return (
        <Grid item xs={12} md={5}>
          <Typography color="inherit" variant="subtitle1" component="div">
            Confusion Matrix
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                  <TableRow>
                      {headers.map((header) => {return (<TableCell key={header} align="center">{header}</TableCell>)})}
                  </TableRow>
              </TableHead>
              <TableBody>
                  {transformedArray.map((element) => (
                  <TableRow key={element[0]}>
                      <TableCell component="th" scope="row" align="center">
                      {element[0]}
                      </TableCell>
                      <TableCell align="center">{element[1]}</TableCell>
                      <TableCell align="center">{element[2]}</TableCell>
                  </TableRow>
                  ))}
              </TableBody>
              </Table>
          </TableContainer>
        </Grid>
      );
    } else {
      return;
    }
  }

  return (
      <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl className={classes.margin}>
                  <InputLabel id="demo-customized-select-label">Select Series</InputLabel>
                  <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    value={seriesSelected}
                    onChange={handleChange}
                    input={<BootstrapInput />}
                  > 
                    {series.map((seriesName) => <MenuItem key={seriesName} value={seriesName}>{seriesName}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              {dataPlot()}
              {features()}
              {(modelSummary && Object.keys(modelSummary).length > 0 && modelSummary.constructor === Object) 
              && <Grid item xs={5} md={3}>
                <Typography color="inherit" variant="subtitle1" component="div">
                  Model Details
                </Typography>
                <TableComponent data={modelSummary} headers={["Property","Value"]} />
              </Grid>}
              {(scoringMetrics && Object.keys(scoringMetrics).length > 0 && scoringMetrics.constructor === Object) 
              && <Grid item xs={7} md={4}>
                <Typography color="inherit" variant="subtitle1" component="div">
                  Scoring Metric
                </Typography>
                <TableComponent data={scoringMetrics} headers={["Metric","Value"]} />
              </Grid>}
              {confusionMatrix()}
              {/* <Grid item xs={12}>
                  <TransactionsTable rows={this.state.data} />
              </Grid>
              <Grid item xs={12}>
              <Paper className={classes.paper}>
                  <DailySpending data={this.state.data} />
              </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                  <TopExpenseTypes data={this.state.data}/>
              </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                  <TopSuppliers data={this.state.data} />
              </Paper>
              </Grid> */}
          </Grid>
      </Container>
  );
};