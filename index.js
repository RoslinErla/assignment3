const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
//const port = process.env.PORT || 3000;
const prefix = '/api/v1'

app.use(cors())
app.use(bodyParser.json())


//The following is an example of an array of two events. 
var events = [
    { id: 0, name: "The Whistlers", description: "Romania, 2019, 97 minutes", location: "Bio Paradís, Salur 1", capacity: 40, startDate: new Date(Date.UTC(2020, 02, 03, 22, 0)), endDate: new Date(Date.UTC(2020, 02, 03, 23, 45)), bookings: [0,1,2] },
    { id: 1, name: "HarpFusion: Bach to the Future", description: "Harp ensemble", location: "Harpa, Hörpuhorn", capacity: 100, startDate: new Date(Date.UTC(2020, 02, 12, 15, 0)), endDate: new Date(Date.UTC(2020, 02, 12, 16, 0)), bookings: [] }
];

//The following is an example of an array of three bookings.
var bookings = [
    { id: 0, firstName: "John", lastName: "Doe", tel: "+3541234567", email: "", spots: 3},
    { id: 1, firstName: "Jane", lastName: "Doe", tel: "", email: "jane@doe.doe", spots: 1},
    { id: 2, firstName: "Meðaljón", lastName: "Jónsson", tel: "+3541111111", email: "mj@test.is", spots: 5}
];

let nextEventId = 2;
let nextBookingId = 3;


app.get(prefix + '/events', function(req,res){
    
    var n = events.map((event) => {
        const necessaryInfo = {id: event.id, name: event.name, capacity: event.capacity, startDate: event.startDate, endDate: event.endDate}
        return necessaryInfo
    })
    return res.status(200).json(n)
})

app.get(prefix + '/events/:id', function(req,res){
    for (let i=0; i < events.length; i++) {
        if (events[i].id == req.params.id){
            return res.status(200).json(events[i]);
        }
    }
    res.status(404).json({'message': "event with id " + req.params.id + " doesn't exist"})
})

app.delete(prefix + '/events', function(req,res){
    for(let i= 0; i<events.length; i++){
        for (let k = 0; k<events[i].bookings.length; k++){
            for(let j= 0; j<bookings.length; j++){
                if (bookings[j].id == events[i].bookings[k]){
                    events[i].bookings[k] = bookings[j]
                }
            }
        }
    }
    var returnArray = events.slice();
    events = []
    bookings = []
    return res.status(200).json(returnArray)
})

app.post(prefix + '/events', function(req,res){
    if (req.body === undefined || req.body.name === undefined || req.body.capacity === undefined){
        res.status(400).json({'message': "Not a valid request"})
    }

    else{
        if(isNaN(Number(req.body.capacity)) || Number(req.body.capacity < 0 ) || isNaN(Number(req.body.startDate)) || isNaN(Number(req.body.endDate))){
            return res.status(400).json({'message': "Not a valid request"})
        }

        else{
            startDate = new Date(req.body.startDate * 1000)
            endDate = new Date(req.body.endDate * 1000)
            if(startDate < new Date() || startDate > endDate){
                return res.status(400).json({'message': "Not a valid request"})

            }
        }
        let newEvent = {id: nextEventId, name: req.body.name, description: req.body.description, location: req.body.location, capacity: req.body.capacity, startDate: new Date(req.body.startDate*1000), endDate: new Date(req.body.endDate*1000), bookings: []}
        events.push(newEvent)
        nextEventId++
        return res.status(201).json(newEvent)
 }
})


app.delete(prefix + '/events/:id', function(req,res){
    for (let i=0; i<events.length; i++){
        if (events[i].id == req.params.id && events[i].bookings.length == 0){
            return res.status(200).json(events.splice(i,1))
        }
    }
    res.status(400).json({'message': "This request is not valid"})
})


app.put(prefix + '/events/:id',function(req,res){
    if (req.body === undefined || req.body.name === undefined || req.body.capacity === undefined || isNaN(Number(req.body.capacity)) || Number(req.body.capacity < 0 ) || isNaN(Number(req.body.startDate)) || isNaN(Number(req.body.endDate))){
        return res.status(400).json({'message': "This request is not valid"})
    }
    else{
        startDate = new Date(req.body.startDate*1000)
        endDate = new Date(req.body.endDate * 1000)
        if(startDate < new Date() || startDate > endDate){
            return res.status(400).json({'message': "Not a valid request"})
            }
        for (let i = 0; i < events.length; i++){
            if (events[i].id == req.params.id){
                if (events[i].bookings.length == 0){
                    events[i].name = req.body.name;
                    events[i].description = req.body.description;
                    events[i].location = req.body.location;
                    events[i].capacity = req.body.capacity;
                    events[i].startDate = startDate;
                    events[i].endDate = endDate;
                    return res.status(200).json(events[i])
                }
                
                else{
                    return res.status(400).json({'message': "This request is not valid"})
                }
            }
        }
        res.status(404).json({'message': "event with id " + req.params.id + " doesn't exist"})
    }
})


app.get(prefix + '/events/:id/bookings', function(req,res){
    for (let i=0; i < events.length; i++) {
        if (events[i].id == req.params.id){
            var bookingsArray = new Array();
            for (let j=0; j< events[i].bookings.length; j++){
                for(let k= 0; k<bookings.length; k++){
                    if (bookings[k].id ==events[i].bookings[j]){
                        bookingsArray.push(bookings[k])
                    }
                }
            
        }
        return res.status(200).json(bookingsArray)}
}
res.status(404).json({'message': "event with id " + req.params.id + " doesn't exist"})
})


app.get(prefix + '/events/:id/bookings/:bookingid', function(req,res){
    for (let i=0; i < events.length; i++){
        if(events[i].id == req.params.id){
            for (let j=0; j<events[i].bookings.length; j++){
                if (events[i].bookings[j] == req.params.bookingid){
                    for (let k= 0; k < bookings.length; k++){
                        if(bookings[k].id == req.params.bookingid){
                            return res.status(200).json(bookings[k])
                        }
                    }
                }

            }
            return res.status(404).json({'message': "booking with id " + req.params.bookingid + " doesn't exist" })
        }

    }
    res.status(404).json({'message': "event with id " + req.params.id + " doesn't exist"})
})


app.delete(prefix + '/events/:id/bookings', function(req,res){
    for (let i=0; i < events.length; i++) {
        if (events[i].id == req.params.id){
            var bookingsArray = new Array();
            for (let j=0; j< events[i].bookings.length; j++){
                for(let k= 0; k<bookings.length; k++){
                    if (bookings[k].id ==events[i].bookings[j]){
                        bookingsArray.push(bookings[k])
                        events[i].bookings.splice(j,1)
                    }
                }
            
        }
        return res.status(200).json(bookingsArray)}
}
res.status(404).json({'message': "event with id " + req.params.id + " doesn't exist"})
})


app.delete(prefix + '/events/:id/bookings', function(req,res){
    for(let i = 0; i<events.length; i++){
        if(events[i].id == req.params.id){
            var bookingsArray = new Array()
            for(let j = 0; j<events[i].bookings.length; j++){
                for (let k = 0; k <bookings.lenght; k++){
                    if (bookings[k] == events[i].bookings[j]){
                        bookingsArray.push(bookings[k])
                    }
                }
            }
            
        }
        events[i].bookings = []
        return res.status(200).json(bookingsArray)
    }
    res.status(404).json({'message': "event with id " + req.params.id + " doesn't exist"})
})


app.post(prefix + '/events/:id/bookings', function(req,res){
    for(let i = 0; i<events.length; i++){
        if(events[i].id == req.params.id){
            var remainingCapacity = new Number(events[i].capacity)
            for(let j = 0; j <events[i].bookings.length; j++){
                for(let k = 0; k < bookings.length; k++){
                    if (events[i].bookings[j] == bookings[k]){
                        remainingCapacity -= new Number(bookings[k].spots)
                    }
                }
            }
        }
        if(req.body === undefined || req.body.firstName === undefined || req.body.lastName === undefined || isNaN(Number(req.body.spots)) || Number(req.body.spots) > remainingCapacity || Number(req.body.spots) <= 0 ){
            return res.status(400).json({'message': "Not a valid request"})
        }
        else{
            if (req.body.tel === undefined && req.body.email === undefined){
                console.log(req.body.email)
                return res.status(400).json({'message': "Not a valid request"})
            }
            else if(req.body.tel != undefined && isNaN(Number(req.body.tel))){
                return res.status(400).json({'message': "Not a valid request"})
            }
        let newBooking = {id: nextBookingId, firstName: req.body.firstName, lastName: req.body.lastName, spots: req.body.spots, email: req.body.email, tel: req.body.tel}
        bookings.push(newBooking)
        events[i].bookings.push(newBooking.id)
        nextBookingId++
        return res.status(201).json(newBooking)
        }
    }
    return res.status(404).json({'message': "event with id " + req.params.id + " doesn't exist"})
})


app.use('*', function(req,res){
    res.status(405).json({'message': "This operation is not supported"})
})


//making id new_id = events.length      new_id = bookings.length
//checking capacity. If (capacity <= 0)
//checking spots booking. If (spots < 0)
//checking if available spots. fer í gegnum eventinn. Tek capacity geri síðan það - öll spots sem eru í bookking. ef sú tala er minni en spots þá er það villa
//checking numbers. if not isNan()
//check dates. First check number and then check if both the dates are in the future. unix time stamp format
//end date bigger. If(startdate < enddate) check piazza




app.listen(3000, () => (
    console.log('listening to port 3000')
))

/*app.post búa til fleirtala
app.get 
app.delete
app.put update
*/

 