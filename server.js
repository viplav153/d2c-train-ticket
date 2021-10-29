const express = require('express')
const mongoose =require('mongoose')
const Seat =require('./models/seats')
const methodOverride =require('method-override')
const ticketRouter= require('./routes/booking')
const app =express()

//database config
const port=process.env.PORT || 5000
// Step 2
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/ticket', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
})


app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//creation of seats if it was not present previosly in data base
const make_obj = async () => {
    for(let i=0;i<12;i++)
    {
        let a="r"+(i+1).toString()
        if(i!=11)
        {
            let article =new Seat({
                row_name: a,
                seats:
                {
                   s1: false,
                   s2: false,
                   s3: false,
                   s4: false,
                   s5: false,
                   s6: false,
                   s7: false,
        
                }
                 
            })
            article= await article.save()
        }
        else
        {
            let article =new Seat({//for last row 
                row_name: a,
                seats:
                {
                   s1: false,
                   s2: false,
                   s3: false,
                   s4: true,
                   s5: true,
                   s6: true,
                   s7: true,
                }
                 
            })
            article= await article.save()
        }
    }
    
};
//for reseting seats means empty all the seats
const reset_schema = async () => {
    const seat = await Seat.find()
    let row_count=0
    seat.forEach( async(col)=>{
        if(row_count!=11)
        {
            col.seats.s1=false;
            col.seats.s2=false;
            col.seats.s3=false;
            col.seats.s4=false;
            col.seats.s5=false;
            col.seats.s6=false;
            col.seats.s7=false;
        }
        else
        {
            col.seats.s1=false;
            col.seats.s2=false;
            col.seats.s3=false;
            col.seats.s4=true;
            col.seats.s5=true;
            col.seats.s6=true;
            col.seats.s7=true;

        }
        row_count=row_count+1
        article= await col.save()
        
    });


};

//check total empty seats
const total_rem_seats = async () => {
    const seat = await Seat.find()
    let seat_filled_count=0;
    let total_seat=84 //12 roew of 7 seats in which in last row 4 seats are always filled

    seat.forEach( async(col)=>{
        let count_each_row=0;
        if(col.seats.s1==false)
        {
            count_each_row+=1
        }
        if(col.seats.s2==false)
        {
            count_each_row+=1
        }
        if(col.seats.s3==false)
        {
            count_each_row+=1
        }
        if(col.seats.s4==false)
        {
            count_each_row+=1
        }
        if(col.seats.s5==false)
        {
            count_each_row+=1
        }
        if(col.seats.s6==false)
        {
            count_each_row+=1
        }
        if(col.seats.s7==false)
        {
            count_each_row+=1
        }
       
        //adding total seat filled
        seat_filled_count=seat_filled_count+(7-count_each_row)
          
    });
   //filling seats if found in row
   
    return total_seat-seat_filled_count

};



app.get('/',async(req,res)=>
{
    const seat = await Seat.find()
    let flag=0;
    seat.forEach(function(col){
        flag=1
    });
    if(flag==0)//seats was not created previously in database
    {
        make_obj()
    }
   let total_rem_sits= await total_rem_seats()
   console.log("server Started")
   res.render("ticket/index",{total_rem_sits:total_rem_sits})
})

app.get('/reset',async(req,res)=>//just in case if want to reset seat
{
    const seat = await Seat.find()
    let flag=0;
    seat.forEach(function(col){
        flag=1
    });
    if(flag==0)//seats was not created previously in database
    {
        await make_obj()
    }
    await reset_schema()
    await sleep(200);
   let total_rem_sits= await total_rem_seats()
   res.render("ticket/index",{total_rem_sits:total_rem_sits})
})

app.use('/ticket',ticketRouter)

app.listen(port)