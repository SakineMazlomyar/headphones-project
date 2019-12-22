import React,{ Component } from 'react';
import Axios from 'axios';
import Form from './Form';
import Temperature from './Temperature';

interface State {
  observations:any
}

interface Props {}
export default class App  extends Component<Props,State> {

  constructor(props: Props){
    super(props);
    this.state={
      observations:[]
    }
  }

  /*Get current  weather for current latitude and longitude + 6 near cities near to that city
  and set state observations and send it to temperature component*/
  getCurrentWeather = async (currentCityInfo:any)=> {

      let url = '/getCurrentWeather/'+currentCityInfo.latLon.lat+'/'+currentCityInfo.latLon.lon;
      let response = await Axios.get(url);
      if(response.status !== 200) {
        alert("Request failt to get current weather for this pos!")
      } else {

        let currentWeather = await response;
        if(currentWeather.data !== 'undefined' || currentWeather.data !== ' ') {

          let temperatur= this.checkCurrentTempForCurrentLoc(currentWeather.data.observations.location, currentCityInfo)
          if(temperatur.length>0) {

            this.setState({ observations:temperatur})
          } else {
            alert('Vi hittar inga observation för denna positionen!')
          }
        } else {
          alert('Requested gick bra men vi hittar inga temperatur för nuvarande positionen, Försök med annan pos!')
        }
      
      }

  }
  /* Check the observations obj for the current city/subcity */
  checkCurrentTempForCurrentLoc = (locationsWithTem:any, currentCityOrSubcityInfo:any)=>{
    let ch1 = currentCityOrSubcityInfo.city.charAt(0).toUpperCase();
    let resCh1 = currentCityOrSubcityInfo.city.substr(1).toLowerCase();
    if(locationsWithTem.length > 0 ){

      return locationsWithTem.filter(( obs:any )=> {

        if(obs.city === ch1+resCh1  && obs.country === "Sweden") {
          return obs
        }
      })
    }
    
  }


 
  render() {
    return (
    <div>
      <Temperature observations={this.state.observations} />  
      <Form getCurrentWeather={this.getCurrentWeather}/>
    </div>)
  }

}

