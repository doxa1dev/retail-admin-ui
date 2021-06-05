export function CheckNullOrUndefinedOrEmpty(value: any){
    return value === null || value === undefined || value.length === 0 || value ===""
}

export function CheckNullOrUndefined(value: any){
  if(value === null || value === undefined){
    return true;
  }else{
    return false
  }
}


