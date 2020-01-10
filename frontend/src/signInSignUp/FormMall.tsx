import React,{CSSProperties} from 'react';
interface Props {
    children: React.ReactNode
}
export default function FormNall(props:Props){

    return (
      <div style={formtStyle}>
          {props.children}
      </div>

    )
  
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