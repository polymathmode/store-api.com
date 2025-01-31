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





