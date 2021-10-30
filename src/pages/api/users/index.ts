import  {NextApiRequest,NextApiResponse} from "next";
/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (request:NextApiRequest, response : NextApiResponse) =>{

 const users = [
   {id:1 , name:"erick"},
   {id:2, name:"fernando"},
   {id:3, name:"kaik"}
 ]

  return response.json(users)
}