import React, { useEffect, useState } from 'react'
import { system_instruction, system_instruction_Update } from '../api/api_link';
import "./Form.css";
import { toast } from 'react-toastify';

function System() {
  const [temperature,setTemperature] = useState()
  const [instruction,setInstruction] = useState()
 
  useEffect(()=>{
    async function get_system_role () {
      const data =  await system_instruction()

      console.log(data);
      setTemperature(data.temperature_instruction)
      setInstruction(data.system_instruction)
      
    }
    get_system_role();
  },[]);

  async function update_system_instruction(e){
     e.preventDefault();
     const data={
      temperature_instruction:temperature,
      system_instruction:instruction,
     }
     try{
         const message = await system_instruction_Update(data)
         if (message.update == 'True'){
          
          toast.success(message.message)
         }

     }
     catch{
            toast.error("User Data  Not Update")
     }
  }


  return (
    <>
    <div className="system_info">
      <form onSubmit={update_system_instruction} >
       <h4>Temperature</h4>
       {temperature} 
       <input type='range' min="0"  max="2"  step="0.1"  value={temperature} onChange={(e)=>setTemperature(Number(e.target.value))}></input>
       System Instruction
       <input type='text' placeholder='System Role' value={instruction} onChange={(e)=>setInstruction((e.target.value))}></input>
       <button> Update </button>
       </form>
    </div>
    </>
  )
}

export default System