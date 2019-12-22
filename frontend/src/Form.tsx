import React,{Component, CSSProperties} from 'react';
import Axios from 'axios';

interface Props {

  getCurrentWeather:(data:any)=>void
}

interface State{
  city:String,
  country:String
  lan:String,
  latLon:LatLonInfo

}
interface LatLonInfo{
  lat:String,
  lon:String
}

export default class Form extends Component<Props,State>{
  constructor(props:Props){
    super(props);
    this.state ={
      city:'',
      country:'',
      lan:'',
      latLon:{lat:'',lon:''},
    }
  }
  /* Get current city/subcity latitude and longitude and set state to current city and send the state to app */
  handleSubmit= async (event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault()

    let url = '/getLatLong/'+this.state.city+'/'+this.state.country+'/'+this.state.lan;
    let res = await Axios.get(url);
    let resJson = await res;

      
    if(resJson.status === 200){
      if(resJson.data.Response.View && resJson.data.Response.View.length > 0) {
  
        let locations = this.getAllMachedLocations(resJson.data.Response.View[0].Result);
        let exactLocation = this.checkExactLocation(locations);
  
        if(exactLocation.length > 0) {

          let latitude = exactLocation[0].DisplayPosition.Latitude;
          let longitude = exactLocation[0].DisplayPosition.Longitude;
          let district = exactLocation[0].Address.District;
          let kommun = exactLocation[0].Address.Kommun;
          let lan = exactLocation[0].Address.State;
          //vi check for stad eller delstad
          var citySubCity= district === undefined ? exactLocation[0].Address.City:exactLocation[0].Address.District;
         //vi sätter state och skickar vidare state till app
          this.setState(
            { city:citySubCity,
              country:kommun,
              lan:lan,
              latLon:{lat:latitude,lon:longitude } } 
            ,()=>{this.props.getCurrentWeather(this.state)})
  
        }else {
          alert('Kunde inte hitta din exakta position! försök med en ny igen!')
        }
      } else {
        alert("Request gick bra men vi hittar inte lat och lon for denna positionen!")
      }
    
    } else {
      alert("Request to get the lat and lon failed!")
     
  
    }
  
  }
    getAllMachedLocations =(results:any)=>{
         return results.map((location:any)=>{
            return location.Location
    
        })
      
    }
    checkExactLocation =(locations:any)=>{
      let ch1 = this.state.country.charAt(0).toUpperCase();
      let resCh1 = this.state.country.substr(1).toLowerCase();
      let ch2 = this.state.city.charAt(0).toUpperCase();
      let resCh2 = this.state.city.substr(1).toLowerCase();
      let foundCountry = false
      return locations.filter((location:any)=>{
    
        //Vi hittar rätt kommun här
        let kommun = location.Address.AdditionalData.filter((el:any)=>{
          if(el.value ===ch1+resCh1) {
            return foundCountry=true
          }
        })
        //Vi kolla på stad eller delstad + län+land+ 
        if(location.Address.City === ch2+resCh2 || location.Address.District === ch2+resCh2 && kommun.length>0 && foundCountry === true && location.Address.State === this.state.lan &&location.Address.Country === "SWE" ){
          location.Address.Kommun = kommun[0].value
            return location
          }
          
      
      })
    }






    
    //sundsvall västernorrlands län
    displayAllLans=()=>{
      let allLans = ["Blekinge län","Dalarnas län", "Gotlands län","Gävleborgs län","Hallands län","Jämtlands län",
      "Jönköpings län","Kalmar län","Kronobergs län","Norrbottens län","Skåne län","Stockholms län","Södermanland län",
      "Uppsala län","Värmlands län","Västerbottens län","Västernorrlands län","Västmanlands län", "Västra Götalands län","Örebro län",
      "Östergötlands län"
        ];
      return allLans.map((lan,index)=>{
      return <option key={index} value={lan}>{lan}</option>
      })
    }

    handleOnChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
      this.setState({city:event.target.value})
      
      
    }
    handleSelect = (event: React.ChangeEvent<HTMLSelectElement> )=>{
     
      this.setState({lan:event.target.value});
      
    }
    handleOnChange2 = (event: React.ChangeEvent<HTMLInputElement>)=>{
      this.setState({country:event.target.value});
      
    }
  


    render(){
        return(
            <form onSubmit={this.handleSubmit} style={formtStyle}>

            <label htmlFor="text" style={input}>
              Ange ditt stads namn/delstad med små bokstav
              <input type="text"  placeholder='stad' onChange={this.handleOnChange} required/>
            </label>
          
            <label htmlFor="text">Ange bara ditt kommuns namn Ex: skövde: med små bokstav <input type="text"  placeholder="kommun" onChange={this.handleOnChange2} required/></label>
            <label htmlFor="text">
            Välj ditt län:
            <select onChange={this.handleSelect} style={input} required>
              {this.displayAllLans()}
            </select>
            </label>
            <input type="submit" value="submit"/>
          </form>

        )
    }
}

const formtStyle: CSSProperties ={
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    margin:"auto",
    width:"50%",
    marginTop:"3em",
    padding:"1em",
    backgroundColor:"#d7e4c7"
  }
  const input: CSSProperties={
    margin:"1em"
  }



