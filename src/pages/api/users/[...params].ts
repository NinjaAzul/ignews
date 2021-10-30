import  {NextApiRequest,NextApiResponse} from "next";
/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default (request:NextApiRequest, response : NextApiResponse) =>{
  const all = request.query;

  console.log(all);
  //retorna tudo depois de users/ id/test
  console.log(request.query)
 const users = [
   {id:1 , name:"erick"},
   {id:2, name:"fernando"},
   {id:3, name:"kaik"}
 ]

const userFindById = users.filter(user => {
    return user.id === Number(all);
  })

  return response.json(userFindById)
}