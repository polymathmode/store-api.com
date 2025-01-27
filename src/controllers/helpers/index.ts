import jwt from 'jsonwebtoken';



// export const generateToken = (user: any): string => 
//   jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET!,
//     { expiresIn: '1d' }
//   );


  export const buildQuery=(queryParams:any)=>{
    const {category,sort,page=1,limit=10}=queryParams
    return {
      filter:category ? {category}:{},
      options:{
        sort:sort?{[String(sort)]:-1} : {createdAt:-1},
        skip:(Number(page)-1)*Number(limit),
        limit:Number(limit)
      }
    }
}

// const buildQuery = (queryParams: any) => {
//    const { category, sort, page = 1, limit = 10 } = queryParams;
 
//   return {
//     filter: category ? { category } : {},
//     options: {
//       skip: (Number(page) - 1) * Number(limit),
//       limit: Number(limit),
//       sort: sort ? { [String(sort) ]: -1 } : { createdAt: -1 } 
//     }
//   };
// };




