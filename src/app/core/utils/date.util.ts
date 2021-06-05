import * as moment from 'moment'

export const getLocaleDate = (timestamp) => {
    const localDate = moment(timestamp).format("YYYY-MM-DD").toString()
    return localDate
}


// export const getLocaleDateAndTime = (timestamp) => {
//   const localDate = moment(timestamp).format("YYYY-MM-DD hh:mm:ss").toString()
//   return localDate
// }

