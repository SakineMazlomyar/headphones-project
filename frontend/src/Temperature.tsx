import React,{Component, CSSProperties } from 'react';
interface Props {

    observations:any,

}

interface State{}

export default class Temperature extends Component<Props,State>{
    
    dispplayCurrentWeather =()=>{
        if( this.props.observations.length>0 ) {
            return  this.props.observations.map((obs:any)=>{
                return (
                    <div style={styleCurrentWeather} key={Math.floor(Math.random()*100)}>
                        <h1>Temperaturen: {obs.observation[0].temperature}</h1>
                        <h1>Staden: {obs.observation[0].city}</h1>
                        <h1>Icon namnet: {obs.observation[0].iconName}</h1>
                        <p> Beskrivning: {obs.observation[0].description} </p>
                        <img style={imgSize} src={obs.observation[0].iconLink} alt={obs.observation[0].iconName}/>
                    </div>)
            })

        } else {
            return (<h1 style={styleCurrentWeather}>Sök en  position</h1>)
        }
    }
   
    render(){
        return(
           <div style={div1}>
              {this.dispplayCurrentWeather()}
           </div>

        )
    }
}
const div1: CSSProperties = {
    position:"relative",
}
const imgSize: CSSProperties = {
    width:"2em",
}
const styleCurrentWeather: CSSProperties ={
    position:"relative",
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    margin:"auto",
    width:"50%",
    padding:"1em",
    marginTop:'2em',
    backgroundColor:"#d7e4c7"

}