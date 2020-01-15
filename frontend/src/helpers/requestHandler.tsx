import Axios from 'axios';
export async function requestHandler(requestBody:any){
    
      try  {
        let res = await Axios({
            url:'/graphql',
            method: 'POST',
            data: JSON.stringify(requestBody),
            headers: {
              'Content-Type': 'application/json'
            }
          })
          
          let actuResponse = await res.data;
        
        
        if (res.status !== 200) {
            //When user insert wrong info we send it catch
            throw new Error('Request Failed at request handler'+ res.status)
        } else {
          return actuResponse.data
          
        }


      } catch(err){
         console.log(err)
      }
}

export async function loginHandler(requestBody:any){
  try  {
    let res = await Axios({
        url:'/graphql',
        method: 'POST',
        data: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      let actuResponse = await res.data;
    
    
    if (res.status !== 200) {
        //When user insert wrong info we send it catch
        throw new Error('Request Failed '+ res.status)
    } else if(actuResponse.data.createUser === null || actuResponse.data === null) {
        //When use insert the same email to create a new user
        alert(actuResponse.errors[0].message);
    } else if(actuResponse.errors) {
         
          alert('Error at sign in!')
    } else {
      //this.props.isLoggedin(actuResponse.data.login)
        return actuResponse.data
    }


  } catch(err){
    alert('Wrong info!Try again!')
     console.log(err)
  }
}
export async function changeUrl(url:string){
  try {
    let response = await Axios.get(url);
    let actuallResponse = await response.data;


  } catch(error) {
    console.log(error)
  }
  
}