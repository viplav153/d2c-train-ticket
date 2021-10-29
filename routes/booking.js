const express = require('express')
const Seat =require('./../models/seats')
const router =express.Router()
let reserved_seats=[]
let reserved_row=[]
let seat_structure=[]
const total_rem_seats = async () => {
    const seat = await Seat.find()
    let seat_filled_count=0;
    let total_seat=84 //12 roew of 7 seats in which in last row 4 seats are always filled
    seat_structure=[]
    seat.forEach( async(col)=>{
        let row_struture=[]
        let count_each_row=0;
        if(col.seats.s1==false)
        {
            count_each_row+=1
            row_struture.push(0);
        }
        else
        {
            row_struture.push(1);
        }
        if(col.seats.s2==false)
        {
            count_each_row+=1
            row_struture.push(0);
        }
        else
        {
            row_struture.push(1);
        }
        if(col.seats.s3==false)
        {
            count_each_row+=1
            row_struture.push(0);
        }
        else
        {
            row_struture.push(1);
        }
        if(col.seats.s4==false)
        {
            count_each_row+=1
            row_struture.push(0);
        }
        else
        {
            row_struture.push(1);
        }
        if(col.seats.s5==false)
        {
            count_each_row+=1
            row_struture.push(0);
        }
        else
        {
            row_struture.push(1);
            
        }
        if(col.seats.s6==false)
        {
            count_each_row+=1
            row_struture.push(0);
        }
        else
        {
            row_struture.push(1);
        }
        if(col.seats.s7==false)
        {
            count_each_row+=1
            row_struture.push(0);
        }
        else
        {
            row_struture.push(1);
        }
        seat_structure.push(row_struture)
        //adding total seat filled
        seat_filled_count=seat_filled_count+(7-count_each_row)
          
    });
   //filling seats if found in row
   
    return total_seat-seat_filled_count

};


//seat allocation
const seat_allocation = async (no_seat) => {
    const seat = await Seat.find()
    let seat_filled_count=0;
    let total_seat=84 //12 roew of 7 seats in which in last row 4 seats are always filled
    let mi=9999
    let flag=0//to check that passenger can accomodate in a row or not
    let row_number=""//if pssenger assigned row if they can accomate in a row
    //will try to give seat in a row using best fit algo
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
        if(count_each_row-no_seat>=0 && mi>count_each_row-no_seat)
        {
            flag=1
            mi=count_each_row-no_seat
            row_number=col.row_name
        }
        //adding total seat filled
        seat_filled_count=seat_filled_count+(7-count_each_row)
          
    });
   //filling seats if found in row
    if(flag==1)
    {
        console.log(row_number)
        const row_to_assign = await Seat.findOne({row_name:row_number})
        let count=0
        for(let i=1;i<=7;i++)
        {
            let b="s"+(i).toString()
            if(row_to_assign.seats[b]==false)
            {
                row_to_assign.seats[b]=true
                reserved_seats.push(b)
                reserved_row.push(row_number)
                count+=1
                
            }
            if(count==no_seat)
            {
                await row_to_assign.save()
                break
            }

        }
        
    }
    else//if we cannot assign in same row we will start assigning from start empty seats
    {
        let count=0
        let flag_complete=0
        for(let i=1;i<=12;i++)
        {
            let row_nam="r"+(i).toString()
            const row_to_assign = await Seat.findOne({row_name:row_nam})
            for(j=1;j<=7;j++)
            {
                let b="s"+(j).toString()
                if(row_to_assign.seats[b]==false)
                {
                    row_to_assign.seats[b]=true
                    reserved_seats.push(b)
                    reserved_row.push(row_nam)
                    count+=1
                    
                }
                if(count==no_seat)
                {
                    await row_to_assign.save()
                    flag_complete=1
                    break
                }
            }
            if(flag_complete==1)
            {
                break
            }
            await row_to_assign.save()

        }

    }

    console.log(total_seat-seat_filled_count)

};



router.get('/new_book', async(req,res)=>
{
    let message =""
    let total_rem_sits= await total_rem_seats()
    res.render('ticket/new_ticket',{message:message,seat_structure:seat_structure});
}
) 

router.post('/new_book',async(req,res)=>  
{
    
    let name=req.body.name
    let ticket_demand=req.body.no_of_ticket
    let emal=req.body.email
    console.log(name);
    console.log(ticket_demand)
    let total_rem_sits= await total_rem_seats()

    if(total_rem_sits<ticket_demand)
    {
        let message ="Regret! Sorry seats are full :-<"
        res.render('ticket/new_ticket',{message:message,seat_structure:seat_structure})
    }
    else
    {
        reserved_seats=[]
        reserved_row=[]
        await seat_allocation(ticket_demand)
        console.log(reserved_seats)
        console.log(reserved_row)
        n =  new Date();
        y = n.getFullYear();
        m = n.getMonth() + 1;
        d = n.getDate();
        date = m + "/" + d + "/" + y;
        res.render('ticket/ticket_confirm',{date:date,name:name,email:emal,reserved_seats:reserved_seats,reserved_row:reserved_row})
    }

   
}
)





module.exports=router