const mongoose =require('mongoose')



const row_wiseSchema = mongoose.Schema({
    s1://seat name
       {
        type: Boolean,
       
       },
       s2:
       {
        type: Boolean,
       },
       s3:
       {
        type: Boolean,
       },
       s4:
       {
        type: Boolean,
       },
       s5:
       {
        type: Boolean,
       },
       s6:
       {
        type: Boolean,
       },
       s7:
       {
        type: Boolean,
       },
       
});
  

const seatSchema =new mongoose.Schema({
   
    row_name:
    {
        type: String,
        required: true
    },
    seats:
    {
       type: row_wiseSchema,
       required: true,
    },
    

})
module.exports =mongoose.model('Seat',seatSchema)

